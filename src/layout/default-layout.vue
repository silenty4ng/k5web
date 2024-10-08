<template>
  <a-layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <t-dialog
      v-model:visible="userStore.showLogin"
      attach="body"
      :header="$t('global.login')"
      destroy-on-close
      :footer="false"
    >
      <template #body>
        <t-form ref="form" :data="formData" :colon="true" :label-width="0" @submit="onLogin">
          <t-form-item name="account">
            <t-input v-model="formData.account" clearable :placeholder="$t('global.username')">
              <template #prefix-icon>
                <desktop-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="password">
            <t-input v-model="formData.password" type="password" clearable :placeholder="$t('global.password')">
              <template #prefix-icon>
                <lock-on-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item>
            <t-button theme="primary" type="submit" block>{{$t('global.login')}}</t-button>
          </t-form-item>
        </t-form>
      </template>
    </t-dialog>
    <t-dialog
      v-model:visible="userStore.showRegister"
      attach="body"
      :header="$t('global.register')"
      destroy-on-close
      :footer="false"
    >
      <template #body>
        <t-form ref="form" :data="formData" :colon="true" :label-width="0" @submit="onRegister">
          <t-form-item name="account">
            <t-input v-model="formData.account" clearable :placeholder="$t('global.username')">
              <template #prefix-icon>
                <desktop-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="nickname">
            <t-input v-model="formData.nickname" clearable :placeholder="$t('global.nickname')">
              <template #prefix-icon>
                <desktop-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="password">
            <t-input v-model="formData.password" type="password" clearable :placeholder="$t('global.password')">
              <template #prefix-icon>
                <lock-on-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="password2">
            <t-input v-model="formData.password2" type="password" clearable :placeholder="$t('global.password2')">
              <template #prefix-icon>
                <lock-on-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="motto">
            <t-input v-model="formData.motto" clearable :placeholder="$t('global.motto')">
              <template #prefix-icon>
                <desktop-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item>
            <t-button theme="primary" type="submit" block>{{$t('global.register')}}</t-button>
          </t-form-item>
        </t-form>
      </template>
    </t-dialog>
    <div v-if="navbar" class="layout-navbar">
      <NavBar />
    </div>
    <a-layout>
      <a-layout>
        <a-layout-sider
          v-if="renderMenu"
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: navbar ? '60px' : '' }"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div class="menu-wrapper">
            <Menu />
          </div>
        </a-layout-sider>
        <a-drawer
          v-if="hideMenu"
          :visible="drawerVisible"
          placement="left"
          :footer="false"
          mask-closable
          :closable="false"
          @cancel="drawerCancel"
          title="K5Web"
        >
          <Menu />
        </a-drawer>
        <a-layout class="layout-content" :style="paddingStyle">
          <TabBar v-if="appStore.tabBar" />
          <a-layout-content>
            <PageLayout />
          </a-layout-content>
          <Footer v-if="footer" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, provide, onMounted, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppStore, useUserStore } from '@/store';
  import NavBar from '@/components/navbar/index.vue';
  import Menu from '@/components/menu/index.vue';
  import Footer from '@/components/footer/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import usePermission from '@/hooks/permission';
  import useResponsive from '@/hooks/responsive';
  import PageLayout from './page-layout.vue';
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';

  const formData = reactive({
    account: '',
    nickname: '',
    password: '',
    password2: '',
    motto: ''
  });

  const onLogin = async () => {
    const resp : any = await axios.post("https://k5ws.vicicode.cn/api/user/checkIn?server=1", {
      'username': formData.account,
      'password': formData.password,
      'tab': 'login',
      'keep': false
    })
    if(resp.code == 1){
      userStore.setInfo({
        showLogin: false,
        name: resp.data.userInfo.nickname,
        accountId: resp.data.userInfo.token
      })
    }
  }

  const onRegister = async () => {
    if(formData.password == '' || formData.account == '' || formData.nickname == ''){
      Message.error({
        content: '用户名、昵称及密码不能为空',
        duration: 5 * 1000,
      });
      return;
    }
    if(formData.password != formData.password2){
      Message.error({
        content: '两次输入密码不一致',
        duration: 5 * 1000,
      });
      return;
    }
    const resp : any = await axios.post("https://k5ws.vicicode.cn/api/user/checkIn?server=1", {
      'username': formData.account,
      'password': formData.password,
      'nickname': formData.nickname,
      'motto': formData.motto,
      'tab': 'register',
    })
    if(resp.code == 1){
      userStore.setInfo({
        showRegister: false,
        name: formData.nickname,
        accountId: resp.data.userInfo.token
      })
    }
  }

  const isInit = ref(false);
  const appStore = useAppStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const permission = usePermission();
  useResponsive(true);
  const navbarHeight = `60px`;
  const navbar = computed(() => appStore.navbar);
  const renderMenu = computed(() => appStore.menu && !appStore.topMenu);
  const hideMenu = computed(() => appStore.hideMenu);
  const footer = computed(() => appStore.footer);
  const menuWidth = computed(() => {
    return appStore.menuCollapse ? 48 : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const paddingStyle = computed(() => {
    const paddingLeft =
      renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value}px` }
        : {};
    const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
    return { ...paddingLeft, ...paddingTop };
  });
  const setCollapsed = (val: boolean) => {
    if (!isInit.value) return; // for page initialization menu state problem
    appStore.updateSettings({ menuCollapse: val });
  };
  watch(
    () => userStore.role,
    (roleValue) => {
      if (roleValue && !permission.accessRouter(route))
        router.push({ name: 'notFound' });
    }
  );
  const drawerVisible = ref(false);
  const drawerCancel = () => {
    drawerVisible.value = false;
  };
  provide('toggleDrawerMenu', () => {
    drawerVisible.value = !drawerVisible.value;
  });
  onMounted(() => {
    isInit.value = true;
  });
</script>

<style scoped lang="less">
  @nav-size-height: 60px;
  @layout-max-width: 1100px;

  .layout {
    width: 100%;
    height: 100%;
  }

  .layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: @nav-size-height;
  }

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    &::after {
      position: absolute;
      top: 0;
      right: -1px;
      display: block;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
    }

    > :deep(.arco-layout-sider-children) {
      overflow-y: hidden;
    }
  }

  .menu-wrapper {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    :deep(.arco-menu) {
      ::-webkit-scrollbar {
        width: 12px;
        height: 4px;
      }

      ::-webkit-scrollbar-thumb {
        border: 4px solid transparent;
        background-clip: padding-box;
        border-radius: 7px;
        background-color: var(--color-text-4);
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-text-3);
      }
    }
  }

  .layout-content {
    min-height: 100vh;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
</style>
