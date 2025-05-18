// src/api/index.js
// API 请求的统一出口

import * as auth from './auth';
import * as user from './user';
import * as common from './common';
import * as food from './food';

export {
  auth,
  user,
  common,
  food
};
