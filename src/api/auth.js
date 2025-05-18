// src/api/auth.js
import request from '@/utils/request';
import { API_URL } from '@/config';

/**
 * 管理员登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} - 返回包含token和用户信息的Promise
 */
export const login = (username, password) => {
  return request.post(`${API_URL}/api/auth/admin/login`, { username, password });
};

/**
 * 用户注册
 * @param {Object} user - 用户信息对象
 * @returns {Promise} - 返回注册结果的Promise
 */
export const register = (user) => {
  return request.post(`${API_URL}/api/auth/register`, user);
};

/**
 * 获取当前用户信息
 * @returns {Promise} - 返回用户信息的Promise
 */
export const getCurrentUser = () => {
  return request.get(`${API_URL}/api/auth/current`);
};

/**
 * 修改密码
 * @param {Object} passwordData - 包含旧密码和新密码的对象
 * @returns {Promise} - 返回修改结果的Promise
 */
export const changePassword = (passwordData) => {
  return request.post(`${API_URL}/api/auth/change-password`, passwordData);
};