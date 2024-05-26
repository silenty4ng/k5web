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
                          <a-link @click="userStore.logout()">&nbsp;&nbsp;{{ $t('global.logout') }}&nbsp;&nbsp;</a-link>
                        </template>
                        <template v-else>
                          <a-link @click="userStore.setInfo({ showLogin: true })">&nbsp;&nbsp;{{ $t('global.login') }}&nbsp;&nbsp;</a-link>
                          <a-link @click="userStore.setInfo({ showRegister: true })">&nbsp;&nbsp;{{ $t('global.register') }}&nbsp;&nbsp;</a-link>
                        </template>
                    </div>
                </template>
                <a-list>
                    <a-list-item style="width: 100%;" v-for="item in state.nowpage">
                        <a-list-item-meta
                            :title="item.title"
                            :description="item.desc"
                        >
                        </a-list-item-meta>
                        <template #actions>
                            <a-link @click="onStar(item.id)">👍</a-link>
                            <a-link @click="useFirmware('https://k5.vicicode.com/wsapi/download?id=' + item.id)">{{$t('global.use')}}</a-link>
                        </template>
                    </a-list-item>
                </a-list>
                <t-pagination style="margin: 10px;" :total="state.total" :current="state.page" showPageNumber :showPageSize="false" />
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
          <t-list-item v-for="item in state.myList">
            <div style="display: flex; width: 100%;">
              <div style="width: 90%;">
                <t-tag theme="primary" variant="outline">{{ item.audit ? '已审核' : '审核中' }}</t-tag>
                {{ item.title }}
                <br>
                {{ item.desc }}
              </div>
              <div style="width: 10%; margin: auto; text-align: center;">
                <t-link theme="primary" hover="color" @click="onDT(item.id)">删除</t-link>
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
              action="https://k5.vicicode.com/wsapi/base64"
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
  import { reactive, nextTick, onMounted, watch } from 'vue';
  import { useAppStore, useUserStore } from '@/store';
  import { useRouter } from 'vue-router';
  import { RefreshIcon } from 'tdesign-icons-vue-next';
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';

  const appStore = useAppStore();
  const userStore = useUserStore();
  
  const router = useRouter()
  
  const state : {
    binaryFile: any,
    loading: boolean,
    showPanel: boolean,
    showUpload: boolean,
    refLoading: boolean,
    myList: any,
    total: number,
    page: number,
    nowpage: any
  } = reactive({
    binaryFile: undefined,
    loading: false,
    showPanel: false,
    showUpload: false,
    refLoading: false,
    myList: [],
    total: 0,
    page: 1,
    nowpage: []
  })

  const formData = reactive({
    title: '',
    desc: '',
    firmware: []
  })

  onMounted(async ()=>{
    const resp : any = await axios.get("https://k5.vicicode.com/wsapi/list?type=0&page=" + state.page + "&t=" + Date.now())
    state.total = resp.total
    state.nowpage = resp.data
  })

  watch(state, async (n, o)=>{
    if(n.page != o.page){
      const resp : any = await axios.get("https://k5.vicicode.com/wsapi/list?type=0&page=" + state.page + "&t=" + Date.now())
      state.total = resp.total
      state.nowpage = resp.data
    }
  })

  const showPanel = async () => {
    state.refLoading = true;
    state.showPanel = true
    const resp : any = await axios.post("https://k5.vicicode.com/wsapi/my_list", {
      'type': 0,
      'token': userStore.accountId
    })
    state.myList = resp.data
    state.refLoading = false;
  }

  const showUpload = () => {
    formData.title = ''
    formData.desc = ''
    formData.firmware = []
    state.showUpload = true
  }

  const onUF = async () => {
    if(formData.title == "" || formData.firmware.length == 0){
      Message.error({
        content: '未填写名称及上传文件',
        duration: 5 * 1000,
      });
      return;
    }
    await axios.post("https://k5.vicicode.com/wsapi/upload", {
      'type': 0,
      'token': userStore.accountId,
      'title': formData.title,
      'desc': formData.desc,
      'data': formData.firmware[0].url
    })
    state.showUpload = false;
    showPanel()
  }

  const onDT = async (id: any) => {
    await axios.post("https://k5.vicicode.com/wsapi/delete", {
      'id': id,
      'token': userStore.accountId,
    })
    showPanel()
  }

  const onStar = async (id: any) => {
    await axios.post("https://k5.vicicode.com/wsapi/star", {
      'id': id
    })
    Message.success({
      content: '点赞成功',
      duration: 5 * 1000,
    });
  }

  const refit = () => {
    showPanel()
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
  