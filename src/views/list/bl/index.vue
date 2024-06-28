<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.list'), $t('bl')]" />
      <a-card class="general-card">
        <template #title>
            {{ $t('bl') }} {{ $t('global.onStart') }}
        </template>
        <t-divider>{{ $t('cs') }}</t-divider>
      </a-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  
  </script>
  
  <script lang="ts">
    export default {
      name: 'BL',
    };
  </script>
  
  <style scoped lang="less">
    :deep(::-webkit-scrollbar-thumb){
      border-radius: 0 !important;
    }
    :deep(.scrollbar::-webkit-scrollbar) {
      height: 10px;
    }
    :deep(.t-table__content::-webkit-scrollbar) {
      height: 15px;
    }
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
    .ttable {
      :deep(.t-table__affixed-header-elm-wrap){
        height: 60px !important;
      }
      :deep(.t-table__content){
        scrollbar-width: auto !important;
      }
    }
  </style>
  