<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="profile-card">
          <div class="profile-header">
            <el-avatar :size="100" icon="el-icon-user-solid"></el-avatar>
            <h3 class="profile-name">{{ user.username }}</h3>
            <p class="profile-role">{{ user.role === 'ADMIN' ? '管理员' : '普通用户' }}</p>
          </div>
          <div class="profile-info">
            <div class="info-item">
              <i class="el-icon-message"></i>
              <span>{{ user.email || '未设置邮箱' }}</span>
            </div>
            <div class="info-item">
              <i class="el-icon-phone"></i>
              <span>{{ user.phone || '未设置手机号' }}</span>
            </div>
            <div class="info-item">
              <i class="el-icon-location"></i>
              <span>{{ user.location || '未设置地址' }}</span>
            </div>
          </div>
          <div class="profile-actions">
            <el-button type="primary" icon="el-icon-edit" round>编辑资料</el-button>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card shadow="hover" class="info-card">
          <div slot="header">
            <span>基本信息</span>
          </div>
          <el-form label-position="left" label-width="100px" :model="userInfo">
            <el-form-item label="用户名">
              <el-input v-model="userInfo.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="userInfo.location"></el-input>
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input type="textarea" v-model="userInfo.bio" :rows="4"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUserInfo">保存</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <el-card shadow="hover" class="security-card">
          <div slot="header">
            <span>安全设置</span>
          </div>
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">账户密码</div>
              <div class="security-desc">定期更改密码可以保护账户安全</div>
            </div>
            <el-button type="text" @click="showChangePasswordDialog">修改</el-button>
          </div>
          <el-divider></el-divider>
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">绑定手机</div>
              <div class="security-desc">已绑定手机：{{ userInfo.phone || '未绑定' }}</div>
            </div>
            <el-button type="text">{{ userInfo.phone ? '更换' : '绑定' }}</el-button>
          </div>
          <el-divider></el-divider>
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">登录日志</div>
              <div class="security-desc">查看近期登录记录，确保账号安全</div>
            </div>
            <el-button type="text">查看</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="passwordDialogVisible" width="500px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword" :loading="passwordLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    // 密码验证一致性的校验规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      userInfo: {
        username: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
      },
      passwordDialogVisible: false,
      passwordLoading: false,
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        currentPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    }
  },
  created() {
    // 初始化用户信息
    this.userInfo = {
      username: this.user.username,
      email: this.user.email || '',
      phone: this.user.phone || '',
      location: this.user.location || '',
      bio: this.user.bio || ''
    };
  },
  methods: {
    saveUserInfo() {
      this.$message.success('个人信息保存成功');
      // 这里应该调用更新用户信息的API
      // await updateUserInfo(this.userInfo);
    },
    resetForm() {
      this.userInfo = {
        username: this.user.username,
        email: this.user.email || '',
        phone: this.user.phone || '',
        location: this.user.location || '',
        bio: this.user.bio || ''
      };
      this.$message.info('表单已重置');
    },
    showChangePasswordDialog() {
      this.passwordDialogVisible = true;
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.$nextTick(() => {
        this.$refs.passwordForm && this.$refs.passwordForm.clearValidate();
      });
    },
    changePassword() {
      this.$refs.passwordForm.validate(async valid => {
        if (valid) {
          this.passwordLoading = true;
          try {
            // 这里应该调用修改密码的API
            // await changePassword(this.passwordForm);
            this.$message.success('密码修改成功');
            this.passwordDialogVisible = false;
          } catch (error) {
            this.$message.error('密码修改失败: ' + error.message);
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
  padding: 20px;
}

.profile-card {
  text-align: center;
  margin-bottom: 20px;
}

.profile-header {
  padding: 20px 0;
}

.profile-name {
  margin: 15px 0 5px;
  font-size: 20px;
}

.profile-role {
  margin: 0;
  color: #909399;
}

.profile-info {
  text-align: left;
  padding: 20px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.info-item i {
  font-size: 18px;
  color: #409EFF;
  margin-right: 10px;
}

.profile-actions {
  padding: 10px 0;
}

.info-card {
  margin-bottom: 20px;
}

.security-card {
  margin-bottom: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.security-title {
  font-size: 16px;
  margin-bottom: 5px;
}

.security-desc {
  color: #909399;
  font-size: 14px;
}
</style> 