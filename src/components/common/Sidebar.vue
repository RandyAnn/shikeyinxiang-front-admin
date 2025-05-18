<template>
  <div class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <div class="logo-container">
      <h1 class="logo-title">{{ isCollapsed ? '饮食' : '饮食记录管理后台' }}</h1>
      <p class="logo-subtitle" v-if="!isCollapsed">科学饮食，健康生活</p>
    </div>

    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isCollapsed"
      background-color="#fff"
      text-color="#606266"
      active-text-color="#15803D"
      :router="true">

      <template v-for="route in routes">
        <!-- 没有子路由的菜单项 -->
        <el-menu-item
          v-if="!route.children && !route.meta?.hidden"
          :key="route.path"
          :index="'/' + route.path"
          :route="route">
          <i :class="route.meta?.icon || 'el-icon-document'"></i>
          <span slot="title">{{ route.meta?.title }}</span>
        </el-menu-item>

        <!-- 有子路由的菜单项 -->
        <el-submenu
          v-else-if="route.children && !route.meta?.hidden"
          :key="route.path"
          :index="'/' + route.path">
          <template slot="title">
            <i :class="route.meta?.icon || 'el-icon-folder'"></i>
            <span>{{ route.meta?.title }}</span>
          </template>

          <!-- 子菜单项 -->
          <el-menu-item
            v-for="child in route.children.filter(item => !item.meta?.hidden)"
            :key="child.path"
            :index="'/' + route.path + '/' + child.path">
            <i :class="child.meta?.icon || 'el-icon-document'"></i>
            <span>{{ child.meta?.title }}</span>
          </el-menu-item>
        </el-submenu>
      </template>

      <!-- 这里不需要硬编码菜单项，因为已经通过路由配置自动生成了 -->
    </el-menu>

    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="toggleCollapse">
      <i :class="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SidebarView',
  data() {
    return {
      routes: []
    }
  },
  computed: {
    ...mapGetters({
      sidebar: 'app/sidebar',
      user: 'auth/user'
    }),

    isCollapsed() {
      return !this.sidebar.opened;
    },

    activeMenu() {
      const { meta, path } = this.$route;
      // 如果设置了activeMenu，则使用activeMenu
      if (meta && meta.activeMenu) {
        return meta.activeMenu;
      }
      // 确保路径始终以/开头
      return path.startsWith('/') ? path : '/' + path;
    }
  },
  created() {
    // 获取路由配置
    this.getRoutes();
  },
  methods: {
    ...mapActions({
      toggleSideBar: 'app/toggleSideBar'
    }),

    // 获取路由配置
    getRoutes() {
      // 从路由配置中获取主布局下的路由
      const mainRoutes = this.$router.options.routes.find(route => route.path === '/');
      if (mainRoutes && mainRoutes.children) {
        this.routes = mainRoutes.children;
      }
    },

    // 切换侧边栏折叠状态
    toggleCollapse() {
      this.toggleSideBar();
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: width 0.3s;
}

.sidebar.is-collapsed {
  width: 64px;
}

.logo-container {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  text-align: center;
  height: 80px; /* 增加高度 */
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.3s;
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  color: #15803D;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.sidebar-menu {
  border-right: none;
  height: calc(100% - 80px - 40px); /* 减去顶部logo高度(80px)和底部折叠按钮高度(40px) */
  overflow-y: auto;
  padding-bottom: 50px; /* 为底部折叠按钮留出空间 */
}

.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 3px;
}

.collapse-btn {
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 64px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #606266;
  font-size: 20px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  color: #15803D;
}
</style>