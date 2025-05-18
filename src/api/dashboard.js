import request from '@/utils/request'
import { API_URL } from '@/config'

/**
 * 获取仪表盘统计数据
 * @returns {Promise} 返回统计数据
 */
export function getDashboardStats() {
  return request({
    url: `${API_URL}/api/admin/dashboard/stats`,
    method: 'get'
  })
}

/**
 * 获取营养摄入趋势数据
 * @param {String} period - 时间周期：week(周)、month(月)、year(年)
 * @param {String} startDate - 开始日期，格式：yyyy-MM-dd
 * @param {String} endDate - 结束日期，格式：yyyy-MM-dd
 * @returns {Promise} 返回趋势数据
 */
export function getNutritionTrend(period, startDate, endDate) {
  const params = { period }
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate

  return request({
    url: `${API_URL}/api/admin/dashboard/nutrition-trend`,
    method: 'get',
    params
  })
}

/**
 * 获取最新饮食记录
 * @param {Object} query - 查询参数
 * @returns {Promise} 返回记录列表
 */
export function getLatestDietRecords(query) {
  return request({
    url: `${API_URL}/api/admin/dashboard/latest-diet-records`,
    method: 'get',
    params: query
  })
}

/**
 * 获取热门食物统计数据
 * @param {String} period - 时间周期：week(周)、month(月)、quarter(季度)
 * @returns {Promise} 返回热门食物数据
 */
export function getPopularFoods(period = 'month') {
  return request({
    url: `${API_URL}/api/admin/dashboard/popular-foods`,
    method: 'get',
    params: { period }
  })
}

/**
 * 获取饮食记录详情
 * @param {Number} recordId - 记录ID
 * @returns {Promise} 返回饮食记录详情
 */
export function getDietRecordDetail(recordId) {
  return request({
    url: `${API_URL}/api/admin/dashboard/diet-record/${recordId}`,
    method: 'get'
  })
} 