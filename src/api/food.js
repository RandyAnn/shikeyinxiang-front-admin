// src/api/food.js
import request from '@/utils/request';
import { API_URL } from '@/config';

/**
 * 获取食物列表
 * @param {Object} params - 查询参数，包含分页、筛选等信息
 * @returns {Promise} - 返回食物列表的Promise
 */
export const getFoodList = (params) => {
  return request.get(`${API_URL}/api/admin/food/list`, { params });
};

/**
 * 获取食物详情
 * @param {number|string} foodId - 食物ID
 * @returns {Promise} - 返回食物详情的Promise
 */
export const getFoodDetail = (foodId) => {
  return request.get(`${API_URL}/api/admin/food/${foodId}`);
};

/**
 * 获取所有食物分类
 * @returns {Promise} - 返回食物分类列表的Promise
 */
export const getFoodCategories = () => {
  return request.get(`${API_URL}/api/admin/food/categories`);
};

/**
 * 添加食物
 * @param {Object} foodData - 食物数据
 * @returns {Promise} - 返回添加结果的Promise
 */
export const addFood = (foodData) => {
  return request.post(`${API_URL}/api/admin/food`, foodData);
};

/**
 * 更新食物
 * @param {number|string} foodId - 食物ID
 * @param {Object} foodData - 食物数据
 * @returns {Promise} - 返回更新结果的Promise
 */
export const updateFood = (foodId, foodData) => {
  return request.put(`${API_URL}/api/admin/food/${foodId}`, foodData);
};

/**
 * 删除食物
 * @param {number|string} foodId - 食物ID
 * @returns {Promise} - 返回删除结果的Promise
 */
export const deleteFood = (foodId) => {
  return request.delete(`${API_URL}/api/admin/food/${foodId}`);
};

/**
 * 更新食物状态
 * @param {number|string} foodId - 食物ID
 * @param {number|boolean} status - 食物状态，1或true表示启用，0或false表示禁用
 * @returns {Promise} - 返回更新结果的Promise
 */
export const updateFoodStatus = (foodId, status) => {
  return request.put(`${API_URL}/api/admin/food/${foodId}/status?status=${status ? 1 : 0}`);
};

/**
 * 获取食物图片上传URL
 * @param {number|string} foodId - 食物ID
 * @param {string} contentType - 文件类型，如 image/jpeg, image/png
 * @returns {Promise} - 返回上传URL的Promise
 */
export const getUploadImageUrl = (foodId, contentType) => {
  return request.get(`${API_URL}/api/admin/food/upload-image-url`, {
    params: { foodId, contentType }
  });
};

/**
 * 更新食物图片URL
 * @param {number|string} foodId - 食物ID
 * @param {string} imageUrl - 图片URL（文件路径）
 * @returns {Promise} - 返回更新结果的Promise
 */
export const updateFoodImageUrl = (foodId, imageUrl) => {
  return request.put(`${API_URL}/api/admin/food/${foodId}/image`, { imageUrl });
};

/**
 * 添加食物分类
 * @param {Object} categoryData - 分类数据
 * @returns {Promise} - 返回添加结果的Promise
 */
export const addCategory = (categoryData) => {
  return request.post(`${API_URL}/api/admin/food/category`, categoryData);
};

/**
 * 更新食物分类
 * @param {number} categoryId - 分类ID
 * @param {Object} categoryData - 分类数据
 * @returns {Promise} - 返回更新结果的Promise
 */
export const updateCategory = (categoryId, categoryData) => {
  return request.put(`${API_URL}/api/admin/food/category/${categoryId}`, categoryData);
};

/**
 * 删除食物分类
 * @param {number} categoryId - 分类ID
 * @returns {Promise} - 返回删除结果的Promise
 */
export const deleteCategory = (categoryId) => {
  return request.delete(`${API_URL}/api/admin/food/category/${categoryId}`);
};

/**
 * 分页获取食物分类
 * @param {Object} params - 查询参数，包含分页信息
 * @returns {Promise} - 返回分类列表的Promise
 */
export const getCategoriesByPage = (params) => {
  return request.get(`${API_URL}/api/admin/food/category/page`, { params });
};

/**
 * 导入食物数据（CSV格式）
 * @param {Array} foodData - 食物数据数组
 * @returns {Promise} - 返回导入结果的Promise
 */
export const importFoods = (foodData) => {
  return request.post(`${API_URL}/api/admin/food/import`, { foods: foodData });
};
