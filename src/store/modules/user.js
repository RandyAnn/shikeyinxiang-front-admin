// src/store/modules/user.js
// 用户管理状态

import { getUserList, updateUserStatus, addUser, updateUser, deleteUser } from '@/api/user';

const state = {
  userList: [],
  total: 0,
  loading: false,
  currentPage: 1,
  pageSize: 10
};

const getters = {
  userList: state => state.userList,
  total: state => state.total,
  loading: state => state.loading,
  pagination: state => ({
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    total: state.total
  })
};

const mutations = {
  SET_USER_LIST: (state, users) => {
    state.userList = users;
  },
  SET_TOTAL: (state, total) => {
    state.total = total;
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading;
  },
  SET_CURRENT_PAGE: (state, page) => {
    state.currentPage = page;
  },
  SET_PAGE_SIZE: (state, size) => {
    state.pageSize = size;
  },
  UPDATE_USER_STATUS: (state, { userId, status }) => {
    const user = state.userList.find(u => u.id === userId);
    if (user) {
      user.status = status;
    }
  }
};

const actions = {
  // 获取用户列表
  async fetchUserList({ commit, state }, params = {}) {
    commit('SET_LOADING', true);
    try {
      const queryParams = {
        page: params.page || state.currentPage,
        size: params.size || state.pageSize,
        ...params
      };
      
      const response = await getUserList(queryParams);
      const { list, total } = response.data.data;
      
      commit('SET_USER_LIST', list);
      commit('SET_TOTAL', total);
      commit('SET_CURRENT_PAGE', queryParams.page);
      commit('SET_PAGE_SIZE', queryParams.size);
      
      return { list, total };
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // 更新用户状态
  async updateUserStatus({ commit }, { userId, status }) {
    try {
      await updateUserStatus(userId, status);
      commit('UPDATE_USER_STATUS', { userId, status });
      return true;
    } catch (error) {
      console.error('更新用户状态失败:', error);
      throw error;
    }
  },
  
  // 添加用户
  async addUser({ dispatch }, userData) {
    try {
      await addUser(userData);
      // 刷新用户列表
      await dispatch('fetchUserList');
      return true;
    } catch (error) {
      console.error('添加用户失败:', error);
      throw error;
    }
  },
  
  // 更新用户
  async updateUser({ dispatch }, { userId, userData }) {
    try {
      await updateUser(userId, userData);
      // 刷新用户列表
      await dispatch('fetchUserList');
      return true;
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  },
  
  // 删除用户
  async deleteUser({ dispatch }, userId) {
    try {
      await deleteUser(userId);
      // 刷新用户列表
      await dispatch('fetchUserList');
      return true;
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
