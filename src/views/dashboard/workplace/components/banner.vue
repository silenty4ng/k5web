<template>
  <a-col class="banner">
    <a-col>
      <a-typography-title :heading="5" style="margin-top: 0">
        {{ appStore.connectState ? $t('workplace.welcomeSuc') : $t('workplace.welcome') }}
      </a-typography-title>
    </a-col>
    <a-divider class="panel-border" />
    <a-space>
      <a-card v-show="appStore.connectState" :style="{ marginTop: '2em', marginBottom: '2em' }" :title="$t('workplace.info')">
          {{ $t('workplace.current') }}{{ appStore.firmwareVersion }} <br />
          {{ $t('workplace.writeconfig') }}{{ appStore.configuration?.name }} <br />
          {{ $t('workplace.eepromSize') }}{{ state.eepromSize }} {{ state.eepromSize != t('workplace.clickCheck') &&  appStore.configuration?.uart == 'official' ? t('workplace.clickNotice') : ''}} <a-button size="mini" type="primary" @click="checkEeprom">{{ $t('workplace.checkIt') }}</a-button>
      </a-card>
    </a-space>
    <div>
      <a-typography-title :heading="5">说明：</a-typography-title>
      <a-typography-text>◆ 泉盛 K5/K6 当前在售两个硬件版本，如使用第三方固件请先与商家确认可以升级到第三方固件。</a-typography-text><br>
      <a-typography-text>◆ 使用应第一时间<t-link theme="primary" href="/#/tool/backup">备份</t-link>配置及校准数据。</a-typography-text><br>
      <a-typography-text>◆ 除“固件升级”功能手台应处于升级模式点击更新按钮选择设备更新，其余功能手台均需要在正常模式连接。</a-typography-text><br>
      <a-typography-text>◆ 萝卜（LOSEHU）固件相关问题请移步：<t-link theme="primary" href="https://github.com/losehu/uv-k5-firmware-custom" target="_blank">https://github.com/losehu/uv-k5-firmware-custom</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ K5Web 官扩刷中文教程（BG3ODZ）：<t-link theme="primary" href="https://www.bilibili.com/video/BV1Ab421p7rN" target="_blank">https://www.bilibili.com/video/BV1Ab421p7rN</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ K5Web 自扩刷中文教程（BG3ODZ）：<t-link theme="primary" href="https://www.bilibili.com/video/BV1Qk2BYDErN" target="_blank">https://www.bilibili.com/video/BV1Qk2BYDErN</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ K5Web 使用视频教程（BG3ODZ）：<t-link theme="primary" href="https://www.bilibili.com/video/BV1Q4421D75x" target="_blank">https://www.bilibili.com/video/BV1Q4421D75x</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ K5Web 使用视频教程（BG7QJV）：<t-link theme="primary" href="https://www.douyin.com/video/7378314511419313458" target="_blank">https://www.douyin.com/video/7378314511419313458</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ 感谢<t-link theme="primary" href="/#/chirp/thanks">各位</t-link>对 K5Web 的支持，本站将至少维护至 2026年11月21日 23:59:59。</a-typography-text>
    </div>
    <div style="margin-top: 50px;">&nbsp;</div>
    <div>
      <a-collapse :default-active-key="state.activeKey" accordion @change="changeMainActive">
        <a-collapse-item header="帮我完成问卷！谢谢！" :key="0">
          <img loading="lazy" class="tencent" style="margin-bottom: 10px;" width="300px" src="/poster.png" />
        </a-collapse-item>
        <a-collapse-item header="广告区" :key="1">
          <a-space>
            <a-card hoverable :style="{ width: '500px' }">
              <template #cover>
                <div
                >
                  <img
                    loading="lazy"
                    :style="{ width: '100%' }"
                    alt="ads"
                    src="/jjgg.jpg"
                  />
                </div>
              </template>
              <a-card-meta title="BG4IWE 投放">
              </a-card-meta>
            </a-card>
          </a-space>
        </a-collapse-item>
        <a-collapse-item header="腾讯公益" :key="2">
          <img loading="lazy" class="tencent" style="margin-bottom: 10px;" width="200px" src="/gy.png" />
        </a-collapse-item>
        <a-collapse-item header="饿饿饭饭" :key="3">
          <img loading="lazy" width="300" src="/mm_facetoface_collect_qrcode_1714392837792.png" >
          <img loading="lazy" width="263" src="/1722745910257.jpg" >
          <img loading="lazy" width="272.1" src="/20250815183238_4.jpg" >
          <br><br>
          TRON / TRX：TPaSnHJ2cRCQjjv7TyAFJDamb3mZSSz1At
        </a-collapse-item>
      </a-collapse>
    </div>
    <br>
    <a href="https://apps.microsoft.com/detail/9pb0w69f5dp6?referrer=appbadge&mode=direct" target="_blank">
      <img :src="`https://get.microsoft.com/images/${getLang()}%20dark.svg`" width="200"/>
    </a>
    <!-- <div class="halloween">
      <div class="head">
        <div class="skull">
          <div class="eyes">
            <div class="eye eye-left"></div>
            <div class="eye eye-right"></div>
          </div>
        </div>
      </div>
      <div class="body"></div>
      <div class="legs"></div>
    </div> -->
    <br>
    <br>
  </a-col>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useAppStore } from '@/store';
  import { eeprom_write, eeprom_reboot, eeprom_init, eeprom_read, check_eeprom } from '@/utils/serial.js';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const appStore = useAppStore();

  const getLang = () => {
    return navigator.language;
  }

  const state = reactive({
    eepromSize: t('workplace.clickCheck'),
    activeKey: JSON.parse(localStorage.getItem('mainActiveKey') ?? "[0]")
  })

  const changeMainActive = (e: any) => {
    localStorage.setItem('mainActiveKey', JSON.stringify(e))
  }

  const checkEeprom = async () => {
    const eepromSize = await check_eeprom(appStore.connectPort, appStore.configuration?.uart);
    switch(eepromSize){
      case 0x2000:
        state.eepromSize = t('global.8kb');
        break;
      case 0x10000:
        state.eepromSize = t('global.64kb');
        break;
      case 0x20000:
        state.eepromSize = t('global.128kb');
        break;
      case 0x40000:
        state.eepromSize = t('global.256kb');
        break;
      case 0x80000:
        state.eepromSize = t('global.512kb');
        break;
      default:
        state.eepromSize = t('workplace.unk');
        break;
    }
  }
</script>

<style scoped lang="less">
  :deep(.arco-collapse-item-content-expend){
    background-color: var(--color-bg-2);
  }
  :deep(.arco-collapse-item-content-box){
    background-color: var(--color-bg-2);
  }
  .banner {
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px 4px 0 0;
  }

  :deep(.arco-icon-home) {
    margin-right: 6px;
  }

  body[arco-theme='dark'] { 
    .tencent {
      filter: invert(1) hue-rotate(180deg);
    }
  }

  .halloween .head .skull:before,
  .halloween .head .skull:after,
  .halloween .eyes .eye:before,
  .halloween .body:before,
  .halloween .body:after,
  .halloween .legs:before{
    content:'';
    position:absolute;
  }
  .halloween{
    width:30px;
    height:44px;
    margin-left:20px;
    animation:move 3s infinite;
  }
  .halloween .head{
    z-index:1;
    width:25px;
    height:25px;
    background:#444;
    border-radius:50%;
    position:relative;
  }
  .halloween .head .skull{
    left:2px;
    bottom:2px;
    width:16px;
    height:16px;
    color:#f9f9f9;
    border-radius:50%;
    background:#f9f9f9;
    position:absolute;
    animation:skull 3s infinite;
  }
  .halloween .head .skull:before{
    top:9px;
    width:0;
    left:50%;
    height:0;
    z-index:1;
    margin-left:-2px;
    border:2px solid transparent;
    border-bottom:2px solid #444;
  }
  .halloween .head .skull:after{
    top:14px;
    left:50%;
    width:1px;
    height:4px;
    margin-left:-1px;
    background:#f9f9f9;
    box-shadow: 2px 0,-2px 0,4px 0,-4px 0,
          -3px -2px,-1px -2px,1px -2px,3px -2px
  }
  .halloween .eyes{
    width:inherit;
    height:inherit;
    overflow:hidden;
    border-radius:50%;
    position:relative;
  }
  .halloween .eyes .eye{
    top:5px;
    width:5px;
    height:5px;
    position:absolute;
    border-radius:50%;
    background:#f8cd22;
    border:1px solid #444;
    border-right:2px solid #444;
  }
  .halloween .eyes .eye:before{
    top:-1px;
    left:-1px;
    width:5px;
    height:3px;
    background:#f9f9f9;
    border-radius:5px 5px 0 0;
    animation:eyes 3s infinite;
  }
  .halloween .eyes .eye.eye-left{
    left:1px;
  }
  .halloween .eyes .eye.eye-right{
    right:1px;
  }
  .halloween .body{
    top:-3px;
    width:24px;
    height:17px;
    background:#444;
    position:relative;
    border-radius:10px 10px 2px 2px;
  }
  .halloween .body:before,
  .halloween .body:after{
    top:3px;
    width:4px;
    height:12px;
    background:#444;
  }
  .halloween .body:before{
    left:-1px;
    border-radius:100% 0 0 2px;
    transform:rotate(10deg);
    animation:hand-left 3s infinite;
  }
  .halloween .body:after{
    right:-1px;
    border-radius:0 100% 2px 0;
    transform:rotate(-10deg);
    animation:hand-right 3s infinite;
  }
  .halloween .legs{
    top:-3px;
    left:50%;
    width:21px;
    height:10px;
    overflow:hidden;
    margin-left:-13px;
    position:relative;
    border-bottom:1px solid rgba(0,0,0,.2);
  }
  .halloween .legs:before{
    top:0;
    left:-7px;
    width:60px;
    height:10px;
    background-image:linear-gradient(-495deg, #444 4px,transparent 0), linear-gradient(-45deg, transparent 4px, #444 0);
    background-size:4px 8px;
    background-repeat:repeat-x;
    animation:legs 3s infinite;
  }
  @keyframes move{
    0%{
      transform:translateX(0)
    }
    50%{
      transform:translateX(15px)
    }
    100%{
      transform:translateX(0)
    }
  }
  @keyframes skull{
    0%{
      transform:translate(0,0)
    }
    25%{
      transform:translate(2px,1px)
    }
    75%{
      transform:translate(3px,-1px)
    }
    100%{
      transform:translate(0,0)
    }
  }
  @keyframes eyes{
    0%{
      top:-5px;
      border-radius:50%;
    }
    50%{
      top:-1px;
      border-radius:5px 5px 0 0;
    }
    100%{
      top:-5px;
      border-radius:50%;
    }
  }
  @keyframes legs{
    0%{
      left:-7px;
    }
    50%{
      left:-25px;
    }
    100%{
      left:-7px;
    }
  }
  @keyframes hand-left{
    0%{
      left:1px;
    }
    50%{
      left:-2px;
    }
    100%{
      left:1px;
    }
  }
  @keyframes hand-right{
    0%{
      right:1px;
    }
    50%{
      right:-2px;
    }
    100%{
      right:1px;
    }
  }
  .adimg1:hover {
    .adimg1c {
      display: block !important;
    }
  }
</style>
