// src/store/modules/auth.js
// 认证状态管理

import { login, getCurrentUser, changePassword } from '@/api/auth';
// 定义本地存储键名
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

// 定义用户角色
const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

const state = {
  token: '',
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
  loading: false
};

const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  token: state => state.token,
  isAdmin: state => state.user && state.user.role === USER_ROLES.ADMIN,
  loading: state => state.loading
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER: (state, user) => {
    state.user = user;
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading;
  },
  UPDATE_USER_INFO: (state, userInfo) => {
    state.user = { ...state.user, ...userInfo };
  }
};

const actions = {
  // 用户登录
  async login({ commit }, { username, password }) {
    commit('SET_LOADING', true);
    try {
      const response = await login(username, password);
      // 从返回数据中提取 token 和 userInfo
      const { token, userInfo } = response.data.data;

      commit('SET_TOKEN', token);
      commit('SET_USER', userInfo);

      // 存储token时添加过期时间（24小时后过期）
      const tokenData = {
        value: token,
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24小时后过期
      };

      localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(tokenData));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));

      return userInfo;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 检查token是否有效
  checkToken({ commit, dispatch }) {
    try {
      const tokenData = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOKEN));

      // 如果没有token数据或者token已过期，则清除登录状态
      if (!tokenData || Date.now() > tokenData.expires) {
        dispatch('logout');
        return false;
      }

      // 更新store中的token
      commit('SET_TOKEN', tokenData.value);
      return true;
    } catch (error) {
      console.error('Token检查失败:', error);
      dispatch('logout');
      return false;
    }
  },

  // 获取当前用户信息
  async getCurrentUser({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await getCurrentUser();
      const userInfo = response.data.data;

      commit('SET_USER', userInfo);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));

      return userInfo;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 修改密码
  async changePassword({ commit }, passwordData) {
    commit('SET_LOADING', true);
    try {
      await changePassword(passwordData);
      return true;
    } catch (error) {
      console.error('修改密码失败:', error);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // 更新用户信息
  updateUserInfo({ commit }, userInfo) {
    commit('UPDATE_USER_INFO', userInfo);
    const user = { ...state.user, ...userInfo };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // 退出登录
  logout({ commit }) {
    commit('SET_TOKEN', '');
    commit('SET_USER', null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // 初始化认证状态
  initAuth({ dispatch }) {
    return dispatch('checkToken');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
