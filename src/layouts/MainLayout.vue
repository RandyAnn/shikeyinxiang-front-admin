<template>
  <div class="app-container" :class="{ 'sidebar-collapsed': isCollapsed }">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="page-container">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/common/Header.vue';
import Sidebar from '@/components/common/Sidebar.vue';
import Footer from '@/components/common/Footer.vue';

export default {
  name: 'MainLayout',
  components: {
    Header,
    Sidebar,
    Footer
  },
  computed: {
    ...mapGetters({
      sidebar: 'app/sidebar'
    }),

    isCollapsed() {
      return !this.sidebar.opened;
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.3s;
  position: relative;
}

.sidebar-collapsed .main-content {
  margin-left: 64px;
}

.page-container {
  padding: 20px;
  margin-top: 60px;
  min-height: calc(100vh - 120px); /* 减去头部和底部的高度 */
}

/* 路由切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>