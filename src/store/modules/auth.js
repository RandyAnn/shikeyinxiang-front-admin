// src/store/modules/auth.js
import { login } from '@/api/auth';

const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null
};

const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user
};

const actions = {
  async login({ commit }, { username, password }) {
    const response = await login(username, password);
    const { token, username: user, role } = response.data.data;

    commit('setToken', token);
    commit('setUser', { username: user, role });

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ username: user, role }));
  },
  
  logout({ commit }) {
    commit('setToken', '');
    commit('setUser', null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  setUser(state, user) {
    state.user = user;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};