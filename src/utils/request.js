// src/utils/request.js
// HTTP 请求拦截器和错误处理

import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { ROUTE_CONFIG } from '@/config';
import { Message } from 'element-ui';

// 创建 axios 实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 store 获取 token
    const token = store.getters['auth/token'];

    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 如果响应成功，直接返回数据
    return response;
  },
  error => {
    if (!error.response) {
      // 网络错误
      Message.error('网络错误，请检查您的网络连接');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 根据状态码处理不同的错误
    switch (status) {
      case 400:
        Message.error(data.message || '请求参数错误');
        break;

      case 401:
        // 未授权，清除用户信息并跳转到登录页
        Message.error('登录已过期，请重新登录');
        store.dispatch('auth/logout');
        router.push(ROUTE_CONFIG.LOGIN);
        break;

      case 403:
        // 所有403错误都视为token过期或权限问题
        Message.error('登录已过期或您没有权限，请重新登录');
        store.dispatch('auth/logout');
        router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } });
        break;

      case 404:
        Message.error('请求的资源不存在');
        break;

      case 500:
        Message.error('服务器错误，请稍后再试');
        break;

      default:
        Message.error(data.message || '未知错误');
    }

    return Promise.reject(error);
  }
);

export default service;
