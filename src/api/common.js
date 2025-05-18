// src/api/common.js
// 通用 API 请求

import request from '@/utils/request';

// 获取系统日志
export const getSystemLogs = (params) => {
  return request({
    url: '/api/admin/system/logs',
    method: 'get',
    params
  });
};


