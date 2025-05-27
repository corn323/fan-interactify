<template>
  <div>
    <div class="qrcode-container">
      <QRCodeVue v-if="qrcodeData" :value="qrcodeData" :size="200" />
      <p v-else>讀取中...</p>
      <p>蘋果手機、平板請允許方向訪問權限，不然會無法使用</p>
    </div>

    <div class="shake-device-container">
      <transition-group name="fade-shake" tag="div">
        <div v-for="(shakeDirection, deviceId) in shakeData" :key="deviceId" class="device-shake-item"
          :style="getRandomPosition(deviceId)">
          <img src="https://i.postimg.cc/bZVHKbBM/light-Stick.png" :class="[
            'light-stick',
            { 'shake-left': Number(shakeDirection) < 0, 'shake-right': Number(shakeDirection) > 0 }
          ]" alt="Light Stick" />
        </div>
      </transition-group>
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


const UPDATE_FREQUENCY = 200;

// 取得 QR Code 內容
onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3001/getUrl");
    const url = await response.text();
    qrcodeData.value = url;
  } catch (error) {
    console.error("Error fetching QR code URL:", error);
  }
});

// 裝置位置快取（避免閃爍）
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

// 取得搖晃資料 + 動態移除舊裝置
async function fetchUserData() {
  try {
    const response = await fetch("http://localhost:3001/getUserData");
    const responseData = await response.json();

    const newData = {};
    const newIds = new Set();

    if (Array.isArray(responseData)) {
      for (const device of responseData) {
        newData[device.id] = device.Rotation;
        newIds.add(device.id);
      }
    } else if (typeof responseData === 'object' && responseData !== null) {
      for (const [id, rotation] of Object.entries(responseData)) {
        newData[id] = rotation;
        newIds.add(id);
      }
    }

    // 刪除消失的裝置 ID
    for (const existingId in shakeData.value) {
      if (!newIds.has(existingId)) {
        delete shakeData.value[existingId];
        delete positionCache[existingId];
      }
    }

    // 合併新資料
    shakeData.value = { ...shakeData.value, ...newData };

  } catch (error) {
    console.error("Error fetching shake data:", error);
  }
}

// 啟動資料輪詢
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
  align-items: left top;
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
  width: 50px;
  transform: rotate(0deg);
  transition: transform 0.4s cubic-bezier(0.25, 1.5, 0.5, 1);
}

.shake-left {
  transform: rotate(-20deg);
}

.shake-right {
  transform: rotate(20deg);
}

/* === 平滑進出動畫 === */
.fade-shake-enter-active,
.fade-shake-leave-active {
  transition: all 0.5s ease;
}

.fade-shake-enter-from,
.fade-shake-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>
