// src/utils/filters.js
// 全局过滤器

import { formatDate } from './index';

/**
 * 日期格式化过滤器
 * @param {Date|string|number} value - 日期值
 * @param {string} format - 格式化模板
 * @returns {string} - 格式化后的日期字符串
 */
export function dateFormat(value, format = 'YYYY-MM-DD HH:mm:ss') {
  return formatDate(value, format);
}

/**
 * 数字格式化过滤器
 * @param {number} value - 数字值
 * @param {number} decimals - 小数位数
 * @returns {string} - 格式化后的数字字符串
 */
export function numberFormat(value, decimals = 2) {
  if (!value && value !== 0) return '';
  
  const num = Number(value);
  if (isNaN(num)) return '';
  
  return num.toFixed(decimals);
}

/**
 * 货币格式化过滤器
 * @param {number} value - 数字值
 * @param {string} currency - 货币符号
 * @param {number} decimals - 小数位数
 * @returns {string} - 格式化后的货币字符串
 */
export function currencyFormat(value, currency = '¥', decimals = 2) {
  if (!value && value !== 0) return '';
  
  const num = Number(value);
  if (isNaN(num)) return '';
  
  return currency + num.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * 字符串截断过滤器
 * @param {string} value - 字符串
 * @param {number} length - 最大长度
 * @param {string} suffix - 后缀
 * @returns {string} - 截断后的字符串
 */
export function truncate(value, length = 20, suffix = '...') {
  if (!value) return '';
  
  if (value.length <= length) return value;
  
  return value.substring(0, length) + suffix;
}

/**
 * 状态格式化过滤器
 * @param {number|boolean} value - 状态值
 * @param {Array} options - 状态选项
 * @returns {string} - 格式化后的状态文本
 */
export function statusFormat(value, options = [
  { value: 1, label: '启用' },
  { value: 0, label: '禁用' }
]) {
  const option = options.find(opt => opt.value === value);
  return option ? option.label : '';
}

/**
 * 角色格式化过滤器
 * @param {string} value - 角色值
 * @returns {string} - 格式化后的角色文本
 */
export function roleFormat(value) {
  const roles = {
    'ADMIN': '管理员',
    'USER': '普通用户'
  };
  
  return roles[value] || value;
}
