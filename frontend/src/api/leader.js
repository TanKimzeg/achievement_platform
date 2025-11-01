import request from '@/utils/request'

/**
 * 获取待审核成果列表
 */
export function getPendingAchievements(params) {
  return request({
    url: '/leader/pending-achievements',
    method: 'get',
    params
  })
}

/**
 * 获取本队所有成果
 */
export function getTeamAchievements(params) {
  return request({
    url: '/leader/team-achievements',
    method: 'get',
    params
  })
}

/**
 * 审核成果
 */
export function auditAchievement(achievementId, data) {
  return request({
    url: `/leader/audit/${achievementId}`,
    method: 'post',
    data
  })
}

/**
 * 更新成果信息
 */
export function updateAchievementInfo(achievementId, data) {
  return request({
    url: `/leader/achievement/${achievementId}`,
    method: 'put',
    data
  })
}

/**
 * 批量操作成果
 */
export function batchOperateAchievements(data) {
  return request({
    url: '/leader/batch-operate',
    method: 'post',
    data
  })
}

/**
 * 获取审核记录
 */
export function getAuditLogs(params) {
  return request({
    url: '/leader/audit-logs',
    method: 'get',
    params
  })
}

/**
 * 获取队长统计数据
 */
export function getLeaderStatistics() {
  return request({
    url: '/leader/statistics',
    method: 'get'
  })
}

/**
 * 导出成果报表
 */
export function exportAchievements(params) {
  return request({
    url: '/leader/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}