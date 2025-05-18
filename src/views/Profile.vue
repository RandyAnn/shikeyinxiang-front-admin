<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="profile-card">
          <div class="profile-header">
            <el-avatar :size="100" icon="el-icon-user-solid" class="profile-avatar"></el-avatar>
            <h3 class="profile-name">{{ user.username }}</h3>
            <p class="profile-role">
              <el-tag :type="user.role === 'ADMIN' ? 'danger' : 'success'" effect="dark">
                {{ user.role === 'ADMIN' ? '管理员' : '普通用户' }}
              </el-tag>
            </p>
          </div>
          <div class="profile-info">
            <div class="info-item">
              <i class="el-icon-message"></i>
              <span>{{ user.email || '未设置邮箱' }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card shadow="hover" class="security-card">
          <div slot="header">
            <span>安全设置</span>
          </div>
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">账户密码</div>
              <div class="security-desc">定期更改密码可以保护账户安全</div>
            </div>
            <el-button type="primary" plain size="small" @click="showChangePasswordDialog">修改</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="passwordDialogVisible" width="500px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword" :loading="passwordLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { changePassword } from '@/api/auth';

export default {
  name: 'ProfileView',
  data() {
    // 密码确认验证
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      user: {
        username: this.$store.getters['auth/user']?.username || '用户名',
        email: this.$store.getters['auth/user']?.email || '',
        role: this.$store.getters['auth/user']?.role || 'USER'
      },
      passwordDialogVisible: false,
      passwordLoading: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    showChangePasswordDialog() {
      this.passwordDialogVisible = true;
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    changePassword() {
      this.$refs.passwordForm.validate(async valid => {
        if (valid) {
          this.passwordLoading = true;
          try {
            // 使用API调用发送密码修改请求，只发送需要的字段
            const response = await changePassword({
              oldPassword: this.passwordForm.oldPassword,
              newPassword: this.passwordForm.newPassword
            });
            
            // 请求成功
            if (response.data.code === 200) {
              this.$message.success(response.data.message || '密码修改成功');
              this.passwordDialogVisible = false;
              
              // 延迟一秒后执行退出登录操作
              setTimeout(() => {
                // 调用store的logout方法清除登录状态
                this.$store.dispatch('auth/logout');
                // 跳转到登录页面
                this.$router.push('/login');
              }, 1000);
            } else {
              this.$message.error(response.data.message || '密码修改失败');
            }
          } catch (error) {
            console.error('修改密码失败:', error);
            this.$message.error(error.response?.data?.message || '密码修改失败，请重试');
          } finally {
            this.passwordLoading = false;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.profile-container {
  padding: 0;
}

.profile-card {
  text-align: center;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.profile-header {
  padding: 30px 0;
  background: linear-gradient(135deg, #2a9d5c, #67C23A);
  color: white;
}

.profile-avatar {
  background-color: white;
  color: #2a9d5c;
  font-size: 50px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-name {
  margin: 15px 0 10px;
  font-size: 20px;
  color: white;
}

.profile-role {
  margin: 0;
}

.profile-info {
  text-align: left;
  padding: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.info-item i {
  margin-right: 10px;
  font-size: 18px;
  color: #2a9d5c;
}

.profile-actions {
  padding: 0 20px 20px;
}

.info-card, .security-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.security-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.security-desc {
  color: #718096;
  font-size: 13px;
}

.dialog-footer {
  text-align: right;
}
</style> 