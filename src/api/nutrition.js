// src/api/nutrition.js
import request from '@/utils/request';
import { API_URL } from '@/config';

/**
 * 获取营养摄入趋势数据
 * @param {Object} params - 查询参数
 * @param {string} [params.period='month'] - 时间周期：week(周)、month(月)、year(年)
 * @param {string} [params.startDate] - 开始日期，格式：YYYY-MM-DD
 * @param {string} [params.endDate] - 结束日期，格式：YYYY-MM-DD
 * @returns {Promise} - 返回趋势数据的Promise
 */
export const getNutritionTrend = (params = {}) => {
  return request.get(`${API_URL}/api/admin/nutrition/trend`, { params });
};

/**
 * 获取营养达标率
 * @param {string} [date] - 日期，格式：YYYY-MM-DD，默认为当天
 * @returns {Promise} - 返回营养达标率的Promise
 */
export const getNutritionComplianceRate = (date) => {
  const params = {};
  if (date) {
    params.date = date;
  }
  return request.get(`${API_URL}/api/admin/nutrition/compliance-rate`, { params });
};

/**
 * 获取所有营养建议
 * @returns {Promise} - 返回营养建议列表的Promise
 */
export const getAllAdvices = () => {
  return request.get(`${API_URL}/api/admin/nutrition/advice`);
};

/**
 * 根据ID获取营养建议
 * @param {number|string} id - 营养建议ID
 * @returns {Promise} - 返回营养建议的Promise
 */
export const getAdviceById = (id) => {
  return request.get(`${API_URL}/api/admin/nutrition/advice/${id}`);
};

/**
 * 创建营养建议
 * @param {Object} advice - 营养建议对象
 * @returns {Promise} - 返回创建后的营养建议的Promise
 */
export const createAdvice = (advice) => {
  return request.post(`${API_URL}/api/admin/nutrition/advice`, advice);
};

/**
 * 更新营养建议
 * @param {number|string} id - 营养建议ID
 * @param {Object} advice - 营养建议对象
 * @returns {Promise} - 返回更新后的营养建议的Promise
 */
export const updateAdvice = (id, advice) => {
  return request.put(`${API_URL}/api/admin/nutrition/advice/${id}`, advice);
};

/**
 * 删除营养建议
 * @param {number|string} id - 营养建议ID
 * @returns {Promise} - 返回操作结果的Promise
 */
export const deleteAdvice = (id) => {
  return request.delete(`${API_URL}/api/admin/nutrition/advice/${id}`);
};

/**
 * 根据条件类型获取营养建议
 * @param {string} conditionType - 条件类型
 * @returns {Promise} - 返回营养建议列表的Promise
 */
export const getAdvicesByConditionType = (conditionType) => {
  return request.get(`${API_URL}/api/admin/nutrition/advice/condition/${conditionType}`);
};
