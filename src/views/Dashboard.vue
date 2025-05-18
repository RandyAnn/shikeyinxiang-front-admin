<template>
  <el-container class="dashboard-container">
    <el-aside width="220px" class="aside-menu">
      <div class="logo-container">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
        <h3>管理系统</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
        unique-opened
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        
        <el-menu-item index="/users" v-if="isAdmin">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/profile">
            <i class="el-icon-user-solid"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <i class="el-icon-s-tools"></i>
            <span>系统配置</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="main-header">
        <div class="header-left">
          <i class="el-icon-s-fold toggle-sidebar"></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <span class="user-dropdown">
              <el-avatar size="small" icon="el-icon-user"></el-avatar>
              <span class="username">{{ user.username }}</span>
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user">个人中心</el-dropdown-item>
              <el-dropdown-item icon="el-icon-setting">账号设置</el-dropdown-item>
              <el-dropdown-item divided icon="el-icon-switch-button" @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view />
      </el-main>
      
      <el-footer class="main-footer">
        © 2025 管理系统 - 版权所有
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'DashboardView',
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    isAdmin() {
      return this.user && this.user.role === 'ADMIN';
    },
    activeMenu() {
      return this.$route.path;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.aside-menu {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b3649;
  color: #fff;
  padding: 0 10px;
}

.logo {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.el-menu-vertical {
  border-right: none;
}

.main-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px !important;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-sidebar {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 5px;
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

.main-footer {
  text-align: center;
  color: #606266;
  font-size: 14px;
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
  height: 50px !important;
  line-height: 20px;
}
</style>
