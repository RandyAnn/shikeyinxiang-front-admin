<template>
  <div class="footer">
    <div class="footer-content">
      <div class="copyright">
        &copy; {{ currentYear }} 饮食记录管理后台 版权所有
      </div>
      <div class="links">
        <a href="javascript:void(0)">关于我们</a>
        <a href="javascript:void(0)">使用帮助</a>
        <a href="javascript:void(0)">联系我们</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterView',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
.footer {
  height: 40px;
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
  padding: 0 20px;
}

.footer-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.copyright {
  font-size: 12px;
  color: #909399;
}

.links {
  display: flex;
}

.links a {
  font-size: 12px;
  color: #909399;
  margin-left: 15px;
  text-decoration: none;
}

.links a:hover {
  color: #15803D;
}
</style>
