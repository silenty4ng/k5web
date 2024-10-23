<template>
    <div class="container">
        <Breadcrumb :items="[$t('menu.workshop'), $t('idea.diy')]" />
        <a-row :gutter="20" align="stretch">
            <a-col :span="24">
                <a-card class="general-card" :title="$t('idea.diy')" :loading="loading">
                    <t-space direction="vertical">
                        <div>{{ $t('oi') }}<t-link theme="primary" href="https://github.com/losehu/uv-k5-firmware-custom" target="_blank">https://github.com/losehu/uv-k5-firmware-custom</t-link></div>
                        <a-radio-group v-for="item in state.showSort" v-model="state.flag[item]" type="button">
                            <a-radio v-for="subItem in state.disMatrix[item]" :value="subItem[0]"
                                :disabled="subItem[1]">{{ state.disName[item].get(subItem[0]) }}</a-radio>
                        </a-radio-group>
                        <div>
                            <a-button type="primary" @click="useFirmware">{{ $t('diy.generate') }}</a-button>&nbsp;&nbsp;
                            <a-link @click="iDownload">{{$t('global.download')}}</a-link>
                        </div>
                    </t-space>
                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="20" align="stretch" style="margin-top: 10px;">
            <a-col :span="24">
                <a-card style="padding: 20px;" class="general-card readme" v-html="state.readme"></a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import useLoading from '@/hooks/loading';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const router = useRouter()
const { t } = useI18n();

const useFirmware = () => {
    router.push({
        path: '/tool/flash',
        query: {
            url: 'https://k5.vicicode.cn/diyapi/LOSEHU' + state.flag.join('') + '.bin?v=' + (new Date()).getTime()
        }
    });
}

const iDownload = () => {
    fetch('https://k5.vicicode.cn/diyapi/LOSEHU' + state.flag.join('') + '.bin?v=' + (new Date()).getTime()).then(e=>e.blob()).then(blob=>{
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "LOSEHU-CUSTOM-" + state.flag.join('') + ".bin";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
}

const state: {
    versions: any,
    flag: any,
    disMatrix: any,
    disName: any,
    showSort: any,
    readme: any
} = reactive({
    versions: [],
    flag: [],
    disMatrix: [],
    disName: [],
    showSort: [],
    readme: ''
})

watch(() => [...state.flag], () => { updateMatrix() })

const updateMatrix = () => {
    state.flag.map((e: any, i: any) => {
        state.disMatrix[i].forEach((value: any, key: any) => {
            if(state.versions.indexOf('LOSEHU' + state.flag.join('').substring(0, i) + key + state.flag.join('').substring(i+1) + '.bin') == -1){
                state.disMatrix[i].set(key, true)
            }else{
                state.disMatrix[i].set(key, false)
            }
        });
    })
}

const { loading, setLoading } = useLoading(true);

onMounted(async () => {
    setLoading(true)
    let functions = await (await fetch('https://k5.vicicode.cn/diyapi/function.json?v=' + (new Date()).getTime())).text()
    functions = JSON.parse(functions)
    let _newfunc: any = []
    let _showSort: any = []
    functions.map((e: any) => {
        _newfunc[e[e.length - 1] - 1] = e
        _showSort.push(e[e.length - 1] - 1)
    })
    functions = _newfunc
    let disMatrix: any = []
    let disName: any = []
    functions.map((e: any) => {
        let _conf: any = new Map()
        let _confName: any = new Map();
        for (let i = e[0] * 2 + 1; i < e[0] * 3 + 1; i++) {
            _conf.set(e[i], false)
            if(t('idea.diy') !== 'LOSEHU DIY'){
                _confName.set(e[i], e[i - e[0] - e[0]])
            }else{
                _confName.set(e[i], e[i - e[0]])
            }
        }
        disMatrix.push(_conf)
        disName.push(_confName)
    })
    state.flag = new Array(functions.length).fill('0')
    state.disName = disName
    state.disMatrix = disMatrix
    state.showSort = _showSort
    const versions = await (await fetch('https://k5.vicicode.cn/diyapi/version.json?v=' + (new Date()).getTime())).text()
    state.versions = JSON.parse(versions)
    updateMatrix()
    setLoading(false)
    if(t('menu.dashboard') == 'CPS'){
        state.readme = DOMPurify.sanitize(await marked.parse(await (await fetch('https://k5.vicicode.cn/diyapi/README_en.md?v=' + (new Date()).getTime())).text()))
    }else{
        state.readme = DOMPurify.sanitize(await marked.parse(await (await fetch('https://k5.vicicode.cn/diyapi/README.md?v=' + (new Date()).getTime())).text()))
    }
    state.readme = state.readme.replaceAll('href="./README_en.md"', '')
    state.readme = state.readme.replaceAll('href="./README.md"', '')
    state.readme = state.readme.replaceAll('losehu/uv-k5-firmware-chinese/blob/main/payment/show.png', 'losehu/uv-k5-firmware-chinese/blob/main/payment/show.png?raw=true')
    state.readme = state.readme.replaceAll('/images/c1.JPG', 'https://github.com/losehu/uv-k5-firmware-custom/blob/main/images/c1.JPG?raw=true')
    state.readme = state.readme.replaceAll('/images/c2.JPG', 'https://github.com/losehu/uv-k5-firmware-custom/blob/main/images/c2.JPG?raw=true')
    state.readme = state.readme.replaceAll('/images/c3.JPG', 'https://github.com/losehu/uv-k5-firmware-custom/blob/main/images/c3.JPG?raw=true')
    state.readme = state.readme.replaceAll('/images/c4.JPG', 'https://github.com/losehu/uv-k5-firmware-custom/blob/main/images/c4.JPG?raw=true')
    state.readme = state.readme.replaceAll('a href', 'a target="_blank" href')
})

</script>

<script lang="ts">
export default {
    name: 'DIY',
};
</script>

<style scoped lang="less">
.readme {
    background-color: var(--color-bg-1);
    color: var(--color-text-1);
}
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