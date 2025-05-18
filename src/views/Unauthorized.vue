<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="unauthorized-container">
    <!-- 背景动画元素 -->
    <div class="animated-bg">
      <div v-for="n in 10" :key="n" class="animated-circle" :style="randomPosition()"></div>
    </div>
    
    <div class="unauthorized-content">
      <div class="icon-container">
        <div class="lock-body"></div>
        <div class="lock-hook"></div>
      </div>
      
      <h1 class="title">无权限访问</h1>
      <p class="message">抱歉，您没有管理员权限，无法访问系统管理后台</p>
      
      <div class="action-container">
        <el-button type="primary" @click="logout" class="logout-button">
          <i class="el-icon-back mr-5"></i>
          返回登录
        </el-button>
      </div>
      
      <div class="error-code-container">
        <span class="error-digit">4</span>
        <span class="error-digit">0</span>
        <span class="error-digit">3</span>
      </div>
      
      <div class="footer">
        <div class="footer-content">
          <p class="help-text">如需帮助，请联系系统管理员</p>
          <p class="copyright">© 2025 饮食记录管理后台. 保留所有权利.</p>
        </div>
      </div>
    </div>
    
    <div class="date-display">
      <span>{{ currentDate }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "UnauthorizedView",
  data() {
    return {
      currentDate: new Date().toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
    randomPosition() {
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`,
        opacity: Math.random() * 0.5 + 0.1,
        transform: `scale(${Math.random() * 0.8 + 0.2})`
      };
    }
  },
  mounted() {
    document.body.classList.add("unauthorized-page");
    document.documentElement.classList.add("unauthorized-page");
  },
  beforeDestroy() {
    document.body.classList.remove("unauthorized-page");
    document.documentElement.classList.remove("unauthorized-page");
  },
};
</script>

<style scoped>
.unauthorized-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2a9d5c, #1a6b3e);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow: hidden;
}

/* 背景动画 */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.animated-circle {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 10s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-50px) translateX(50px) rotate(90deg);
  }
  50% {
    transform: translateY(-20px) translateX(-30px) rotate(180deg);
  }
  75% {
    transform: translateY(40px) translateX(20px) rotate(270deg);
  }
}

.unauthorized-content {
  max-width: 500px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-out, float-content 6s infinite ease-in-out;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes float-content {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 锁图标动画 */
.icon-container {
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 auto 2rem;
}

.lock-body {
  width: 60px;
  height: 45px;
  background-color: #f56c6c;
  border-radius: 8px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 5px 15px rgba(245, 108, 108, 0.4);
  animation: pulse 2s infinite;
}

.lock-hook {
  width: 30px;
  height: 35px;
  border: 10px solid #f56c6c;
  border-bottom: none;
  border-radius: 30px 30px 0 0;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 -5px 15px rgba(245, 108, 108, 0.2);
  animation: shake 3s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.05);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(-50%) rotate(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-52%) rotate(-2deg);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(-48%) rotate(2deg);
  }
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message {
  font-size: 16px;
  color: #606266;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.action-container {
  margin-bottom: 2rem;
}

.logout-button {
  background-color: #2a9d5c;
  border-color: #2a9d5c;
  padding: 12px 30px;
  font-size: 16px;
  transition: all 0.3s;
  border-radius: 50px;
  box-shadow: 0 5px 15px rgba(42, 157, 92, 0.3);
}

.logout-button:hover {
  background-color: #238c4e;
  border-color: #238c4e;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(42, 157, 92, 0.4);
}

.logout-button:active {
  transform: translateY(-1px);
}

.mr-5 {
  margin-right: 5px;
}

/* 错误代码动画 */
.error-code-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.error-digit {
  font-size: 40px;
  font-weight: bold;
  color: #f56c6c;
  margin: 0 5px;
  text-shadow: 0 2px 10px rgba(245, 108, 108, 0.3);
  animation: bounce 2s infinite;
}

.error-digit:nth-child(1) {
  animation-delay: 0s;
}

.error-digit:nth-child(2) {
  animation-delay: 0.2s;
}

.error-digit:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.footer {
  margin-top: 2rem;
  border-top: 1px solid rgba(235, 238, 245, 0.5);
  padding-top: 1.5rem;
}

.footer-content {
  color: #909399;
}

.help-text {
  margin-bottom: 1rem;
}

.copyright {
  font-size: 12px;
  margin-top: 1rem;
  opacity: 0.7;
}

.date-display {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: white;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 15px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style>
body.unauthorized-page, html.unauthorized-page {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
