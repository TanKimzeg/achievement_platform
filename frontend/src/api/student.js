import request from '@/utils/request'

/**
 * 获取我的成果列表
 */
export function getMyAchievements(params) {
  return request({
    url: '/student/achievements',
    method: 'get',
    params
  })
}

/**
 * 创建成果
 */
export function createAchievement(data) {
  return request({
    url: '/student/achievements',
    method: 'post',
    data
  })
}

/**
 * 更新成果
 */
export function updateAchievement(id, data) {
  return request({
    url: `/student/achievements/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除成果
 */
export function deleteAchievement(id) {
  return request({
    url: `/student/achievements/${id}`,
    method: 'delete'
  })
}

/**
 * 获取队长列表
 */
export function getLeaders() {
  return request({
    url: '/student/leaders',
    method: 'get'
  })
}

/**
 * 获取班级列表
 */
export function getClasses() {
  return request({
    url: '/student/classes',
    method: 'get'
  })
}

/**
 * 获取统计数据
 */
export function getStatistics() {
  return request({
    url: '/student/statistics',
    method: 'get'
  })
}