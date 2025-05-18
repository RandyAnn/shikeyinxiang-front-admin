// src/api/diet.js
// 饮食记录相关 API 请求

import request from '@/utils/request';
import { API_URL } from '@/config';

/**
 * 获取所有用户的饮食记录列表(分页)
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 * @param {number} [params.userId] - 用户ID(可选)
 * @param {string} [params.startDate] - 开始日期(可选,格式:YYYY-MM-DD)
 * @param {string} [params.endDate] - 结束日期(可选,格式:YYYY-MM-DD)
 * @param {string} [params.mealType] - 餐次类型(可选)
 * @returns {Promise} promise
 */
export const getDietRecords = (params) => {
  return request.get(`${API_URL}/api/admin/diet-records`, { params });
};

/**
 * 获取单条饮食记录详情
 * @param {number} id - 记录ID
 * @returns {Promise} promise
 */
export const getDietRecordDetail = (id) => {
  return request.get(`${API_URL}/api/admin/diet-records/${id}`);
};

/**
 * 删除饮食记录
 * @param {number} id - 记录ID
 * @returns {Promise} promise
 */
export const deleteDietRecord = (id) => {
  return request.delete(`${API_URL}/api/admin/diet-records/${id}`);
}; 