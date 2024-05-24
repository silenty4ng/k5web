<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.workshop'), $t('menu.firmware')]" />
      <a-row :gutter="20" align="stretch">
        <a-col :span="24">
            <a-card class="general-card" :title="$t('menu.firmware')">
                <template #extra>
                    <div style="margin-right: 20px;">
                        <template v-if="userStore.name">
                          <a-link @click="showPanel">&nbsp;&nbsp;{{ userStore.name }}&nbsp;&nbsp;</a-link>
                          <a-link @click="userStore.logout()">&nbsp;&nbsp;退出&nbsp;&nbsp;</a-link>
                        </template>
                        <template v-else>
                          <a-link @click="userStore.setInfo({ showLogin: true })">&nbsp;&nbsp;登录&nbsp;&nbsp;</a-link>
                          <a-link @click="userStore.setInfo({ showRegister: true })">&nbsp;&nbsp;注册&nbsp;&nbsp;</a-link>
                        </template>
                    </div>
                </template>
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
      <t-drawer v-model:visible="state.showPanel" size="50%" header="我的固件" :footer="false">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <t-button style="margin: 10px" @click="showUpload">上传新固件</t-button>
          <t-button :loading="state.refLoading" shape="circle" theme="outline" @click="refit">
            <template #icon> <RefreshIcon /> </template>
          </t-button>
        </div>
        <t-list :split="true">
          <t-list-item v-for="item in 20">
            <div style="display: flex; width: 100%;">
              <div style="width: 90%;">
                <t-tag theme="primary" variant="outline">审核中</t-tag>
                固件名称
                <br>
                固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述固件描述
              </div>
              <div style="width: 10%; margin: auto; text-align: center;">
                <t-link theme="primary" hover="color">删除</t-link>
              </div>
            </div>
          </t-list-item>
        </t-list>
      </t-drawer>
      <t-drawer v-model:visible="state.showUpload" size="25%" header="上传新固件" :footer="false">
        <t-form
          :data="formData"
          reset-type="initial"
          colon
          @submit="onUF"
        >
          <t-form-item label="固件名称" name="title" label-align="top">
            <t-input v-model="formData.title"></t-input>
          </t-form-item>
          <t-form-item label="固件描述" name="desc" label-align="top">
            <t-textarea :autosize="{ minRows: 5, maxRows: 10 }" v-model="formData.desc" placeholder="请输入" clearable />
          </t-form-item>
          <t-form-item label="固件文件" name="firmware" label-align="top">
            <t-upload
              v-model="formData.firmware"
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              :abridge-name="[8, 6]"
              theme="file-input"
              placeholder="未选择文件"
            ></t-upload>
          </t-form-item>
          <t-form-item label-align="top">
            <t-button theme="primary" type="submit" block>提交审核</t-button>
          </t-form-item>
        </t-form>
      </t-drawer>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, nextTick } from 'vue';
  import { useAppStore, useUserStore } from '@/store';
  import { useRouter } from 'vue-router';
  import { RefreshIcon } from 'tdesign-icons-vue-next';

  const appStore = useAppStore();
  const userStore = useUserStore();
  
  const router = useRouter()
  
  const state : {
    binaryFile: any,
    loading: boolean,
    showPanel: boolean,
    showUpload: boolean,
    refLoading: boolean
  } = reactive({
    binaryFile: undefined,
    loading: false,
    showPanel: false,
    showUpload: false,
    refLoading: false
  })

  const formData = reactive({
    title: '',
    desc: '',
    firmware: []
  })

  const showPanel = () => {
    state.showPanel = true
  }

  const showUpload = () => {
    formData.title = ''
    formData.desc = ''
    formData.firmware = []
    state.showUpload = true
  }

  const onUF = () => {
    console.log(formData)
    state.showUpload = false;
  }

  const refit = () => {
    state.refLoading = true;
    setTimeout(() => {
      state.refLoading = false;
    }, 1000);
  }
  
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
  