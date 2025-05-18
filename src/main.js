// src/main.js
// 应用入口文件

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './utils/request'; // 导入请求拦截器
import * as filters from './utils/filters'; // 导入全局过滤器
import './assets/styles/global.scss'; // 导入全局样式

// 配置 ElementUI
Vue.use(ElementUI, {
  size: 'medium' // 设置组件默认尺寸
});

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// 关闭生产环境提示
Vue.config.productionTip = false;

// 全局错误处理
Vue.config.errorHandler = (err, _vm, info) => {
  console.error('Vue 错误:', err);
  console.error('错误信息:', info);
};

// 初始化认证状态
store.dispatch('auth/initAuth').then(() => {
  // 创建 Vue 实例
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
});
