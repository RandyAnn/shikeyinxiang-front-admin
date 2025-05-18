<template>
  <div class="header" :class="{ 'is-collapsed': isCollapsed }">
    <div class="left-section">
      <i
        :class="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        class="toggle-icon"
        @click="toggleSideBar"></i>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="right-section">
      <el-input
        placeholder="搜索..."
        prefix-icon="el-icon-search"
        size="small"
        v-model="searchQuery"
        @keyup.enter.native="handleSearch"
        class="search-input">
      </el-input>

      <el-tooltip content="全屏" placement="bottom" effect="light">
        <div class="header-icon" @click="toggleFullScreen">
          <i :class="isFullscreen ? 'el-icon-close' : 'el-icon-full-screen'"></i>
        </div>
      </el-tooltip>

      <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
        <el-popover
          placement="bottom"
          width="300"
          trigger="click"
          popper-class="notification-popover">
          <div class="notification-header">
            <span>通知</span>
            <el-button type="text" size="mini" @click="clearNotifications">清空</el-button>
          </div>
          <div class="notification-content">
            <div v-if="notifications.length === 0" class="empty-notifications">
              暂无通知
            </div>
            <div v-else class="notification-list">
              <div
                v-for="(item, index) in notifications"
                :key="index"
                class="notification-item"
                :class="{ 'is-read': item.isRead }">
                <div class="notification-icon">
                  <i :class="getNotificationIcon(item.type)"></i>
                </div>
                <div class="notification-info">
                  <div class="notification-title">{{ item.title }}</div>
                  <div class="notification-time">{{ item.time | dateFormat }}</div>
                </div>
              </div>
            </div>
          </div>
          <div slot="reference" class="header-icon">
            <i class="el-icon-bell"></i>
          </div>
        </el-popover>
      </el-badge>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <div class="avatar">{{ userInitials }}</div>
          <span class="username">{{ user.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <i class="el-icon-user"></i> 个人信息
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <i class="el-icon-setting"></i> 系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <i class="el-icon-switch-button"></i> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HeaderView',
  data() {
    return {
      searchQuery: '',
      isFullscreen: false,
      notifications: [
        {
          id: 1,
          title: '系统更新通知',
          content: '系统将于今晚22:00-23:00进行例行维护更新',
          time: new Date(),
          type: 'system',
          isRead: false
        },
        {
          id: 2,
          title: '新用户注册',
          content: '新用户张三已注册成功',
          time: new Date(Date.now() - 3600000),
          type: 'user',
          isRead: true
        },
        {
          id: 3,
          title: '数据备份完成',
          content: '系统数据备份已完成',
          time: new Date(Date.now() - 86400000),
          type: 'success',
          isRead: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      sidebar: 'app/sidebar',
      user: 'auth/user'
    }),

    isCollapsed() {
      return !this.sidebar.opened;
    },

    // 获取用户名首字母作为头像
    userInitials() {
      if (!this.user || !this.user.username) return '';
      return this.user.username.charAt(0).toUpperCase();
    },

    // 获取未读通知数量
    notificationCount() {
      return this.notifications.filter(item => !item.isRead).length;
    },

    // 获取面包屑导航
    breadcrumbs() {
      const { matched } = this.$route;
      return matched
        .filter(item => item.meta && item.meta.title && item.path !== '/')
        .map(item => ({
          path: item.path,
          title: item.meta.title
        }));
    }
  },
  methods: {
    ...mapActions({
      toggleSideBar: 'app/toggleSideBar'
    }),

    // 处理下拉菜单命令
    handleCommand(command) {
      if (command === 'logout') {
        this.logout();
      } else if (command === 'profile') {
        this.$router.push('/profile');
      } else if (command === 'settings') {
        this.$router.push('/settings');
      }
    },

    // 退出登录
    logout() {
      // 显示确认对话框
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户确认退出
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');
        this.$message({
          type: 'success',
          message: '已安全退出系统'
        });
      }).catch(() => {
        // 用户取消退出
      });
    },

    // 切换全屏
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.isFullscreen = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          this.isFullscreen = false;
        }
      }
    },

    // 处理搜索
    handleSearch() {
      if (!this.searchQuery.trim()) return;

      // 这里可以实现全局搜索功能
      this.$message.info(`搜索: ${this.searchQuery}`);
      this.searchQuery = '';
    },

    // 清空通知
    clearNotifications() {
      this.notifications = [];
    },

    // 获取通知图标
    getNotificationIcon(type) {
      const icons = {
        system: 'el-icon-info',
        user: 'el-icon-user',
        success: 'el-icon-success',
        warning: 'el-icon-warning',
        error: 'el-icon-error'
      };

      return icons[type] || 'el-icon-message';
    }
  }
}
</script>

<style scoped>
.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  top: 0;
  right: 0;
  left: 240px;
  z-index: 999;
  transition: left 0.3s;
}

.header.is-collapsed {
  left: 64px;
}

.left-section {
  display: flex;
  align-items: center;
}

.toggle-icon {
  font-size: 20px;
  color: #909399;
  margin-right: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.toggle-icon:hover {
  color: #15803D;
}

.right-section {
  display: flex;
  align-items: center;
}

.search-input {
  width: 200px;
  margin-right: 20px;
}

.header-icon {
  font-size: 18px;
  color: #606266;
  margin-right: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.header-icon:hover {
  color: #15803D;
}

.notification-badge {
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #2a9d5c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 14px;
}

.username {
  font-size: 14px;
  color: #606266;
}

/* 通知弹窗样式 */
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 10px;
}

.notification-content {
  max-height: 300px;
  overflow-y: auto;
}

.empty-notifications {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}

.notification-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-item.is-read {
  opacity: 0.6;
}

.notification-icon {
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #15803D;
}

.notification-info {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  margin-bottom: 5px;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}
</style>

<style>
/* 全局样式，修改通知弹窗样式 */
.notification-popover {
  padding: 10px;
}
</style>