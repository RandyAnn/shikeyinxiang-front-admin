// src/api/user.js
import request from '@/utils/request';
import { API_URL } from '@/config';

/**
 * 获取用户列表
 * @param {Object} params - 查询参数，包含分页、筛选等信息
 * @returns {Promise} - 返回用户列表的Promise
 */
export const getUserList = (params) => {
  return request.get(`${API_URL}/api/admin/user`, { params });
};

/**
 * 获取用户详情
 * @param {number|string} userId - 用户ID
 * @returns {Promise} - 返回用户详情的Promise
 */
export const getUserDetail = (userId) => {
  return request.get(`${API_URL}/api/admin/user/${userId}`);
};

/**
 * 更新用户状态
 * @param {number|string} userId - 用户ID
 * @param {number|boolean} status - 用户状态，1或true表示启用，0或false表示禁用
 * @returns {Promise} - 返回更新结果的Promise
 */
export const updateusertatus = (userId, status) => {
  return request.put(`${API_URL}/api/admin/user/${userId}/status?status=${status ? 1 : 0}`);
};

/**
 * 添加用户
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回添加结果的Promise
 */
export const addUser = (userData) => {
  return request.post(`${API_URL}/api/admin/user`, userData);
};

/**
 * 更新用户
 * @param {number|string} userId - 用户ID
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回更新结果的Promise
 */
export const updateUser = (userId, userData) => {
  return request.put(`${API_URL}/api/admin/user/${userId}`, userData);
};

/**
 * 删除用户
 * @param {number|string} userId - 用户ID
 * @returns {Promise} - 返回删除结果的Promise
 */
export const deleteUser = (userId) => {
  return request.delete(`${API_URL}/api/admin/user/${userId}`);
};