<template>
    <div class="container">
        <Breadcrumb :items="['感谢']" />
        <a-row :gutter="20" align="stretch">
            <a-col :span="24">
                <a-card class="general-card" title="感谢各位老板！">
                    <t-base-table max-height="65vh" :data="state.data" :columns="columns" :foot-data="state.footdata"></t-base-table>
                    <p>如有漏记可以联系我微信 silenty4ng 补充，另外感谢泉盛送的无线电设备；傅总送的无线电设备、天线、茶叶；小胖.log送的无线电设备；拓朋送的无线电设备。</p>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';

const columns = ref([
    { colKey: 'name', title: '老板' },
    { colKey: 'channel', title: '打赏渠道' },
    { colKey: 'time', title: '打赏时间' },
    { colKey: 'money', title: '打赏金额' },
]);
let state: any = reactive({
    data: [],
    footdata: []
})
onMounted(() => {
    let data = [
        { "name": "*波", "channel": "支付宝", "time": "2024-08-08", "money": "0.10" },
        { "name": "*波", "channel": "支付宝", "time": "2024-08-08", "money": "0.10" },
        { "name": "**宇", "channel": "支付宝", "time": "2024-09-08", "money": "10.00" },
        { "name": "*来", "channel": "微信", "time": "2025-01-15", "money": "0.59" },
        { "name": "*泉", "channel": "微信", "time": "2025-01-21", "money": "1.00" },
        { "name": "小胖.log", "channel": "微信", "time": "2023-12-28", "money": "8.88" },
        { "name": "*工", "channel": "微信", "time": "2024-01-10", "money": "16.66" },
        { "name": "A*O", "channel": "微信", "time": "2024-01-10", "money": "20.00" },
        { "name": "傅总", "channel": "微信", "time": "2024-01-10", "money": "88.88" },
        { "name": "小胖.log", "channel": "微信", "time": "2024-01-10", "money": "18.88" },
        { "name": "小胖.log", "channel": "微信", "time": "2024-06-14", "money": "10.00" },
        { "name": "小胖.log", "channel": "微信", "time": "2024-11-07", "money": "8.80" },
        { "name": "小胖.log", "channel": "微信", "time": "2024-11-13", "money": "13.78" },
        { "name": "W*d", "channel": "微信", "time": "2024-04-07", "money": "5.00" },
        { "name": "*叔", "channel": "微信", "time": "2024-05-09", "money": "5.00" },
        { "name": "L*d", "channel": "微信", "time": "2024-08-04", "money": "1.00" },
        { "name": "*你", "channel": "微信", "time": "2024-08-08", "money": "5.55" },
        { "name": "B*N", "channel": "微信", "time": "2024-08-10", "money": "2.00" },
        { "name": "*里", "channel": "微信", "time": "2024-08-30", "money": "10.00" },
        { "name": "*音", "channel": "微信", "time": "2024-10-17", "money": "6.88" },
        { "name": "*益", "channel": "微信", "time": "2024-10-17", "money": "100.00" },
        { "name": "*k", "channel": "微信", "time": "2024-10-20", "money": "2.00" },
        { "name": "*伟", "channel": "微信", "time": "2024-10-23", "money": "1.00" },
        { "name": "K*C", "channel": "微信", "time": "2024-10-28", "money": "1.00" },
        { "name": "2*_", "channel": "微信", "time": "2024-11-03", "money": "5.00" },
        { "name": "F*3", "channel": "微信", "time": "2024-11-27", "money": "1.00" },
        { "name": "*)", "channel": "微信", "time": "2024-12-26", "money": "2.00" },
        { "name": "*远", "channel": "微信", "time": "2024-12-25", "money": "1.00" },
        { "name": "*宁", "channel": "微信", "time": "2024-12-24", "money": "5.00" },
        { "name": "*🐼", "channel": "微信", "time": "2024-12-11", "money": "5.00" },
        { "name": "B*M", "channel": "微信", "time": "2024-12-10", "money": "5.00" },
        { "name": "BG4IEN", "channel": "QQ", "time": "2024-01-14", "money": "0.10" },
        { "name": "武汉+老K", "channel": "QQ", "time": "2024-01-19", "money": "0.10" },
        { "name": "罐子", "channel": "QQ", "time": "2024-03-13", "money": "6.66" },
        { "name": "BG4IWE", "channel": "QQ", "time": "2024-06-07", "money": "2.00" },
        { "name": "BA7IPG", "channel": "QQ", "time": "2024-06-16", "money": "5.00" },
        { "name": "BA3QT", "channel": "QQ", "time": "2024-11-18", "money": "6.00" },
        { "name": "BI4ACB", "channel": "微信", "time": "2025-01-29", "money": "66.00"},
        { "name": "*波", "channel": "支付宝", "time": "2024-09-11", "money": "100.00" },
        { "name": "*权", "channel": "支付宝", "time": "2025-02-10", "money": "20.00" },
        { "name": "**忠", "channel": "支付宝", "time": "2025-02-10", "money": "10.00" },
        { "name": "*猫", "channel": "微信", "time": "2025-03-04", "money": "10.00" },
        { "name": "*鱼", "channel": "微信", "time": "2025-03-06", "money": "10.00" },
        { "name": "sugibichi", "channel": "微信", "time": "2025-04-06", "money": "66.00" },
    ];
    data.sort((a, b) => {
        if (parseFloat(b.money) - parseFloat(a.money) === 0){
            const atime = new Date(a.time);
            const btime = new Date(b.time);
            return btime.getTime() - atime.getTime();
        }
        return parseFloat(b.money) - parseFloat(a.money);
    });
    state.data = data;
    state.footdata = [{
        "name": "合计",
        "channel": "-",
        "time": "-",
        "money": data.reduce((acc, row) => {
            return acc + parseFloat(row.money);
        }, 0).toFixed(2)
    }]
})
</script>

<script lang="ts">
export default {
    name: 'Thanks',
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