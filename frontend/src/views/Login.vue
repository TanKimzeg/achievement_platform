<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-header">
        <h2>中国人民公安大学</h2>
        <h3>学生成果登记与管理系统</h3>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form-content"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入学号/工号"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-button"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <p>请使用学号/工号和密码登录系统</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入学号/工号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        const result = await userStore.login(loginForm)
        
        if (result.success) {
          ElMessage.success('登录成功')
          
          // 根据用户角色跳转到对应页面
          const roleRoutes = {
            'student': '/student',
            'team_leader': '/leader',
            'admin': '/admin'
          }
          
          router.push(roleRoutes[result.user.role] || '/dashboard')
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        ElMessage.error('登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 30px 20px;
  
  h2 {
    font-size: 24px;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  h3 {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.9;
  }
}

.login-form-content {
  padding: 40px 30px 30px;
  
  .el-form-item {
    margin-bottom: 24px;
  }
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.login-footer {
  text-align: center;
  padding: 0 30px 30px;
  color: #666;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}
</style>