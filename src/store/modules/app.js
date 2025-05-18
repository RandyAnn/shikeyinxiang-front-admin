// src/store/modules/app.js
// 应用全局状态管理

const state = {
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  settings: {
    theme: 'light',
    showBreadcrumb: true,
    fixedHeader: true
  }
};

const getters = {
  sidebar: state => state.sidebar,
  device: state => state.device,
  settings: state => state.settings
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  UPDATE_SETTINGS: (state, settings) => {
    state.settings = { ...state.settings, ...settings };
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  updateSettings({ commit }, settings) {
    commit('UPDATE_SETTINGS', settings);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
