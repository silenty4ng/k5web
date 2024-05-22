<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.workshop'), $t('menu.firmware')]" />
      <a-row :gutter="20" align="stretch">
        <a-col :span="24">
            <a-card class="general-card" :title="$t('menu.firmware')">
                <!-- <template #extra>
                    <div style="margin-right: 20px;">
                        <a-link>&nbsp;&nbsp;登录&nbsp;&nbsp;</a-link>
                        <a-link>&nbsp;&nbsp;注册&nbsp;&nbsp;</a-link>
                        <a-link>&nbsp;&nbsp;用户名&nbsp;&nbsp;</a-link>
                        <a-link>&nbsp;&nbsp;退出&nbsp;&nbsp;</a-link>
                    </div>
                </template> -->
                <a-list>
                    <a-list-item style="width: 100%;">
                        <a-list-item-meta
                            title="LOSEHU126.bin"
                            description="https://github.com/losehu/uv-k5-firmware-custom"
                        >
                        </a-list-item-meta>
                        <template #actions>
                            <a-link @click="useFirmware('/LOSEHU126.bin')">{{$t('global.use')}}</a-link>
                        </template>
                    </a-list-item>
                    <a-list-item style="width: 100%;">
                        <a-list-item-meta
                            title="LOSEHU126K.bin"
                            description="https://github.com/losehu/uv-k5-firmware-custom"
                        >
                        </a-list-item-meta>
                        <template #actions>
                            <a-link @click="useFirmware('/LOSEHU126K.bin')">{{$t('global.use')}}</a-link>
                        </template>
                    </a-list-item>
                    <a-list-item style="width: 100%;">
                        <a-list-item-meta
                            title="LOSEHU126H.bin"
                            description="https://github.com/losehu/uv-k5-firmware-custom"
                        >
                        </a-list-item-meta>
                        <template #actions>
                            <a-link @click="useFirmware('/LOSEHU126H.bin')">{{$t('global.use')}}</a-link>
                        </template>
                    </a-list-item>
                    <a-list-item style="width: 100%;">
                        <a-list-item-meta
                            title="LOSEHU117P6（我基于 LOSEHU117 修改的固件）"
                            description="https://github.com/silenty4ng/uv-k5-firmware-chinese-lts"
                        >
                        </a-list-item-meta>
                        <template #actions>
                            <a-link @click="useFirmware('/LOSEHU117P6.bin')">{{$t('global.use')}}</a-link>
                        </template>
                    </a-list-item>
                    <a-list-item style="width: 100%;">
                        <a-list-item-meta
                            title="LOSEHU117P6K（我基于 LOSEHU117K 修改的固件）"
                            description="https://github.com/silenty4ng/uv-k5-firmware-chinese-lts"
                        >
                        </a-list-item-meta>
                        <template #actions>
                            <a-link @click="useFirmware('/LOSEHU117P6K.bin')">{{$t('global.use')}}</a-link>
                        </template>
                    </a-list-item>
                </a-list>
                <t-pagination style="margin: 10px;" :total="5" showPageNumber :showPageSize="false" />
            </a-card>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, nextTick } from 'vue';
  import { useAppStore } from '@/store';
  import { useRouter } from 'vue-router';
  
  const appStore = useAppStore();
  const router = useRouter()
  
  const state : {
    binaryFile: any,
    loading: boolean
  } = reactive({
    binaryFile: undefined,
    loading: false
  })
  
  const useFirmware = (url: string) => {
    router.push({
      path: '/tool/flash',
      query: {
        url
      }
    });
  }

  </script>
  
  <script lang="ts">
    export default {
      name: 'Backup',
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
  </style>
  