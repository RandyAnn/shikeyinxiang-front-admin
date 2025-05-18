// src/utils/permission.js
// 权限控制相关函数

import { USER_ROLES } from '@/config';

/**
 * 检查用户是否有指定权限
 * @param {Object} user - 用户对象
 * @param {string|Array} permission - 权限或权限数组
 * @returns {boolean} - 是否有权限
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  // 管理员拥有所有权限
  if (user.role === USER_ROLES.ADMIN) {
    return true;
  }
  
  // 如果是数组，检查是否有任一权限
  if (Array.isArray(permission)) {
    return permission.some(p => user.permissions && user.permissions.includes(p));
  }
  
  // 单个权限检查
  return user.permissions && user.permissions.includes(permission);
};

/**
 * 检查用户是否是管理员
 * @param {Object} user - 用户对象
 * @returns {boolean} - 是否是管理员
 */
export const isAdmin = (user) => {
  return user && user.role === USER_ROLES.ADMIN;
};

/**
 * 过滤用户有权限访问的路由
 * @param {Array} routes - 路由数组
 * @param {Object} user - 用户对象
 * @returns {Array} - 过滤后的路由数组
 */
export const filterAuthorizedRoutes = (routes, user) => {
  return routes.filter(route => {
    // 不需要权限的路由
    if (!route.meta || !route.meta.permissions) {
      return true;
    }
    
    // 检查权限
    const hasAuth = hasPermission(user, route.meta.permissions);
    
    // 递归处理子路由
    if (hasAuth && route.children) {
      route.children = filterAuthorizedRoutes(route.children, user);
    }
    
    return hasAuth;
  });
};
