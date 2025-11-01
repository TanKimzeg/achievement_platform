import request from '@/utils/request'

/**
 * 获取管理员统计数据
 */
export function getAdminStatistics() {
  return request({
    url: '/admin/statistics',
    method: 'get'
  })
}

/**
 * 获取所有用户列表
 */
export function getAllUsers(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params
  })
}

/**
 * 创建用户
 */
export function createUser(data) {
  return request({
    url: '/admin/users',
    method: 'post',
    data
  })
}

/**
 * 更新用户信息
 */
export function updateUser(userId, data) {
  return request({
    url: `/admin/users/${userId}`,
    method: 'put',
    data
  })
}

/**
 * 删除用户
 */
export function deleteUser(userId) {
  return request({
    url: `/admin/users/${userId}`,
    method: 'delete'
  })
}

/**
 * 获取所有班级列表
 */
export function getAllClasses(params) {
  return request({
    url: '/admin/classes',
    method: 'get',
    params
  })
}

/**
 * 创建班级
 */
export function createClass(data) {
  return request({
    url: '/admin/classes',
    method: 'post',
    data
  })
}

/**
 * 更新班级信息
 */
export function updateClass(classId, data) {
  return request({
    url: `/admin/classes/${classId}`,
    method: 'put',
    data
  })
}

/**
 * 删除班级
 */
export function deleteClass(classId) {
  return request({
    url: `/admin/classes/${classId}`,
    method: 'delete'
  })
}

/**
 * 获取所有成果列表
 */
export function getAllAchievements(params) {
  return request({
    url: '/admin/achievements',
    method: 'get',
    params
  })
}

/**
 * 更新成果公开状态
 */
export function updateAchievementPublic(achievementId, isPublic) {
  return request({
    url: `/admin/achievements/${achievementId}/public`,
    method: 'put',
    data: { is_public: isPublic }
  })
}

/**
 * 批量操作成果
 */
export function batchOperateAchievements(data) {
  return request({
    url: '/admin/achievements/batch',
    method: 'post',
    data
  })
}

/**
 * 获取系统配置
 */
export function getSystemConfig() {
  return request({
    url: '/config',
    method: 'get'
  })
}

/**
 * 更新系统配置
 */
export function updateSystemConfig(data) {
  return request({
    url: '/config',
    method: 'put',
    data
  })
}

/**
 * 导出数据
 */
export function exportData(params) {
  return request({
    url: '/admin/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}