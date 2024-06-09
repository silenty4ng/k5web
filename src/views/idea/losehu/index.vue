<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.workshop'), '自定义萝卜固件']" />
      <a-row :gutter="20" align="stretch">
        <a-col :span="24">
            <a-card class="general-card" title="自定义萝卜固件">
                <t-space direction="vertical">
                    <a-radio-group v-model="state.flag[0]" type="button">
                        <a-radio value="0" :disabled="state.disMatrix[0]['0']">英文信道</a-radio>
                        <a-radio value="4" :disabled="state.disMatrix[0]['4']">中文信道</a-radio>
                    </a-radio-group>
                    <a-radio-group v-model="state.flag[6]" type="button">
                        <a-radio value="0" :disabled="state.disMatrix[6]['0']">停用频谱仪</a-radio>
                        <a-radio value="1" :disabled="state.disMatrix[6]['1']">开启频谱仪</a-radio>
                    </a-radio-group>
                    <a-radio-group v-model="state.flag[3]" type="button">
                        <a-radio value="0" :disabled="state.disMatrix[3]['0']">停用MDC信令</a-radio>
                        <a-radio value="1" :disabled="state.disMatrix[3]['1']">开启MDC信令</a-radio>
                    </a-radio-group>
                    <a-radio-group v-model="state.flag[2]" type="button">
                        <a-radio value="0" :disabled="state.disMatrix[2]['0']">停用多普勒</a-radio>
                        <a-radio value="1" :disabled="state.disMatrix[2]['1']">开启多普勒</a-radio>
                    </a-radio-group>
                    <a-radio-group v-model="state.flag[5]" type="button">
                        <a-radio value="0" :disabled="state.disMatrix[5]['0']">停用输入法</a-radio>
                        <a-radio value="1" :disabled="state.disMatrix[5]['1']">开启输入法</a-radio>
                    </a-radio-group>
                    <a-radio-group v-model="state.flag[1]" type="button">
                        <a-radio value="0" :disabled="state.disMatrix[1]['0']">停用短信功能</a-radio>
                        <a-radio value="1" :disabled="state.disMatrix[1]['1']">开启短信功能</a-radio>
                    </a-radio-group>
                    <a-radio-group v-model="state.flag[4]" type="button">
                        <a-radio value="0" :disabled="state.disMatrix[4]['0']">停用收音机</a-radio>
                        <a-radio value="F" :disabled="state.disMatrix[4]['F']">默认收音机</a-radio>
                        <a-radio value="4" :disabled="state.disMatrix[4]['4']">SI4732收音机</a-radio>
                    </a-radio-group>
                    <a-radio-group v-model="state.flag[7]" type="button">
                        <a-radio value="0" :disabled="state.disMatrix[7]['0']">停用 SI4732 单边带</a-radio>
                        <a-radio value="1" :disabled="state.disMatrix[7]['1']">开启 SI4732 单边带</a-radio>
                    </a-radio-group>
                    <a-button type="primary" @click="useFirmware">生成</a-button>
                </t-space>
            </a-card>
        </a-col>
      </a-row>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter()

  const useFirmware = () => {
    router.push({
      path: '/tool/flash',
      query: {
        url: 'https://k5.vicicode.com/diyapi/LOSEHU' + state.flag.join('') + '.bin?v=' + (new Date()).getTime()
      }
    });
  }

  const state : {
    versions: any,
    flag: any,
    disMatrix: any
  } = reactive({
    versions: [],
    flag: ['0','0','0','0','0','0','0','0'],
    disMatrix: [
        {0: false, 4: false},
        {0: false, 1: false},
        {0: false, 1: false},
        {0: false, 1: false},
        {0: false, F: false, 4: false},
        {0: false, 1: false},
        {0: false, 1: false},
        {0: false, 1: false},
    ]
  })
  
  watch(state.flag, ()=>{ updateMatrix() })

  const updateMatrix = () => {
    state.flag.map((e: any,i: any)=>{
        Object.keys(state.disMatrix[i]).map((ex: any)=>{
            if(state.versions.indexOf('LOSEHU' + state.flag.join('').substring(0, i) + ex + state.flag.join('').substring(i+1) + '.bin') == -1){
                state.disMatrix[i][ex] = true
            }else{
                state.disMatrix[i][ex] = false
            }
        })
    })
  }
  
  onMounted(async ()=>{
    const versions = await (await fetch('https://k5.vicicode.com/diyapi/version.json?v=' + (new Date()).getTime())).text()
    state.versions = JSON.parse(versions)
    updateMatrix()
  })
  
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
  