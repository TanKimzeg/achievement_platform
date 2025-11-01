import request from '@/utils/request'

/**
 * 用户登录
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 */
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

/**
 * 刷新访问令牌
 */
export function refreshToken() {
  const refreshTokenValue = localStorage.getItem('refresh_token')
  return request({
    url: '/auth/refresh',
    method: 'post',
    headers: {
      Authorization: `Bearer ${refreshTokenValue}`
    }
  })
}

/**
 * 获取用户信息
 */
export function getUserProfile() {
  return request({
    url: '/auth/profile',
    method: 'get'
  })
}