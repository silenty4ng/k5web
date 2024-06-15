<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.dashboard'), $t('menu.cps.mdc')]" />
      <a-card class="general-card">
        <template #title>
          <span @click="()=>{istate.showHide += 1}">{{ $t('menu.cps.mdc') + $t('global.onStart') }}</span>
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
        cell: (h, { row }) => row.name ? row.name.replace(/[^a-zA-Z0-9_]/g, '') : undefined,
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
        title: t('cps.mdcid'),
        colKey: 'mdcid',
        align: 'left',
        width: 200,
        cell: (h, { row }) => parseInt(row.mdcid, 16) <= 65535 ? parseInt(row.mdcid, 16).toString(16) : undefined,
        edit: {
          component: Input,
          props: {
            clearable: true
          },
          onEdited: (context: any) => {
            context.newRowData.mdcid = context.newRowData.mdcid ? context.newRowData.mdcid.toLowerCase() : undefined
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
      for (let i = 0x1D00; i < 0x1E00; i += 0x10) {
        const _data = await eeprom_read(appStore.connectPort, i, 0x10, appStore.configuration?.uart)
        rawEEPROM.set(_data, i - 0x1D00)
      }
      const _renderData : any = [];
      for (let i = 0; i < 0x100; i += 0x10) {
        if(uint8ArrayToHexReverseString(rawEEPROM.subarray(i, i + 0x02)) != 'ffff'){
          _renderData.push({
            name: uint8ArrayToString(rawEEPROM.subarray(i + 0x02, i + 0x10), appStore.configuration?.charset).trim(),
            mdcid: uint8ArrayToHexReverseString(rawEEPROM.subarray(i, i + 0x01)) + uint8ArrayToHexReverseString(rawEEPROM.subarray(i + 0x01, i + 0x02))
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
      for (let i = 0; i < 0x100; i += 0x10) {
        if(cstate.renderData[i / 0x10].mdcid){
          const _data = new Uint8Array(0x10).fill(0x20)
          _data.set(hexReverseStringToUint8Array(cstate.renderData[i / 0x10].mdcid.padStart(4, '0').substring(0, 2)))
          _data.set(hexReverseStringToUint8Array(cstate.renderData[i / 0x10].mdcid.padStart(4, '0').substring(2, 4)), 0x01)
          _data.set(stringToUint8Array(cstate.renderData[i / 0x10].name), 0x02)
          await eeprom_write(
            appStore.connectPort,
            i + 0x1D00,
            _data,
            0x10,
            appStore.configuration?.uart
          );
        }else{
          await eeprom_write(
            appStore.connectPort,
            i + 0x1D00,
            hexReverseStringToUint8Array('ffffffffffffffffffffffffffffffff'),
            0x10,
            appStore.configuration?.uart
          );
        }
      }
      const _tmp = await eeprom_read(appStore.connectPort, 0x1FF0, 0x10, appStore.configuration?.uart)
      _tmp.set([0x10], 0x10 - 1)
      await eeprom_write(
            appStore.connectPort,
            0x1FF0,
            _tmp,
            0x10,
            appStore.configuration?.uart
          );
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
      name: 'Radio',
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
  