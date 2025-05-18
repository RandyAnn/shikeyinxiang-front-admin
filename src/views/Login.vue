<template>
  <div class="login-container">
    <div class="login-content">
      <div class="brand-section">
        <h1 class="brand-title">优智云平台</h1>
        <p class="brand-subtitle">智能办公，从这里开始</p>
        <div class="features">
          <div class="feature-item">
            <i class="el-icon-success"></i>
            <span>安全可靠</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-lightning"></i>
            <span>高效便捷</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-cloudy"></i>
            <span>云端协作</span>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">欢迎登录</h2>
          
          <el-form :model="loginForm" :rules="rules" ref="loginForm" @submit.native.prevent>
            <el-form-item prop="username">
              <div class="custom-input">
                <i class="el-icon-user"></i>
                <el-input 
                  v-model="loginForm.username" 
                  placeholder="请输入用户名"
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
              登 录
            </el-button>
            
            <div class="register-link">
              <span>还没有账号？</span>
              <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
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
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6个字符', trigger: 'blur' }
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
            this.$router.push('/');
          } catch (error) {
            this.$message.error('登录失败: ' + (error.response?.data?.message || error.message));
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8E2DE2, #4A00E0);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-content {
  width: 1000px;
  min-height: 600px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  animation: fadeIn 0.6s ease-out;
}

.brand-section {
  flex: 2;
  background: linear-gradient(135deg, #9333EA, #7C3AED);
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
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  border: none;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
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
