//The different hardware we support + their specific data/configs
const table = {
    0x0403: {"FTDI": {
            0x6001: "FT232R",
            0x6010: "FT2232H",
            0x6011: "FT4232H",
            0x6014: "FT232H",
            0x6015: "FT231X", // same ID for FT230X, FT231X, FT234XD
        }},
    0x1a86: {"Quinheng": {
            0x7523: "CH340",
            0x5523: "CH341A",
        }},
    0x10c4: {"Silicon Labs": {
            0xea60: "CP210x", // same ID for CP2101, CP2103, CP2104, CP2109
            0xea70: "CP2105",
            0xea71: "CP2108",
        }},
    0x067b: {"Prolific": {
            0x2303: "PL2303"
        }}
}

const config =  {
    "DEBUG"                             : true,
    "DEFAULT_BAUD_RATE"                 :  38400,
    "BAUD_RATES"                        :  [600,1200,2400,4800,9600,14400,19200,38400,57600,115200,230400], // highest is 300 0000 limited by the BAUD_RATE_MAX_BPS
    //CH34x --> https://github.com/torvalds/linux/blob/master/drivers/usb/serial/ch341.c <-- we have used the linux driver and made into a webUSB driver
    // plus -->  https://github.com/felHR85/UsbSerial/tree/master/usbserial/src/main/java/com/felhr/usbserial  <--
    "CH340": {
        "REQUEST_READ_VERSION": 0x5F,
        "REQUEST_READ_REGISTRY": 0x95,
        "REQUEST_WRITE_REGISTRY": 0x9A,
        "REQUEST_SERIAL_INITIATION": 0xA1,
        "REG_SERIAL": 0xC29C,
        "REG_MODEM_CTRL": 0xA4,
        "REG_MODEM_VALUE_OFF": 0xFF,
        "REG_MODEM_VALUE_ON": 0xDF,
        "REG_MODEM_VALUE_CALL": 0x9F,
        "REG_BAUD_FACTOR": 0x1312,
        "REG_BAUD_OFFSET": 0x0F2C,
        "REG_BAUD_LOW": 0x2518,
        "REG_CONTROL_STATUS": 0x2727,
        "BAUD_RATE": {
            600:    {"FACTOR": 0x6481, "OFFSET": 0x76},
            1200:   {"FACTOR": 0xB281, "OFFSET": 0x3B},
            2400:   {"FACTOR": 0xD981, "OFFSET": 0x1E},
            4800:   {"FACTOR": 0x6482, "OFFSET": 0x0F},
            9600:   {"FACTOR": 0xB282, "OFFSET": 0x08},
            14400:  {"FACTOR": 0xd980, "OFFSET": 0xEB},
            19200:  {"FACTOR": 0xD982, "OFFSET": 0x07},
            38400:  {"FACTOR": 0x6483, "OFFSET": null},
            57600:  {"FACTOR": 0x9883, "OFFSET": null},
            115200: {"FACTOR": 0xCC83, "OFFSET": null},
            230500: {"FACTOR": 0xE683, "OFFSET": null},
        }
    }
}

const serial = {};
let device = {};
let port;

(function() {
    'use strict';
    serial.getPorts = function() {
        return navigator.usb.getDevices().then(devices => {
            return devices.map(device => new serial.Port(device));
        });
    };

    serial.requestPort = function() {
        let supportedHardware = [];
        //This one create the filter of hardware based on the hardware table
        Object.keys(table).map(vendorId => {
            Object.keys(table[vendorId]).map(vendorName => {
                Object.keys(table[vendorId][vendorName]).map(productId => {
                    supportedHardware.push({
                        "vendorId": vendorId,
                        "productId": productId
                    })
                })
        })});
        //device contains the "device descriptor" (see USB standard), add as a new device to be able to control
        return navigator.usb.requestDevice({ 'filters': supportedHardware }).then(
            device => new serial.Port(device)
        );
    }

    //set it to the active device..
    serial.Port = function(device) {
        this.device_ = device;
    };

    //here's the config + read loop is taking place....
    serial.Port.prototype.connect = function() {
        //this is the read loop on whatever port is currently used... it will repeat itself
        let readLoop = () => {
            this.device_.transferIn(this.endpointIn_, this.endpointInPacketSize_).then(result => {
                readLoop();
                if(sessionStorage.getItem('webusb')){
                    sessionStorage.setItem('webusb', sessionStorage.getItem('webusb') + ',' + (new Uint8Array(result.data.buffer)).toString())
                }else{
                    sessionStorage.setItem('webusb', (new Uint8Array(result.data.buffer)).toString())
                }
            }, error => {
                this.onReceiveError(error);
            });
        };

        return this.device_.open()
            .then(() => {
                //first we get some GUI stuff populated, we use "device" for that... serial and port are used for the configuration elsewhere
                device.hostName = port.device_.productName;
                device.vendorName = Object.keys(table[port.device_.vendorId])[0];
                device.chip = table[port.device_.vendorId][device.vendorName][port.device_.productId];
                device.serialNumber = port.device_.serialNumber;
                device.manufacturerName = port.device_.manufacturerName;
                //1: we set an configuration (configuration descriptor in the USB standard)
                if (this.device_.configuration === null) {
                    return this.device_.selectConfiguration(1);
                }
            })
            .then(() => {
                //2: we set what endpoints for data we will use, we use only "bulk" transfer and thus we parse their addresses
                let configInterfaces = this.device_.configuration.interfaces;
                configInterfaces.forEach(element => {
                    element.alternates.forEach(elementalt => {
                        if (elementalt.interfaceClass === 0xff) {
                            this.interfaceNumber_ = element.interfaceNumber;
                            elementalt.endpoints.forEach(elementendpoint => {
                                //This part here get the bulk in and out endpoints programmatically
                                if (elementendpoint.direction === "out" && elementendpoint.type === "bulk") {
                                    this.endpointOut_ = elementendpoint.endpointNumber;
                                    this.endpointOutPacketSize_ = elementendpoint.packetSize;
                                }
                                if (elementendpoint.direction === "in" && elementendpoint.type === "bulk") {
                                    this.endpointIn_ = elementendpoint.endpointNumber;
                                    this.endpointInPacketSize_ = elementendpoint.packetSize;
                                }
                            })
                        }
                    })
                })
            })
            //3: we claim this interface and select the alternative interface
            .then(() => this.device_.claimInterface(this.interfaceNumber_))
            .then(() => this.device_.selectAlternateInterface(this.interfaceNumber_, 0))
            //4: we configure in and out transmissions, based on detected hardware
            .then(() => serial[device.chip](this))
            //5: we start the loop
            .then(() => {
                //console.log(this);
                readLoop();
            })
    };

    //upon disconnect, what to do
    serial.Port.prototype.disconnect = async function() {
        await serial[device.chip](this).DISCONNECT;
    };

    //send data, what to do
    serial.Port.prototype.send = function(data) {
        return this.device_.transferOut(this.endpointOut_, data);
    };

    serial.controlledTransfer = async function (object, direction, type, recipient, request, value = 0, data = new DataView(new ArrayBuffer(0)), index = object.interfaceNumber_) {
        direction = direction.charAt(0).toUpperCase() + direction.slice(1);
        type = type.toLowerCase();
        recipient = recipient.toLowerCase();
        if (data.byteLength === 0 && direction === "In") {
            // we set how many bits we want back for an "in"
            // so set data = 0....N in the call otherwise it will default to 0
            data = 0;
        }
        return await object.device_["controlTransfer" + direction]({
            'requestType': type,
            'recipient': recipient,
            'request': request,
            'value': value,
            'index': index
        }, data)
            .then(res => {
                if (config.DEBUG) {
                    //debugger;  // remove comment for extra debugging tools
                    console.log(res);
                }
                if (res.status !== "ok") {
                    let errorRequest = `
                            controlTransfer` + direction + `
                            'requestType': ` + type + `,
                            'recipient': ` + recipient + `,
                            'request': 0x` + request.toString(16) + `,
                            'value': 0x` + value.toString(16) + `,
                            'index': 0x` + index.toString(16) + `
                            }`;
                    console.warn("error!", errorRequest, data) // add more here
                }
                if (res.data !== undefined && res.data.buffer !== undefined) {
                    return res.data.buffer;
                }
                return null;
            });
    };

    // you can really use any numerical value since JS treat them the same:
    // dec = 15         // dec will be set to 15
    // bin = 0b1111;    // bin will be set to 15
    // oct = 0o17;      // oct will be set to 15
    // oxx = 017;       // oxx will be set to 15
    // hex = 0xF;       // hex will be set to 15
    // note: bB oO xX are all valid
    serial.hexToDataView = function (number) {
        if (number === 0) {
            let array = new Uint8Array([0]);
            return new DataView(array.buffer)
        }
        let hexString = number.toString(16);
        // split the string into pairs of octets
        let pairs = hexString.match(/[\dA-F]{2}/gi);
        // convert the octets to integers
        let integers = pairs.map(function(s) {
            return parseInt(s, 16);
        });
        let array = new Uint8Array(integers);
        return new DataView(array.buffer);
    }

    // you can give this method a string like "00 AA F2 01 23" or "0x00 0xAA 0xF2 0x01 0x23" and it will turn it into a DataView for the webUSB API transfer data
    serial.hexStringArrayToDataView = function (hexString) {
        // remove the leading 0x (if any)
        hexString = hexString.replace(/^0x/, '');
        // split the string into pairs of octets
        let pairs = hexString.split(/ /);
        // convert the octets to integers
        let integers = pairs.map(function(s) {
            return parseInt(s, 16);
        });
        let array = new Uint8Array(integers);
        return new DataView(array.buffer);
    }

    serial.arrayBufferToHex = function (arrayBuffer) {
        let hex = "0x0" + Array.prototype.map.call(new Uint8Array(arrayBuffer), x => ('00' + x.toString(16)).slice(-2)).join('');
        return parseInt(hex);
    }

    // these are the hardware specific initialization procedures...
    serial["CH340"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {
        let data = serial.hexToDataView(0); // null data
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_SERIAL_INITIATION, config.CH340.REG_SERIAL, data, 0xB2B9)  // first request...
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REG_MODEM_CTRL, config.CH340.REG_MODEM_VALUE_ON);
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REG_MODEM_CTRL, config.CH340.REG_MODEM_VALUE_CALL);
        let r = await serial.controlledTransfer(obj,"in", "vendor", "device", config.CH340.REQUEST_READ_REGISTRY, 0x0706, 2);
        r = serial.arrayBufferToHex(r);
        if (r < 0) {
            // we have an error
            return;
        }
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_WRITE_REGISTRY, config.CH340.REG_CONTROL_STATUS, data);
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_WRITE_REGISTRY, config.CH340.REG_BAUD_FACTOR, data, 0xB282);
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_WRITE_REGISTRY, config.CH340.REG_BAUD_OFFSET, data, 0x0008);
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_WRITE_REGISTRY, config.CH340.REG_BAUD_LOW, data, 0x00C3);
        r = await serial.controlledTransfer(obj,"in", "vendor", "device", config.CH340.REQUEST_READ_REGISTRY, 0x0706, 2);
        r = serial.arrayBufferToHex(r);
        if (r < 0) {
            // we have an error
            return;
        }
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_WRITE_REGISTRY, config.CH340.REG_CONTROL_STATUS, data);
        await serial["CH340"].setBaudRate(obj, baudRate);

        // now what? all the control transfers came back "ok"?
    }

    serial["CH340"].setBaudRate = async function (obj, baudRate) {
        let data = serial.hexToDataView(0);
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_WRITE_REGISTRY, config.CH340.REG_BAUD_FACTOR, data, config.CH340.BAUD_RATE[baudRate].FACTOR);
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_WRITE_REGISTRY, config.CH340.REG_BAUD_OFFSET, data, config.CH340.BAUD_RATE[baudRate].OFFSET);
        await serial.controlledTransfer(obj,"out", "vendor", "device", config.CH340.REQUEST_WRITE_REGISTRY, config.CH340.REG_CONTROL_STATUS, data);
    }

    serial["CH340"].DISCONNECT = async function (obj) {
        await serial.controlledTransfer(obj,"in", "vendor", "device", config.CH340.REG_MODEM_CTRL, config.CH340.REG_MODEM_VALUE_OFF);
    }

    serial["CP210x"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {

    }

    serial["CP2105"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {

    }

    serial["CP2108"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {

    }

    serial["PL2303"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {

    }

    serial["FT2232H"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {

    }

    serial["FT4232H"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {

    }

    serial["FT232H"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {

    }

    serial["FT231X"] = async function (obj, baudRate = config.DEFAULT_BAUD_RATE) {

    }
})();

//GUI function "connect"
function connect() {
    port.connect().then(() => {
        document.getElementById('editor').value = "connected to: " + device.hostName + "\nvendor name: " + device.vendorName + "\nchip type: " + device.chip;
        port.onReceive = data => {
            console.log(data);
            document.getElementById('output').value += new TextDecoder().decode(data);
        }
        port.onReceiveError = error => {
            //console.error(error);
            port.disconnect();
        };
    });
}

//GUI function "disconnect"
function disconnect() {
    port.disconnect();
}

//GUI function "send"
function send(string) {
    console.log("sending to serial:" + string.length);
    if (string.length === 0)
        return;
    console.log("sending to serial: [" + string +"]\n");

    let data = new TextEncoder('utf-8').encode(string);
    console.log(data);
    if (port) {
        port.send(data);
    }
}
