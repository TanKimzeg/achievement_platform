import { defineStore } from 'pinia'
import { login, register, refreshToken, getUserProfile } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: getToken(),
    refreshTokenValue: localStorage.getItem('refresh_token')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    userRole: (state) => state.user?.role,
    userName: (state) => state.user?.name,
    userId: (state) => state.user?.user_id
  },

  actions: {
    // 登录
    async login(credentials) {
      try {
        const response = await login(credentials)
        const { access_token, refresh_token, user } = response.data
        
        this.token = access_token
        this.refreshTokenValue = refresh_token
        this.user = user
        
        setToken(access_token)
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('user_info', JSON.stringify(user))
        
        return { success: true, user }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || '登录失败' 
        }
      }
    },

    // 注册
    async register(userData) {
      try {
        const response = await register(userData)
        return { 
          success: true, 
          message: response.data.message,
          user: response.data.user 
        }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || '注册失败' 
        }
      }
    },

    // 刷新令牌
    async refreshAccessToken() {
      try {
        if (!this.refreshTokenValue) {
          throw new Error('No refresh token available')
        }
        
        const response = await refreshToken()
        const { access_token } = response.data
        
        this.token = access_token
        setToken(access_token)
        
        return access_token
      } catch (error) {
        this.logout()
        throw error
      }
    },

    // 检查认证状态
    async checkAuth() {
      try {
        if (!this.token) {
          const savedUser = localStorage.getItem('user_info')
          if (savedUser) {
            this.user = JSON.parse(savedUser)
          }
          return false
        }

        // 验证token有效性
        const response = await getUserProfile()
        this.user = response.data.user
        localStorage.setItem('user_info', JSON.stringify(this.user))
        
        return true
      } catch (error) {
        // Token无效，尝试刷新
        try {
          await this.refreshAccessToken()
          const response = await getUserProfile()
          this.user = response.data.user
          localStorage.setItem('user_info', JSON.stringify(this.user))
          return true
        } catch (refreshError) {
          this.logout()
          return false
        }
      }
    },

    // 登出
    logout() {
      this.user = null
      this.token = null
      this.refreshTokenValue = null
      
      removeToken()
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_info')
    },

    // 更新用户信息
    updateUser(userData) {
      this.user = { ...this.user, ...userData }
      localStorage.setItem('user_info', JSON.stringify(this.user))
    }
  }
})