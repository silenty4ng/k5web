<template>
  <div class="container">
    <Breadcrumb :items="['写频', '信道管理']" />
    <a-card class="general-card" :title="$t('信道管理')">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              从设备读取
            </a-button>
            <a-button>
              <template #icon>
                <icon-plus />
              </template>
              写入设备
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table :columns="columns" :data="renderData" style="margin-top: 20px">
        <template #index="{ record, rowIndex }">
          {{rowIndex + 1}}
        </template>
        <template #mode="{ record, rowIndex }">
          <a-select v-model="record.mode" @change="()=>{record.mode=''}">
            <a-option v-for="value of Object.keys({'FM': 'FM', 'AM': 'AM', 'LSB': 'LSB'})">{{value}}</a-option>
          </a-select>
        </template>
        <template #freq="{ record, rowIndex }">
          <a-input v-model="record.freq" />
        </template>
        <template #name="{ record, rowIndex }">
          <a-input v-model="record.name" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { queryPolicyList, PolicyRecord, PolicyParams } from '@/api/list';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      number: '',
      name: '',
      contentType: '',
      filterType: '',
      createdTime: [],
      status: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<PolicyRecord[]>([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: '模式',
      dataIndex: 'mode',
      slotName: 'mode'
    },
    {
      title: '频率',
      dataIndex: 'freq',
      slotName: 'freq'
    },
    {
      title: '名称',
      dataIndex: 'name',
      slotName: 'name'
    },
    {
      title: '亚音模式',
      dataIndex: 'tone',
    },
    {
      title: '发射模拟亚音',
      dataIndex: 'tone',
    },
    {
      title: '接收模拟亚音',
      dataIndex: 'tone',
    },
    {
      title: '发射数字亚音',
      dataIndex: 'tone',
    },
    {
      title: '接收模拟亚音',
      dataIndex: 'tone',
    },
    {
      title: '频差方向',
      dataIndex: 'tone',
    },
    {
      title: '频差频率',
      dataIndex: 'tone',
    },
    {
      title: '功率',
      dataIndex: 'tone',
    },
    {
      title: '操作',
      dataIndex: 'tone',
    },
  ]);
  const fetchData = async (
    params: PolicyParams = { current: 1, pageSize: 200 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryPolicyList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
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
</style>
