<template>
  <div class="display-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- 主题切换按钮 -->
    <ThemeToggle />
    <div class="header">
      <h1 class="title">成果展示</h1>
      <p class="subtitle">优秀学生成果展示平台</p>
    </div>
    
    <div class="content">
      <div class="placeholder">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h2>页面开发中</h2>
        <p>成果展示功能正在开发中，敬请期待...</p>
        <button class="back-btn" @click="goBack">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.display-container {
  min-height: 100vh;
  background: url('~@/assets/back.jpg') center center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.8), 0 0 12px rgba(0, 0, 0, 0.6);
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  opacity: 1;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6);
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
}

.icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  color: #3b82f6;
}

.icon svg {
  width: 100%;
  height: 100%;
}

.placeholder h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.placeholder p {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.back-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .placeholder {
    padding: 2rem;
    margin: 1rem;
  }
}
</style>