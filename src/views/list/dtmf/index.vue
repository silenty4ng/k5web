<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.dashboard'), $t('menu.cps.dtmf')]" />
      <a-card class="general-card">
        <template #title>
          <span @click="()=>{istate.showHide += 1}">{{ $t('menu.cps.dtmf') + $t('global.onStart') }}</span>
        </template>
        <a-row style="margin-bottom: 16px">
          <a-col :span="12">
            <a-space>
              <a-button type="primary" @click="readChannel">
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('cps.onDeviceRead') }}
              </a-button>
              <a-button @click="writeChannel">
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('cps.onDeviceWrite') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <t-table
          class="ttable"
          :loading="loading"
          size="medium"
          :columns="columns"
          :data="cstate.renderData"
          :pagination="{
            defaultPageSize: cstate.pageSize,
            total: cstate.renderData.length,
            defaultCurrent: 1,
            pageSizeOptions: [15, 30, 50, 100, 200]
          }"
          @change="(e: any)=>{cstate.pageSize = e.pagination.pageSize, cstate.nowPage = e.pagination.current}"
          bordered
          lazy-load
          :headerAffixedTop="{ offsetTop: 60 }"
          :hover="true"
          drag-sort="row-handler"
          @drag-sort="onDragSort"
        >
          <template #drag="{ row, rowIndex }">
            <span>
              <MoveIcon />
            </span>
          </template>
          <template #index="{ row, rowIndex }">
            {{ (cstate.nowPage - 1) * cstate.pageSize + rowIndex + 1 }}
          </template>
          <template #operate="{ row, rowIndex }">
            <t-button theme="default" variant="dashed" @click="clearRow((cstate.nowPage - 1) * cstate.pageSize + rowIndex)">{{ $t('cps.clear') }}</t-button>
          </template>
        </t-table>
      </a-card>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { computed, reactive, watch } from 'vue';
    import { Input } from 'tdesign-vue-next';
    import useLoading from '@/hooks/loading';
    import { eeprom_read, uint8ArrayToHexReverseString, hexReverseStringToUint8Array, stringToUint8Array, uint8ArrayToString, eeprom_write, eeprom_reboot, eeprom_init } from '@/utils/serial.js';
    import { useAppStore } from '@/store';
    import { MoveIcon } from 'tdesign-icons-vue-next';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
  
    const appStore = useAppStore();
  
    const { loading, setLoading } = useLoading(false);
  
    const cstate : {
      renderData: any[],
      pageSize: number,
      nowPage: number
    } = reactive({
      renderData: Array.from({length: 16}).map(e=>{return {}}),
      pageSize: 16,
      nowPage: 1,
    })
  
    const istate = reactive({
      showHide: 0
    })
  
    const onDragSort = (params: any) => {
      cstate.renderData = params.newData
    }
  
    const columns = computed(() => [
      {
        colKey: 'drag', // 列拖拽排序必要参数
        title: t('cps.sort'),
        width: 46,
      },
      {
        title: '#',
        colKey: 'index',
        align: 'left',
        width: 100
      },
      {
        title: t('cps.contact'),
        colKey: 'name',
        width: 250,
        align: 'left',
        cell: (h, { row }) => row.name,
        edit: {
          component: Input,
          props: {
            clearable: true
          },
          onEdited: (context: any) => {
            const newData = [...cstate.renderData];
            newData.splice((cstate.nowPage - 1) * cstate.pageSize + context.rowIndex, 1, context.newRowData);
            cstate.renderData = newData;
          },
        },
      },
      {
        title: t('cps.dtmfid'),
        colKey: 'dtmfid',
        align: 'left',
        width: 200,
        cell: (h, { row }) => row.dtmfid,
        edit: {
          component: Input,
          props: {
            clearable: true
          },
          onEdited: (context: any) => {
            context.newRowData.dtmfid = context.newRowData.dtmfid ? context.newRowData.dtmfid.toUpperCase() : undefined
            const newData = [...cstate.renderData];
            newData.splice((cstate.nowPage - 1) * cstate.pageSize + context.rowIndex, 1, context.newRowData);
            cstate.renderData = newData;
          },
        },
      },
      {
        title: t('cps.operate'),
        colKey: 'operate',
        align: 'left',
        width: 150
      }
    ]);
  
    const readChannel = async() => {
      if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
      await eeprom_init(appStore.connectPort);
      setLoading(true)
      let rawEEPROM = new Uint8Array(0x100);
      for (let i = 0x1C00; i < 0x1D00; i += 0x10) {
        const _data = await eeprom_read(appStore.connectPort, i, 0x10, appStore.configuration?.uart)
        rawEEPROM.set(_data, i - 0x1C00)
      }
      const _renderData : any = [];
      for (let i = 0; i < 0x100; i += 0x10) {
        if(uint8ArrayToHexReverseString(rawEEPROM.subarray(i, i + 1)) != 'ff'){
          _renderData.push({
            dtmfid: uint8ArrayToString(rawEEPROM.subarray(i + 8, i + 16), appStore.configuration?.charset),
            name: uint8ArrayToString(rawEEPROM.subarray(i, i + 8), appStore.configuration?.charset)
          })
        }else{
          _renderData.push({})
        }
      }
      cstate.renderData = _renderData;
      setLoading(false)
    }

    const writeChannel = async() =>{
      if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
      await eeprom_init(appStore.connectPort);
      setLoading(true)

      let dataset = [];

      for (let i = 0; i < 16; i++) {
        let id = cstate.renderData[i].dtmfid;
        let name = cstate.renderData[i].name;

        if(id && name){
          id = id.trim();
          name = name.trim();

          let data = new Uint8Array(16);
          let idData = new Uint8Array(8);
          let nameData = new Uint8Array(8);

          let _idData = stringToUint8Array(id, appStore.configuration?.charset).slice(0,8);
          idData.set(_idData);

          let _nameData = stringToUint8Array(name, appStore.configuration?.charset).slice(0,8);
          nameData.set(_nameData);

          data.set(nameData);
          data.set(idData, 8)

          dataset.push(data);
        }
      }

      if (dataset.length < 16) {
        for (let i = dataset.length; i < 16; i++) {
          let data = new Uint8Array(16);
          data[0] = 0xff;
          data[8] = 0xff;
          dataset[i] = data;
        }
      }

      for (let i = 0; i < dataset.length; i++) {
        await eeprom_write(
            appStore.connectPort,
            i * 0x10 + 0x1C00,
            dataset[i],
            0x10,
            appStore.configuration?.uart
        );
      }

      await eeprom_reboot(appStore.connectPort);
      setLoading(false)
    }

    const clearRow = async (row: any) =>{
      const newData = [...cstate.renderData];
      newData.splice(row, 1, {scanlist: []});
      cstate.renderData = newData;
    }
  </script>
  
  <script lang="ts">
    export default {
      name: 'Dtmf',
    };
  </script>
  
  <style scoped lang="less">
    :deep(::-webkit-scrollbar-thumb){
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
      :deep(.t-table__affixed-header-elm-wrap){
        height: 60px !important;
      }
      :deep(.t-table__content){
        scrollbar-width: auto !important;
      }
    }
  </style>
  