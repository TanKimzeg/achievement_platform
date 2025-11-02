<template>
  <div class="theme-toggle">
    <!-- 自定义加载动画遮罩 -->
    <div v-if="showLoading" class="loading-overlay" :class="{ 'dark-mode': isDarkMode }">
      <div class="bg">
        <div class="loader"></div>
      </div>
    </div>
    
    <button @click="toggleTheme" class="toggle-btn" :title="isDarkMode ? '切换到亮色模式' : '切换到暗色模式'">
      <transition name="icon-fade" mode="out-in">
        <span v-if="isDarkMode" key="moon" class="icon">🌙</span>
        <span v-else key="sun" class="icon">☀️</span>
      </transition>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const showLoading = ref(false)

const toggleTheme = () => {
  // 显示加载动画
  showLoading.value = true
  
  // 切换主题
  themeStore.toggleTheme()
  
  // 500ms后关闭加载动画
  setTimeout(() => {
    showLoading.value = false
  }, 500)
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 5px;
  right: 150px;
  z-index: 1000;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.icon {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s ease;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(-180deg) scale(0.5);
}

/* 加载动画样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-overlay.dark-mode {
  background: rgba(0, 0, 0, 0.85);
}

.bg {
  padding: 20px;
  border-radius: 10px;
  background-color: var(--base-color);
  --base-color: #1e3a8a;
}

.dark-mode .bg {
  --base-color: #3b82f6;
}

.loader {
  width: 60px;
  height: 40px;
  position: relative;
  display: inline-block;
  background-color: var(--base-color);
}

.loader::before {
  content: '';
  left: 0;
  top: 0;
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #FFF;
  background-image: radial-gradient(circle 8px at 18px 18px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 18px 0px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 0px 18px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 36px 18px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 18px 36px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 30px 5px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 30px 5px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 30px 30px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 5px 30px, var(--base-color) 100%, transparent 0), radial-gradient(circle 4px at 5px 5px, var(--base-color) 100%, transparent 0);
  background-repeat: no-repeat;
  box-sizing: border-box;
  animation: rotationBack 3s linear infinite;
}

.loader::after {
  content: '';
  left: 35px;
  top: 15px;
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FFF;
  background-image: radial-gradient(circle 5px at 12px 12px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 12px 0px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 0px 12px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 24px 12px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 12px 24px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 20px 3px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 20px 3px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 20px 20px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 3px 20px, var(--base-color) 100%, transparent 0), radial-gradient(circle 2.5px at 3px 3px, var(--base-color) 100%, transparent 0);
  background-repeat: no-repeat;
  box-sizing: border-box;
  animation: rotationBack 4s linear infinite reverse;
}

@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@media (max-width: 768px) {
  .theme-toggle {
    top: 15px;
    right: 120px;
  }
  
  .toggle-btn {
    width: 40px;
    height: 40px;
  }
  
  .icon {
    font-size: 16px;
  }
}
</style>