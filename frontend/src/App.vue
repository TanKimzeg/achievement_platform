<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const configStore = useConfigStore()
const userStore = useUserStore()

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
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
</style>