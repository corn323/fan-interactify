<template>
  <div class="sakura-container">
    <div v-for="n in sakuraCount" :key="n" class="sakura" :style="getStyle(n)"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 初始化為一個合理的預設值，以支持服務端渲染
const windowWidth = ref(1024); // 默認值
const sakuraCount = ref(50);
const addedAnimations = ref(new Set<string>());

// 在客戶端掛載後才讀取實際窗口寬度
onMounted(() => {
  // 現在安全地訪問 window 對象
  windowWidth.value = window.innerWidth;
  adjustSakuraCount();
  window.addEventListener('resize', adjustSakuraCount);
});

onUnmounted(() => {
  // 確保只在客戶端執行此操作
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', adjustSakuraCount);
  }
});

// 根據螢幕寬度調整櫻花數量
const adjustSakuraCount = () => {
  sakuraCount.value = windowWidth.value < 600 ? 25 : 50;
};

function getStyle(index: number) {
  const size = Math.random() * 10 + 10;
  const left = Math.random() * 100;
  const delay = Math.random() * 10;
  const duration = Math.random() * 10 + 15;
  const wind = Math.random() * 15 - 7.5;

  const animationName = `fall-${index}`;

  // 只在客戶端添加CSS規則
  if (process.client && !addedAnimations.value.has(animationName)) {
    try {
      document.styleSheets[0].insertRule(`
              @keyframes ${animationName} {
                  0% {
                      transform: translateY(0) translateX(0) rotate(0deg);
                  }
                  50% {
                      transform: translateY(50vh) translateX(${wind}px) rotate(180deg);
                  }
                  100% {
                      transform: translateY(100vh) translateX(${wind * -1}px) rotate(360deg);
                  }
              }
          `, document.styleSheets[0].cssRules.length);

      addedAnimations.value.add(animationName);
    } catch (e) {
      console.error('Error inserting CSS rule:', e);
    }
  }

  return {
    width: `${size}px`,
    height: `${size * 1.2}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    animationName: animationName,
    animationTimingFunction: 'linear',
    transform: `rotate(${Math.random() * 360}deg)`,
  };
}
</script>

<style scoped>
.sakura-container {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 5;
}

.sakura {
  position: absolute;
  top: -30px;
  background: radial-gradient(circle at 30% 30%, #fce4ec, #f8bbd0);
  border-radius: 50% 50% 50% 50%;
  opacity: 0.8;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-name: fall;
  animation-duration: 15s;
}

@media (max-width: 600px) {
  .sakura {
    opacity: 0.6;
  }
}

/* 提供基本的默認動畫，在客戶端會被替換 */
@keyframes fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }

  100% {
    transform: translateY(100vh) translateX(0) rotate(360deg);
  }
}
</style>