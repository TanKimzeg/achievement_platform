<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-message">页面不存在</div>
      <div class="error-description">
        抱歉，您访问的页面不存在或已被删除
      </div>
      <el-button type="primary" @click="goHome">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const goHome = () => {
  if (userStore.isLoggedIn) {
    const roleRoutes = {
      'student': '/student',
      'team_leader': '/leader',
      'admin': '/admin'
    }
    router.push(roleRoutes[userStore.userRole] || '/login')
  } else {
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.not-found-content {
  text-align: center;
  
  .error-code {
    font-size: 120px;
    font-weight: bold;
    color: #409eff;
    line-height: 1;
    margin-bottom: 20px;
  }
  
  .error-message {
    font-size: 24px;
    color: #303133;
    margin-bottom: 12px;
  }
  
  .error-description {
    font-size: 16px;
    color: #909399;
    margin-bottom: 30px;
  }
}
</style>