// src/config/index.js
// 集中管理项目配置

// API 基础URL
export const API_URL = process.env.VUE_APP_API_URL;

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

// 路由相关配置
export const ROUTE_CONFIG = {
  HOME: '/',
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized'
};

// 用户角色
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

// 分页默认配置
export const PAGINATION_CONFIG = {
  PAGE_SIZES: [10, 20, 30, 50],
  DEFAULT_PAGE_SIZE: 10
};

// 系统主题颜色
export const THEME_COLORS = {
  PRIMARY: '#2a9d5c',
  SUCCESS: '#67C23A',
  WARNING: '#E6A23C',
  DANGER: '#F56C6C',
  INFO: '#909399'
};
