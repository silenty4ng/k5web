<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.workshop'), $t('menu.image')]" />
      <a-row :gutter="20" align="stretch">
        <a-col :span="24">
            <a-card class="general-card" :title="$t('menu.image')">
                <!-- <template #extra>
                    <div style="margin-right: 20px;">
                        <a-link>&nbsp;&nbsp;登录&nbsp;&nbsp;</a-link>
                        <a-link>&nbsp;&nbsp;注册&nbsp;&nbsp;</a-link>
                        <a-link>&nbsp;&nbsp;用户名&nbsp;&nbsp;</a-link>
                        <a-link>&nbsp;&nbsp;退出&nbsp;&nbsp;</a-link>
                    </div>
                </template> -->
              <a-row :gutter="20">
                <a-col :span="4" v-for="i in [
                  { name: '罗狮虎', url: '/img1.png'},
                  { name: '离线小恐龙', url: '/img2.png'},
                  { name: '不忘初心牢记使命', url: '/img3.png'},
                  { name: '为人民服务', url: '/img4.png'},
                  { name: '严禁收听敌台广播', url: '/img5.png'},
                  { name: '爱因斯坦', url: '/img6.png'},
                ]">
                  <t-card :style="{ width: '100%', marginBottom: '10px' }">
                    <template #cover>
                      <img :title="i.name" :src="i.url">
                    </template>
                    <template #footer>
                      <t-row :align="'middle'" justify="center" style="gap: 24px">
                        <t-col flex="auto" style="display: inline-flex; justify-content: center">
                          <t-button variant="text" shape="square" @click="upImg(i)">
                            <thumb-up-icon />
                          </t-button>
                        </t-col>
                        <t-col flex="auto" style="display: inline-flex; justify-content: center">
                          <t-button variant="text" shape="square" @click="useImg(i)">
                            <check-double-icon />
                          </t-button>
                        </t-col>
                      </t-row>
                    </template>
                  </t-card>
                </a-col>
              </a-row>
              <t-pagination style="margin: 10px;" :total="6" showPageNumber :showPageSize="false" />
            </a-card>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ThumbUpIcon, CheckDoubleIcon } from 'tdesign-icons-vue-next';
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
  
  const upImg = (i:any) => {
    alert('图片工坊即将推出');
  }
  
  const useImg = (i:any) => {
    router.push({
      path: '/tool/image',
      query: {
        url: i.url
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
  