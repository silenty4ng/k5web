<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          K5Web 工具箱
        </a-typography-title>
        <icon-menu-fold
          v-if="!topMenu && appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" />
    </div>
    <ul class="right-side">
      <li>
        <a-button type="primary" @click="connectIt">{{ appStore.connectState ? '断开' : '连接' }}</a-button>
      </li>
      <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="handleToggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip
          :content="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, inject } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useDark, useToggle, useFullscreen } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  import Menu from '@/components/menu/index.vue';
  import { connect, disconnect, eeprom_init } from '@/utils/serial.js';
  const drivers = import.meta.glob('@/drivers/*.json', { eager: true });

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { logout } = useUser();
  const { changeLocale, currentLocale } = useLocale();
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
  const locales = [...LOCALE_OPTIONS];
  const avatar = computed(() => {
    return userStore.avatar;
  });
  const theme = computed(() => {
    return appStore.theme;
  });
  const topMenu = computed(() => appStore.topMenu && appStore.menu);
  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      // overridden default behavior
      appStore.toggleTheme(dark);
    },
  });
  const toggleTheme = useToggle(isDark);
  const handleToggleTheme = () => {
    toggleTheme();
  };
  const triggerBtn = ref();
  const handleLogout = () => {
    logout();
  };
  const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    triggerBtn.value.dispatchEvent(event);
  };
  const switchRoles = async () => {
    const res = await userStore.switchRoles();
    Message.success(res as string);
  };
  const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;

  const configuration_list : any = {
    "LOSEHU.*P.*K"       : "ltsk.json",
    "LOSEHU.*P.*"        : "lts.json",
    "LOSEHU12[4-9].*H"   : "losehu124h.json",
    "LOSEHU12[0-3].*H"   : "losehu118h.json",
    "LOSEHU12[0-9].*K"   : "losehu120k.json",
    "LOSEHU12[0-9].*"    : "losehu118.json",
    "LOSEHU11[8-9].*H"   : "losehu118h.json",
    "LOSEHU11[8-9].*K"   : "losehu118k.json",
    "LOSEHU11[8-9].*"    : "losehu118.json",
    "LOSEHU11[2-7].*K"   : "losehu117k.json",
    "LOSEHU11[2-7].*"    : "losehu117.json",
    ".*"                 : "todo.json"
  }

  const connectIt = async () => {
    if(appStore.connectState == false){
      try{
        if(appStore.connectPort)await disconnect(appStore.connectPort);
      }catch{}
      let _connect;
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        alert('手机写频开发中，无法正常使用，请使用电脑连接电台写频！！！')
        await serial.requestPort().then(selectedPort => {
          _connect = selectedPort;
        });
        if(_connect){
          await _connect.connect().then().catch((e)=>{
            alert('请尝试刷新网页重新插拔写频线')
          })
        }
      }else{
        _connect = await connect();
      }

      if(!_connect){
        alert('连接失败');
        return;
      }
      appStore.updateSettings({ connectPort: _connect });

      const driversList : any = {};
      Object.keys(drivers).forEach((key) => {
        driversList[key.substring(key.lastIndexOf('/') + 1)] = drivers[key].default;
      })

      let _configuration = null;
      
      const version = await eeprom_init(_connect);
      const config = {
        "name": "TODO",
        "uart": "official",
        "charset": "official",
        "K": false,
        "H": false,
        "localmdc": false,
        "sat": false,
        "newpinyin": false
      }

      Object.keys(configuration_list).some(e=>{
        const _re = new RegExp(e);
        if(_re.test(version)){
          _configuration = Object.assign(config, driversList[configuration_list[e]]);
          return true
        }
      })

      appStore.updateSettings({ connectState: true, firmwareVersion: version, configuration: _configuration });
    }else{
      await disconnect(appStore.connectPort);
      appStore.updateSettings({ connectState: false, connectPort: null, firmwareVersion: "" });
    }
  }
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .center-side {
    flex: 1;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    :deep(.locale-select) {
      border-radius: 20px;
    }
    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }
    .nav-btn {
      border-color: rgb(var(--gray-2));
      color: rgb(var(--gray-8));
      font-size: 16px;
    }
    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }
    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
