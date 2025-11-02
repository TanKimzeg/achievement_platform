<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const configStore = useConfigStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

// 初始化主题系统
onMounted(() => {
  themeStore.init()
})

// 监听路由变化，智能刷新配置
watch(() => route.path, async () => {
  // 只有在用户已登录时才检查配置
  if (userStore.isLoggedIn) {
    try {
      await configStore.smartLoadConfig()
    } catch (error) {
      console.error('路由变化时配置检查失败:', error)
    }
  }
}, { immediate: false })
</script>

<style lang="scss">
@import '@/styles/theme.scss';

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-secondary);
  transition: background-color 0.3s ease;
}
</style>