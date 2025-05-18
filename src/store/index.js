// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import app from './modules/app';
import user from './modules/user';
import dashboard from './modules/dashboard';
import food from './modules/food';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    app,
    user,
    dashboard,
    food
  }
});
