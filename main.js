const { app, BrowserWindow, dialog } = require('electron/main');
if (require('electron-squirrel-startup')) app.quit();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 760,
    autoHideMenuBar: true,
    icon: 'icon.ico',
  });

  mainWindow.webContents.session.on('select-serial-port', async (event, portList, webContents, callback) => {
    // Add listeners to handle ports being added or removed before the callback for `select-serial-port` is called.
    mainWindow.webContents.session.on('serial-port-added', (event, port) => {
      console.log('serial-port-added FIRED WITH', port);
      // Optionally update portList to add the new port
    });

    mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
      console.log('serial-port-removed FIRED WITH', port);
      // Optionally update portList to remove the port
    });

    event.preventDefault();

    if (portList && portList.length > 0) {
      // Only keep the last 5 ports
      const lastFivePorts = portList.slice(-5);

      // Prepare options for dialog box
      const options = {
        type: 'question',
        buttons: lastFivePorts.map(port => port.portName), // Display port names as choices
        title: 'Select Serial Port',
        message: 'Please select a serial port to use:'
      };

      const result = await dialog.showMessageBox(mainWindow, options);
      if (result.response >= 0) {
        callback(lastFivePorts[result.response].portId); // Callback with the selected port ID
      } else {
        callback(''); // No port selected
      }
    } else {
      callback(''); // No ports available
    }
  });

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'serial' && details.securityOrigin === 'file:///') {
      return true;
    }

    return false;
  });

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'serial' && details.origin === 'file://') {
      return true;
    }

    return false;
  });

  mainWindow.loadFile('./dist/index.html');

  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
