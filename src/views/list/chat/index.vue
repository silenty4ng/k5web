<template>
    <div class="container">
        <Breadcrumb :items="[$t('menu.list'), $t('menu.flash')]" />
        <a-card class="general-card">
            <template #title>
                【无法正常使用】【开发中！！！】无线电聊天（需使用<a-link @click="downloadFirmware">这个</a-link>固件）
            </template>
            <div style="display: flex; align-items: center; margin: 10px;">
                <span>呼号：</span>
                <a-input v-model="state.callsign" style="width: 200px !important;" />
                &nbsp;&nbsp;&nbsp;
                <span>设备号：</span>
                <a-input-number :min="0" :max="15" v-model="state.devid"
                    style="width: 200px !important;"></a-input-number>
                &nbsp;&nbsp;&nbsp;
                <a-button @click="connectIt" type="primary">{{ state.startChat }}</a-button>
                <!-- await eeprom_init(appStore.connectPort); -->
            </div>
            <div style="height: 500px; border: 1px solid #eee;">
                <a-list :max-height="500" :bordered="false" ref="msgList">
                    <template #empty></template>
                    <a-list-item v-for="item of state.msgList">
                        <div style="display: flex;">
                            <div style="width: 100px; text-align: right; margin-right: 10px;">{{ item.callsign }}({{
                                item.devid.toString().padStart(2, "0") }})</div> >
                            <div style="margin-left: 10px;">{{ item.content }}</div>
                        </div>
                    </a-list-item>
                </a-list>
            </div>
            <a-input :disabled="!state.connect" v-model="state.sendInput" @keyup.enter="sendMsg">
                <template #append>
                    <a-link :disabled="!state.connect" @click="sendMsg">发送</a-link>
                </template>
            </a-input>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch, nextTick, ref, onUnmounted } from 'vue';
import { eeprom_init, sendSMSPacket, readSMSPacket } from '@/utils/serial.js';
import { useAppStore } from '@/store';
import { useRouter } from 'vue-router';
import { Message, Modal } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const router = useRouter()
const appStore = useAppStore();

const msgList: any = ref(null)

const state: {
    sendInput: any,
    msgList: any,
    callsign: string,
    devid: number,
    connect: boolean,
    reader: any,
    startChat: string
} = reactive({
    sendInput: '',
    msgList: [],
    callsign: sessionStorage.getItem('callsign') || '',
    devid: parseInt(sessionStorage.getItem('devid') || "0"),
    connect: false,
    reader: null,
    startChat: '开始聊天'
})

watch(() => state.callsign, (n, o) => { sessionStorage.setItem('callsign', n) })
watch(() => state.devid, (n, o) => { sessionStorage.setItem('devid', n.toString()) })

onUnmounted(()=>{
    if(state.connect){
        state.reader.releaseLock();
    }
})

const validateCallsign = (callsign: string) => {
    const regex = /^[A-Z]{1,2}\d{1,2}[A-Z]{1,3}$/;
    return regex.test(callsign);
}

const scrollIt = () => {
    nextTick(() => {
        if (msgList.value) {
            msgList.value.$el.children[0].children[0].children[0].scrollTop = msgList.value.$el.children[0].children[0].children[0].scrollHeight
        }
    })
}

const downloadFirmware = () => {
    router.push({
      path: '/tool/flash',
      query: {
        url: "/sms_test.bin"
      }
    });
}

function stringToUtf8Hex(str: string) {
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(str);
    let hex = '';
    utf8Bytes.forEach(byte => {
        hex += byte.toString(16).padStart(2, '0').toUpperCase();
    });
    return hex;
}

function hexToUtf8String(hex: string) {
    // 将十六进制字符串转换为字节数组
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}

const sendMsg = async () => {
    if (state.sendInput.trim() == "") return
    if (!validateCallsign(state.callsign.trim())) {
        Message.error('请输入正确的呼号')
        return
    }
    sendSMSPacket(appStore.connectPort,"START:" + state.callsign.trim() + ":" + state.devid + ":" + stringToUtf8Hex(state.sendInput.trim()) + ":END")
    state.msgList.push({
        callsign: state.callsign.trim(),
        devid: state.devid,
        content: state.sendInput.trim()
    })
    state.sendInput = ''
    scrollIt()
}

const connectIt = async () => {
    if(state.connect){
        state.connect = false
        state.reader.releaseLock();
        state.startChat = '开始聊天'
    }else{
        if (appStore.connectState != true) { alert(sessionStorage.getItem('noticeConnectK5')); return; };
        await eeprom_init(appStore.connectPort);
        state.reader = readSMSPacket(appStore.connectPort);
        asyncMsg(state.reader)
        state.startChat = '断开聊天'
        state.connect = true
    }
}

const asyncMsg = async (reader: any) => {
    let buffer = '';
    const decoder = new TextDecoder();
    const regex = /START:[A-Z0-9]+:[0-9]+:[A-F0-9]+:END/g;
    while (true) {
        try {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }
            let message = decoder.decode(value, { stream: true });
            message = message.trim();
            buffer += message;
            console.log(buffer)
            const matches = buffer.match(regex);
            if (matches && matches.length > 0) {
                buffer = ''
                try {
                    const content = matches[matches.length - 1].split(':');
                    state.msgList.push({
                        callsign: content[1],
                        devid: content[2],
                        content: hexToUtf8String(content[3])
                    })
                    scrollIt()
                } catch {
                    console.log('ERROR')
                }
            }
        } catch (error) {
            console.log('已断开')
            state.connect = false
            state.reader.releaseLock();
            state.startChat = '开始聊天'
            break;
        }
    }

    reader.releaseLock();
}

</script>

<script lang="ts">
export default {
    name: 'Chat',
};
</script>

<style scoped lang="less">
:deep(::-webkit-scrollbar-thumb) {
    border-radius: 0 !important;
}

:deep(.scrollbar::-webkit-scrollbar) {
    height: 10px;
}

:deep(.t-table__content::-webkit-scrollbar) {
    height: 15px;
}

.container {
    padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
    &:last-child {
        .arco-table-th-item-title {
            margin-left: 16px;
        }
    }
}

.action-icon {
    margin-left: 12px;
    cursor: pointer;
}

.active {
    color: #0960bd;
    background-color: #e3f4fc;
}

.setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
        margin-left: 12px;
        cursor: pointer;
    }
}

.ttable {
    :deep(.t-table__affixed-header-elm-wrap) {
        height: 60px !important;
    }

    :deep(.t-table__content) {
        scrollbar-width: auto !important;
    }
}
</style>