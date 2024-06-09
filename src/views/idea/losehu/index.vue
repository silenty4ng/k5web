<template>
    <div class="container">
        <Breadcrumb :items="[$t('menu.workshop'), $t('idea.diy')]" />
        <a-row :gutter="20" align="stretch">
            <a-col :span="24">
                <a-card class="general-card" :title="$t('idea.diy')" :loading="loading">
                    <t-space direction="vertical">
                        <div>操作说明：<a href="https://github.com/losehu/uv-k5-firmware-custom?tab=readme-ov-file#%E6%93%8D%E4%BD%9C%E8%AF%B4%E6%98%8E%E5%BF%85%E8%AF%BB" target="_blank">https://github.com/losehu/uv-k5-firmware-custom</a></div>
                        <a-radio-group v-for="item in state.showSort" v-model="state.flag[item]" type="button">
                            <a-radio v-for="subItem in state.disMatrix[item]" :value="subItem[0]"
                                :disabled="subItem[1]">{{ state.disName[item].get(subItem[0]) }}</a-radio>
                        </a-radio-group>
                        <a-button type="primary" @click="useFirmware">{{ $t('diy.generate') }}</a-button>
                    </t-space>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import useLoading from '@/hooks/loading';
import { useI18n } from 'vue-i18n';

const router = useRouter()
const { t } = useI18n();

const useFirmware = () => {
    router.push({
        path: '/tool/flash',
        query: {
            url: 'https://k5.vicicode.com/diyapi/LOSEHU' + state.flag.join('') + '.bin?v=' + (new Date()).getTime()
        }
    });
}

const state: {
    versions: any,
    flag: any,
    disMatrix: any,
    disName: any,
    showSort: any
} = reactive({
    versions: [],
    flag: [],
    disMatrix: [],
    disName: [],
    showSort: [],
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
    let functions = await (await fetch('https://k5.vicicode.com/diyapi/function.json?v=' + (new Date()).getTime())).text()
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
    const versions = await (await fetch('https://k5.vicicode.com/diyapi/version.json?v=' + (new Date()).getTime())).text()
    state.versions = JSON.parse(versions)
    updateMatrix()
    setLoading(false)
})

</script>

<script lang="ts">
export default {
    name: 'DIY',
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