<!-- src/views/Register.vue -->
<template>
  <div class="register-container">
    <div class="register-content">
      <div class="brand-section">
        <h1 class="brand-title">优智云平台</h1>
        <p class="brand-subtitle">加入我们，开启智能办公新时代</p>
        <div class="features">
          <div class="feature-item">
            <i class="el-icon-data-analysis"></i>
            <span>数据分析</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-connection"></i>
            <span>团队协作</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-mobile"></i>
            <span>移动办公</span>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">账号注册</h2>
          
          <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="0">
            <el-form-item prop="username">
              <div class="custom-input">
                <i class="el-icon-user"></i>
                <el-input 
                  v-model="registerForm.username" 
                  placeholder="请输入用户名">
                </el-input>
              </div>
            </el-form-item>
            
            <el-form-item prop="email">
              <div class="custom-input">
                <i class="el-icon-message"></i>
                <el-input 
                  v-model="registerForm.email" 
                  placeholder="请输入邮箱">
                </el-input>
              </div>
            </el-form-item>
            
            <el-form-item prop="password">
              <div class="custom-input">
                <i class="el-icon-lock"></i>
                <el-input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="registerForm.password" 
                  placeholder="请输入密码">
                  <i 
                    slot="suffix" 
                    :class="showPassword ? 'el-icon-view' : 'el-icon-hide'"
                    @click="showPassword = !showPassword"
                    class="password-toggle">
                  </i>
                </el-input>
              </div>
            </el-form-item>
            
            <el-form-item prop="confirmPassword">
              <div class="custom-input">
                <i class="el-icon-lock"></i>
                <el-input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  v-model="registerForm.confirmPassword" 
                  placeholder="请确认密码">
                  <i 
                    slot="suffix" 
                    :class="showConfirmPassword ? 'el-icon-view' : 'el-icon-hide'"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="password-toggle">
                  </i>
                </el-input>
              </div>
            </el-form-item>
            
            <div class="agreement">
              <el-checkbox v-model="agreement">我已阅读并同意</el-checkbox>
              <el-link type="primary" :underline="false">《用户协议》</el-link>
              <span>和</span>
              <el-link type="primary" :underline="false">《隐私政策》</el-link>
            </div>
            
            <el-button 
              type="primary" 
              class="register-button" 
              :loading="loading" 
              :disabled="!agreement"
              @click="handleRegister">
              注 册
            </el-button>
            
            <div class="login-link">
              <span>已有账号？</span>
              <el-link type="primary" @click="$router.push('/login')">返回登录</el-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/auth';

export default {
  name: 'RegisterView',
  data() {
    // 密码验证一致性的校验规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER' // 默认角色
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      loading: false,
      agreement: false,
      showPassword: false,
      showConfirmPassword: false
    };
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            // 移除确认密码字段，后端不需要
            // eslint-disable-next-line
            const { confirmPassword, ...userData } = this.registerForm;
            
            await register(userData);
            
            this.$message.success('注册成功，请登录');
            this.$router.push('/login');
          } catch (error) {
            this.$message.error('注册失败: ' + (error.response?.data?.message || error.message));
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
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8E2DE2, #4A00E0);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-content {
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

.agreement {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 1rem 0 2rem;
  font-size: 0.9rem;
}

.agreement .el-link {
  margin: 0 4px;
}

.register-button {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  border: none;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.login-link {
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
  .register-content {
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