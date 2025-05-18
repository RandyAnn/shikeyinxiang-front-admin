// src/utils/index.js
// 工具函数集合

import { parseTime } from './date';
import { downloadExcel } from './excel';

// 导出其他模块的函数
export { parseTime, downloadExcel };

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
 * @param {string} format - 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} - 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} - 拷贝后的新对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }

  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }

  return obj;
};

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 防抖处理后的函数
 */
export const debounce = (fn, delay) => {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {number} interval - 间隔时间，单位毫秒
 * @returns {Function} - 节流处理后的函数
 */
export const throttle = (fn, interval) => {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
};

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} - 参数值
 */
export const getUrlParam = (name) => {
  const url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * 检查对象是否为空
 * @param {Object} obj - 要检查的对象
 * @returns {boolean} - 是否为空对象
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * 将对象转换为查询字符串
 * @param {Object} params - 参数对象
 * @returns {string} - 查询字符串
 */
export const objectToQueryString = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};
