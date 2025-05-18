// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { ROUTE_CONFIG } from '@/config';
import { isAdmin } from '@/utils/permission';

// 布局
import MainLayout from '@/layouts/MainLayout.vue';

// 公共页面
import Login from '@/views/Login.vue';
import Unauthorized from '@/views/Unauthorized.vue';

// 使用懒加载优化性能
const Dashboard = () => import('@/views/Dashboard.vue');
const UserList = () => import('@/views/user/UserList.vue');
const Profile = () => import('@/views/Profile.vue');
const FoodList = () => import('@/views/food/FoodList.vue');
const FoodCategory = () => import('@/views/food/FoodCategory.vue');
const DietRecordList = () => import('@/views/diet-record/DietRecordList.vue');

Vue.use(VueRouter);

/**
 * 路由配置
 * meta 属性说明:
 * - title: 页面标题，用于面包屑和标签页
 * - icon: 图标，用于菜单和标签页
 * - requiresAuth: 是否需要登录才能访问
 * - requiresAdmin: 是否需要管理员权限才能访问
 * - permissions: 访问该路由需要的权限，数组形式
 * - activeMenu: 当前路由激活的菜单项，用于菜单高亮
 */
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
    meta: {
      title: '无权限访问',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '数据概览',
          icon: 'el-icon-data-line',
          requiresAdmin: true
        }
      },
      {
        path: 'user',
        name: 'UserManagement',
        component: { render: h => h('router-view') },
        redirect: '/user/list',
        meta: {
          title: '用户管理',
          icon: 'el-icon-user',
          requiresAdmin: true
        },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: UserList,
            meta: {
              title: '用户列表',
              icon: 'el-icon-document',
              requiresAdmin: true,
              activeMenu: '/user'
            }
          }
        ]
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          title: '个人信息',
          icon: 'el-icon-user',
          requiresAuth: true,
          hidden: true // 不在菜单中显示
        }
      },

      // 食物管理
      {
        path: 'food',
        name: 'FoodManagement',
        component: { render: h => h('router-view') },
        redirect: '/food/list',
        meta: {
          title: '食物管理',
          icon: 'el-icon-dish',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'FoodList',
            component: FoodList,
            meta: {
              title: '食物列表',
              icon: 'el-icon-document',
              requiresAuth: true,
              activeMenu: '/food'
            }
          },
          {
            path: 'category',
            name: 'FoodCategory',
            component: FoodCategory,
            meta: {
              title: '分类管理',
              icon: 'el-icon-folder',
              requiresAuth: true,
              activeMenu: '/food'
            }
          }
        ]
      },
      // 饮食记录
      {
        path: 'record',
        name: 'RecordManagement',
        component: { render: h => h('router-view') },
        redirect: '/record/list',
        meta: {
          title: '饮食记录',
          icon: 'el-icon-notebook-2',
          requiresAuth: true
        },
        children: [
          {
            path: 'list',
            name: 'RecordList',
            component: DietRecordList,
            meta: {
              title: '记录列表',
              icon: 'el-icon-document',
              requiresAuth: true,
              activeMenu: '/record'
            }
          },
          {
            path: 'analysis',
            name: 'RecordAnalysis',
            component: { render: h => h('div', '记录分析（开发中）') },
            meta: {
              title: '记录分析',
              icon: 'el-icon-data-analysis',
              requiresAuth: true,
              activeMenu: '/record'
            }
          }
        ]
      },
      // 营养分析
      {
        path: 'nutrition',
        name: 'NutritionAnalysis',
        component: { render: h => h('router-view') },
        redirect: '/nutrition/report',
        meta: {
          title: '营养分析',
          icon: 'el-icon-pie-chart',
          requiresAuth: true
        },
        children: [
          {
            path: 'report',
            name: 'NutritionReport',
            component: { render: h => h('div', '营养报告（开发中）') },
            meta: {
              title: '营养报告',
              icon: 'el-icon-document',
              requiresAuth: true,
              activeMenu: '/nutrition'
            }
          },
          {
            path: 'trend',
            name: 'NutritionTrend',
            component: { render: h => h('div', '趋势分析（开发中）') },
            meta: {
              title: '趋势分析',
              icon: 'el-icon-trend-charts',
              requiresAuth: true,
              activeMenu: '/nutrition'
            }
          },
          {
            path: 'advice',
            name: 'NutritionAdvice',
            component: () => import('@/views/nutrition/AdviceList.vue'),
            meta: {
              title: '营养建议',
              icon: 'el-icon-s-opportunity',
              requiresAuth: true,
              activeMenu: '/nutrition'
            }
          }
        ]
      },
      // 智能推荐
      {
        path: 'recommend',
        name: 'RecommendManagement',
        component: { render: h => h('router-view') },
        redirect: '/recommend/rule',
        meta: {
          title: '智能推荐',
          icon: 'el-icon-magic-stick',
          requiresAuth: true
        },
        children: [
          {
            path: 'rule',
            name: 'RecommendRule',
            component: { render: h => h('div', '推荐规则（开发中）') },
            meta: {
              title: '推荐规则',
              icon: 'el-icon-set-up',
              requiresAuth: true,
              activeMenu: '/recommend'
            }
          },
          {
            path: 'log',
            name: 'RecommendLog',
            component: { render: h => h('div', '推荐记录（开发中）') },
            meta: {
              title: '推荐记录',
              icon: 'el-icon-document',
              requiresAuth: true,
              activeMenu: '/recommend'
            }
          }
        ]
      }
    ]
  },
  // 404 页面
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404',
      requiresAuth: false,
      hidden: true
    }
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes
});

/**
 * 全局前置守卫
 * 处理路由权限控制
 */
router.beforeEach((to, _from, next) => {
  // 获取认证状态和用户角色
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const user = store.getters['auth/user'];

  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - 饮食记录管理后台`;
  }

  // 不需要认证的页面直接放行
  if (to.matched.some(record => record.meta.requiresAuth === false)) {
    // 已登录用户访问登录页，重定向到首页
    if (isAuthenticated && to.path === ROUTE_CONFIG.LOGIN) {
      return next(ROUTE_CONFIG.HOME);
    }
    return next();
  }

  // 需要认证但未登录，重定向到登录页
  if (!isAuthenticated) {
    return next({
      path: ROUTE_CONFIG.LOGIN,
      query: { redirect: to.fullPath }
    });
  }

  // 需要管理员权限的页面
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!isAdmin(user)) {
      return next(ROUTE_CONFIG.UNAUTHORIZED);
    }
  }

  // 其他情况放行
  next();
});

export default router;
