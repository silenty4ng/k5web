<template>
  <div class="container">
    <Breadcrumb :items="[$t('menu.list'), $t('menu.flash')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card
          class="general-card"
          :title="$t('menu.flash') + $t('global.onBoot')"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <a-space>
                <a-button @click="selectFile">{{
                  state.binaryFile
                    ? state.binaryName
                    : $t('tool.selectFirmware')
                }}</a-button>
                <a-button
                  type="primary"
                  :disabled="!state.binaryFile"
                  @click="flashIt"
                  >{{ $t('tool.flash') }}</a-button
                >
              </a-space>
            </div>
            <div>
              <a-radio-group type="button" size="mini" v-model="state.protocol">
                <a-radio value="Official">Official</a-radio>
                <a-radio value="K1">K1</a-radio>
              </a-radio-group>
            </div>
          </div>
          <a-divider />
          <div
            id="statusArea"
            style="
              height: 20em;
              background-color: var(--color-bg-3);
              color: var(--color-text-3);
              overflow: auto;
              padding: 20px;
            "
            v-html="state.status"
          ></div>
        </a-card>
      </a-col>
    </a-row>
    <t-dialog
      v-model:visible="state.showConfirmDialog"
      theme="danger"
      header="重要提示"
      class="t-dialog-new-class1 t-dialog-new-class2"
      :close-btn="false"
      :cancel-btn="null"
      :close-on-esc-keydown="false"
      :close-on-overlay-click="false"
      confirm-btn="我知道了"
      @confirm="handleDialogConfirm"
    >
      <p>
        泉盛 K5/K6 当前在售两个硬件版本，刷机前请先与商家确认可以刷写三方固件。
      </p>
      <t-collapse borderless :default-value="['']">
        <t-collapse-panel
          value="notice"
          header="如何确认硬件版本？"
          style="padding: 0"
        >
          <ul>
            <li>
              电源后盖后面有
              <t-popup>
                <span>V3字样</span>

                <template #content>
                  <img
                    style="max-width: 200px"
                    src="/assets/images/k5v3/back_label.webp"
                    alt="V3 Label"
                  />
                </template>
              </t-popup>
            </li>
            <li>
              拆开机壳后，看到主控芯片为
              <t-popup>
                <span>PY32F0</span>
                <!-- <div slot="content">触发元素是指触发浮层内容显示的元素</div> -->
                <template #content>
                  <img
                    style="max-width: 200px"
                    src="/assets/images/k5v3/puya_mcu.webp"
                    alt="puya"
                  />
                </template>
              </t-popup>
            </li>
          </ul>
          如发现机型为V3，请勿刷机！！（2025年11月后出货的新机均为V3版本）
        </t-collapse-panel>
      </t-collapse>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, nextTick, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAppStore } from '@/store';
  import {
    disconnect,
    connect,
    readPacket,
    sendPacket,
    unpackVersion,
    unpack,
    flash_generateCommand,
    readPacketNoVerify,
    flash_generateK1Command,
  } from '@/utils/serial.js';

  const appStore = useAppStore();

  const state: {
    status: any;
    binaryName: any;
    binaryFile: any;
    protocol: string;
    showConfirmDialog: boolean;
  } = reactive({
    status: '点击更新按钮更新固件到设备<br/><br/>',
    binaryFile: undefined,
    binaryName: '',
    protocol: 'Official',
    showConfirmDialog: false,
  });

  const route = useRoute();

  onMounted(async () => {
    if (route.query.url) {
      const packet = await fetch(route.query.url as string);
      const reader = packet?.body?.getReader();
      if (reader) {
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(...value);
        }
        const binary = new Uint8Array(chunks);
        state.binaryFile = binary;
        state.binaryName =
          (route.query.url as string)
            .substring((route.query.url as string).lastIndexOf('/') + 1)
            .split('?')[0] + ' ';
      }
    }
    state.showConfirmDialog = true;
  });

  const handleDialogConfirm = () => {
    state.showConfirmDialog = false;
  };

  const selectFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async () => {
      if (!input.files || input.files.length === 0) {
        return;
      }
      const blob = new Blob([input.files[0]], {
        type: 'application/octet-stream',
      });
      const rawEEPROM = new Uint8Array(await blob.arrayBuffer());
      state.binaryFile = rawEEPROM;
      state.binaryName = input.files[0].name;
    };
    input.click();
  };

  const flashIt = async () => {
    if (!state.binaryFile) {
      alert('请选择文件');
      return;
    }
    if (appStore.connectPort) {
      await disconnect(appStore.connectPort);
    }
    let _connect = await connect();
    if (state.protocol == 'Official') {
      await readPacket(_connect, 0x18, 1000);
    }
    if (state.protocol == 'K1') {
      await readPacketNoVerify(_connect);
    }
    const rawVersion = unpackVersion(state.binaryFile);
    const _data = new Uint8Array([
      0x30,
      0x5,
      rawVersion.length,
      0x0,
      ...rawVersion,
    ]);

    if (state.protocol == 'Official' || state.protocol == 'K1') {
      if (state.protocol == 'K1') {
        await sendPacket(_connect, _data);
        await readPacketNoVerify(_connect);
      } else {
        await sendPacket(
          _connect,
          new Uint8Array([
            48, 5, 16, 0, 42, 79, 69, 70, 87, 45, 76, 79, 83, 69, 72, 85, 0, 0,
            0, 0,
          ])
        ); // 发送固定握手数据
        await readPacket(_connect, 0x18);
      }
    }

    const firmware = unpack(state.binaryFile);

    if (firmware.length > 0xf000 && state.protocol == 'Official') {
      alert('最后的边界检查失败。不管是谁修改了代码，他都是个白痴。');
      throw new Error(
        'Last resort boundary check failed. Whoever touched the code is an idiot.'
      );
    }

    for (let i = 0; i < firmware.length; i += 0x100) {
      const data = firmware.slice(i, i + 0x100);
      let command = undefined;
      if (state.protocol == 'K1') {
        command = flash_generateK1Command(data, i, firmware.length);
      } else {
        command = flash_generateCommand(data, i, firmware.length);
      }
      try {
        await sendPacket(_connect, command);
        if (state.protocol == 'Official') {
          await readPacket(_connect, 0x1a);
        } else {
          await readPacketNoVerify(_connect, 10 * 1000);
        }
      } catch (e) {
        console.log('Flash command rejected. Aborting.');
        return Promise.reject(e);
      }

      state.status =
        state.status +
        `更新进度 ${((i / firmware.length) * 100).toFixed(1)}%<br/>`;
      nextTick(() => {
        const textarea = document?.getElementById('statusArea');
        if (textarea) textarea.scrollTop = textarea?.scrollHeight;
      });
    }
    state.status = state.status + '更新进度 100.0%<br/>';
    state.status = state.status + '固件更新成功';
    nextTick(() => {
      const textarea = document?.getElementById('statusArea');
      if (textarea) textarea.scrollTop = textarea?.scrollHeight;
    });
    disconnect(_connect);
    appStore.updateSettings({ connectState: false });
  };
</script>

<script lang="ts">
  export default {
    name: 'Flash',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;

    :deep(.arco-list-content) {
      overflow-x: hidden;
    }

    :deep(.arco-card-meta-title) {
      font-size: 14px;
    }
  }

  :deep(.arco-list-col) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  :deep(.arco-list-item) {
    width: 33%;
  }

  :deep(.block-title) {
    margin: 0 0 12px 0;
    font-size: 14px;
  }

  :deep(.list-wrap) {
    // min-height: 140px;
    .list-row {
      align-items: stretch;

      .list-col {
        margin-bottom: 16px;
      }
    }

    :deep(.arco-space) {
      width: 100%;

      .arco-space-item {
        &:last-child {
          flex: 1;
        }
      }
    }
  }
  :deep(.t-collapse-panel__header) {
    padding: 0;
  }
  :deep(.t-collapse-panel__content) {
    padding: 0 16px 16px 16px;
  }
</style>
