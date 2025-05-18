<template>
  <div class="login-container">
    <div class="login-content">
      <div class="brand-section">
        <h1 class="brand-title">饮食记录管理后台</h1>
        <p class="brand-subtitle">科学饮食，健康生活</p>
        
        <div class="features">
          <div class="feature-item">
            <i class="el-icon-dish"></i>
            <span>饮食记录</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-data-analysis"></i>
            <span>营养分析</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-light-rain"></i>
            <span>智能推荐</span>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">管理员登录</h2>
          
          <el-form :model="loginForm" :rules="rules" ref="loginForm" @submit.native.prevent>
            <el-form-item prop="username">
              <div class="custom-input">
                <i class="el-icon-user"></i>
                <el-input 
                  v-model="loginForm.username" 
                  placeholder="请输入管理员账号"
                  @keyup.enter.native="handleLogin">
                </el-input>
              </div>
            </el-form-item>
            
            <el-form-item prop="password">
              <div class="custom-input">
                <i class="el-icon-lock"></i>
                <el-input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="loginForm.password" 
                  placeholder="请输入密码"
                  @keyup.enter.native="handleLogin">
                  <i 
                    slot="suffix" 
                    :class="showPassword ? 'el-icon-view' : 'el-icon-hide'"
                    @click="showPassword = !showPassword"
                    class="password-toggle">
                  </i>
                </el-input>
              </div>
            </el-form-item>
            
            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
            
            <el-button 
              type="primary" 
              class="login-button" 
              :loading="loading" 
              @click="handleLogin">
              管理员登录
            </el-button>
            
            <div class="system-entry">
              <span>系统管理员专用入口</span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入管理员账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false,
      rememberMe: false,
      showPassword: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            await this.$store.dispatch('auth/login', {
              username: this.loginForm.username,
              password: this.loginForm.password,
              remember: this.rememberMe
            });
            
            // 登录成功后检查用户角色
            const isAdmin = this.$store.getters['auth/user']?.role === 'ADMIN';
            if (isAdmin) {
              // 是管理员，跳转到首页
              this.$router.push('/');
            } else {
              // 不是管理员，跳转到无权限页面
              this.$router.push('/unauthorized');
            }
          } catch (error) {
            this.$message.error('登录失败: ' + (error.response?.data?.message || error.message));
          } finally {
            this.loading = false;
          }
        }
      });
    }
  },
  mounted() {
    document.body.classList.add('login-page');
    document.documentElement.classList.add('login-page');
  },
  beforeDestroy() {
    document.body.classList.remove('login-page');
    document.documentElement.classList.remove('login-page');
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #2a9d5c;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.login-content {
  width: 1000px;
  min-height: 600px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  margin: 2rem;
}

.brand-section {
  flex: 2;
  background: #2a9d5c;
  padding: 3rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.brand-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.features {
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  font-size: 1.1rem;
}

.feature-item i {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.form-section {
  flex: 3;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  text-align: center;
  color: #333;
}

.custom-input {
  position: relative;
}

.custom-input i:first-child {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  color: #909399;
}

.custom-input .el-input >>> .el-input__inner {
  padding-left: 35px;
  height: 50px;
  border-radius: 8px;
}

.password-toggle {
  cursor: pointer;
  color: #909399;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 2rem;
}

.login-button {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  font-size: 1.1rem;
  background: #2a9d5c;
  border: none;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #238c4e;
}

.system-entry {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    width: 90%;
  }
  
  .brand-section {
    padding: 2rem;
  }
  
  .form-section {
    padding: 2rem;
  }
}
</style>

<style>
/* 只在登录页面应用overflow: hidden */
body.login-page, html.login-page {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

/* 保持基本的边距清除 */
body, html {
  margin: 0;
  padding: 0;
}
</style>
