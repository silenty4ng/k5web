<template>
  <a-layout-footer class="footer">
    <t-space>
      <t-link href="https://github.com/silenty4ng/k5web" target="_blank">K5Web - V0.1.202406100220</t-link>
      <t-link v-show="state.isLhw711" href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2024058690号-1</t-link>
    </t-space>
  </a-layout-footer>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
const state = reactive({
  isLhw711: location.hostname == 'k5.lhw711.cn' ? true : false
})
</script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
