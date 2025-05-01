<template>
  <div>
    <div class="qrcode-container">
      <QRCodeVue v-if="qrcodeData" :value="qrcodeData" :size="200" />
      <p v-else>讀取中...</p>
      <p>蘋果手機、平板請允許方向訪問權限，不然會無法使用</p>
    </div>
    <div class="shake-device-container">
      <div v-for="(shakeDirection, deviceId) in shakeData" :key="deviceId" class="device-shake-item"
        :style="getRandomPosition(deviceId)">
        <img src='https://i.postimg.cc/bZVHKbBM/light-Stick.png' :class="[
          'light-stick',
          { 'shake-left': Number(shakeDirection) < 0, 'shake-right': Number(shakeDirection) > 0 }
        ]" alt="Light Stick" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import QRCodeVue from 'qrcode.vue';

const qrcodeData = ref('');
const shakeData = ref({});
const positionCache = reactive({});
const updateInterval = ref(null);

const UPDATE_FREQUENCY = 50;

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3001/getUrl");
    const url = await response.text();
    qrcodeData.value = url;
  } catch (error) {
    console.error("Error fetching QR code URL:", error);
  }
});

const getRandomPosition = (deviceId) => {
  if (positionCache[deviceId]) {
    return positionCache[deviceId];
  }

  const randomLeft = Math.floor(Math.random() * 80) + 10;
  const randomBottom = Math.floor(Math.random() * 20) + 8;

  const position = {
    position: 'absolute',
    left: `${randomLeft}%`,
    bottom: `${randomBottom}%`,
    transform: 'translate(-50%, -50%)'
  };

  positionCache[deviceId] = position;
  return position;
};

async function fetchUserData() {
  try {
    const response = await fetch("http://localhost:3001/getUserData");

    const responseData = await response.json();

    const newData = {};
    if (Array.isArray(responseData)) {
      for (const device of responseData) {
        newData[device.id] = device.Rotation;
      }
    } else if (typeof responseData === 'object' && responseData !== null) {
      Object.assign(newData, responseData);
    }

    shakeData.value = newData;
  } catch (error) {
    console.error("Error fetching shake data:", error);
  }
}

onMounted(() => {
  fetchUserData();

  updateInterval.value = setInterval(fetchUserData, UPDATE_FREQUENCY);
});

onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value);
  }
});
</script>

<style scoped>
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.shake-device-container {
  position: fixed;
  width: 100%;
  height: 75%;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: 10;
  will-change: transform;
}

.device-shake-item {
  position: absolute;
  z-index: 20;
  will-change: transform;
}

.light-stick {
  width: 100px;
  transition: transform 0.1s ease;
  will-change: transform;
}

.shake-left {
  transform: rotate(-15deg);
}

.shake-right {
  transform: rotate(15deg);
}
</style>