<template>
  <a-layout-footer class="footer">
    <t-space>
      <t-link href="https://github.com/silenty4ng/k5web" target="_blank">K5Web - V0.1.{{ getMetaVersion() }}</t-link>
      <t-link v-show="state.isLhw711" href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2024058690号-1</t-link>
    </t-space>
  </a-layout-footer>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
const state = reactive({
  isLhw711: location.hostname == 'k5.lhw711.cn' ? true : false
})
const getMetaVersion = () => {
  return document.getElementsByTagName('meta')['builtTime']?.content
}
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
