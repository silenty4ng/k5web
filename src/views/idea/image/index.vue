<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.workshop'), $t('menu.image')]" />
      <a-row :gutter="20" align="stretch">
        <a-col :span="24">
            <a-card class="general-card" :title="$t('menu.image')">
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
              <a-row :gutter="20">
                <a-col :span="4" v-for="i in state.nowpage">
                  <t-card :style="{ width: '100%', marginBottom: '10px' }">
                    <template #cover>
                      <img :title="i.title" :src="'https://k5.vicicode.com/wsapi/download?id=' + i.id">
                    </template>
                    <template #footer>
                      <t-row :align="'middle'" justify="center" style="gap: 24px">
                        <t-col flex="auto" style="display: inline-flex; justify-content: center">
                          <t-button variant="text" shape="square" @click="onStar(i.id)">
                            <thumb-up-icon />
                          </t-button>
                        </t-col>
                        <t-col flex="auto" style="display: inline-flex; justify-content: center">
                          <t-button variant="text" shape="square" @click="useImg('https://k5.vicicode.com/wsapi/download?id=' + i.id)">
                            <check-double-icon />
                          </t-button>
                        </t-col>
                      </t-row>
                    </template>
                  </t-card>
                </a-col>
              </a-row>
              <t-pagination @change="loadit" style="margin: 10px;" :total="state.total" :current="state.page" :pageSize="24" showPageNumber :showPageSize="false" />
            </a-card>
        </a-col>
      </a-row>
      <t-drawer v-model:visible="state.showPanel" size="50%" header="我的图片" :footer="false">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <t-button style="margin: 10px" @click="showUpload">上传新图片</t-button>
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
      <t-drawer v-model:visible="state.showUpload" size="25%" header="上传新图片" :footer="false">
        <t-form
          :data="formData"
          reset-type="initial"
          colon
          @submit="onUF"
        >
          <t-form-item label="图片名称" name="title" label-align="top">
            <t-input v-model="formData.title"></t-input>
          </t-form-item>
          <t-form-item label="图片描述" name="desc" label-align="top">
            <t-textarea :autosize="{ minRows: 5, maxRows: 10 }" v-model="formData.desc" placeholder="请输入" clearable />
          </t-form-item>
          <t-form-item label="图片文件" name="firmware" label-align="top">
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
  import { ThumbUpIcon, CheckDoubleIcon } from 'tdesign-icons-vue-next';
  import { reactive, nextTick, onMounted, watch } from 'vue';
  import { useAppStore, useUserStore } from '@/store';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';
  import { RefreshIcon } from 'tdesign-icons-vue-next';
  
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
    loadit({current: 1})
  })

  const loadit = async (page: any) => {
    state.page = page.current
    const resp : any = await axios.get("https://k5.vicicode.com/wsapi/list?type=1&limit=24&page=" + page.current + "&t=" + Date.now())
    state.total = resp.total
    state.nowpage = resp.data
  }

  const showPanel = async () => {
    state.refLoading = true;
    state.showPanel = true
    const resp : any = await axios.post("https://k5.vicicode.com/wsapi/my_list", {
      'type': 1,
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
      'type': 1,
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
  
  const useImg = (url:any) => {
    router.push({
      path: '/tool/image',
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
  