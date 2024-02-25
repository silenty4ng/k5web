<template>
    <div class="container">
        <div style="background-color: #fff; padding: 10%;" v-show="state.type != 0">
            请点击网页“已扫码上传”按钮
        </div>
        <div style="background-color: #fff; padding: 10%;" v-show="state.type == 0">
            <p style="font-size: 1.5rem; font-weight: bold;">
                获取信息
            </p>
            <a-divider />
            <p>
                台站经度：{{ state.lng }}
            </p>
            <a-divider />
            <p>
                台站纬度：{{ state.lat }}
            </p>
            <a-divider />
            <p>
                台站海拔：{{ state.alt }}
            </p>
            <a-divider />
            <a-button type="primary" @click="upload">上传</a-button>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, nextTick, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/store';
import useLoading from '@/hooks/loading';

const state : {
    lat: number,
    lng: number,
    alt: number,
    type: number,
    uuid: string | null
} = reactive({
    lat: 0,
    lng: 0,
    alt: 0,
    type: 0,
    uuid: ''
})

onMounted(()=>{
    state.uuid = (new URLSearchParams(location.hash.replace("#/satloc?", ""))).get("uuid");
    navigator.geolocation.getCurrentPosition((e) => {
        if (e.coords) {
            state.lat = e.coords.latitude
            state.lng = e.coords.longitude
            if (e.coords.altitude) state.alt = e.coords.altitude
        }
    });
})

const upload = async () => {
    await fetch('https://k5.vicicode.com/api/lol', {
        method: "POST",
        mode: "cors",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            func: 0,
            uuid: state.uuid,
            cache: JSON.stringify([state.lng, state.lat, state.alt])
        })
    });
    state.type = 1
}

</script>
  
<script lang="ts">
export default {
    name: 'SatLoc',
};
</script>

<style scoped lang="less">
.container {
    background-color: rgb(242, 243, 245);
    width: 100vw;
    height: 100vh;
    padding-top: 10%;
    padding-left: 10%;
    padding-right: 10%;
}
</style>