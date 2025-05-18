<template>
  <div class="settings-container">
    <el-card shadow="hover" class="settings-card">
      <div slot="header">
        <span>系统设置</span>
      </div>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form label-width="120px" :model="basicSettings">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName"></el-input>
            </el-form-item>
            <el-form-item label="系统描述">
              <el-input type="textarea" v-model="basicSettings.systemDesc" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="系统Logo">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeLogoUpload">
                <img v-if="basicSettings.logoUrl" :src="basicSettings.logoUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="upload-tip">建议尺寸: 120px * 120px，支持jpg、png格式</div>
            </el-form-item>
            <el-form-item label="系统主题色">
              <el-color-picker v-model="basicSettings.themeColor"></el-color-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
              <el-button @click="resetBasicSettings">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="邮件设置" name="email">
          <el-form label-width="120px" :model="emailSettings">
            <el-form-item label="SMTP服务器">
              <el-input v-model="emailSettings.smtpServer"></el-input>
            </el-form-item>
            <el-form-item label="SMTP端口">
              <el-input v-model="emailSettings.smtpPort"></el-input>
            </el-form-item>
            <el-form-item label="发件人邮箱">
              <el-input v-model="emailSettings.senderEmail"></el-input>
            </el-form-item>
            <el-form-item label="发件人名称">
              <el-input v-model="emailSettings.senderName"></el-input>
            </el-form-item>
            <el-form-item label="邮箱密码">
              <el-input v-model="emailSettings.password" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="启用SSL">
              <el-switch v-model="emailSettings.enableSSL"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveEmailSettings">保存设置</el-button>
              <el-button @click="testEmailSettings">测试连接</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="安全设置" name="security">
          <el-form label-width="180px" :model="securitySettings">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securitySettings.passwordMinLength" :min="6" :max="20"></el-input-number>
            </el-form-item>
            <el-form-item label="密码复杂度要求">
              <el-checkbox-group v-model="securitySettings.passwordComplexity">
                <el-checkbox label="uppercase">必须包含大写字母</el-checkbox>
                <el-checkbox label="lowercase">必须包含小写字母</el-checkbox>
                <el-checkbox label="numbers">必须包含数字</el-checkbox>
                <el-checkbox label="special">必须包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="登录失败锁定">
              <el-switch v-model="securitySettings.enableLoginLock"></el-switch>
            </el-form-item>
            <el-form-item label="失败次数锁定阈值" v-if="securitySettings.enableLoginLock">
              <el-input-number v-model="securitySettings.loginLockThreshold" :min="3" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="锁定时间(分钟)" v-if="securitySettings.enableLoginLock">
              <el-input-number v-model="securitySettings.loginLockTime" :min="5" :max="60"></el-input-number>
            </el-form-item>
            <el-form-item label="会话超时时间(分钟)">
              <el-input-number v-model="securitySettings.sessionTimeout" :min="5" :max="120"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
              <el-button @click="resetSecuritySettings">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  data() {
    return {
      activeTab: 'basic',
      basicSettings: {
        systemName: '管理系统',
        systemDesc: '一个基于Vue和Element UI的后台管理系统',
        logoUrl: '',
        themeColor: '#409EFF'
      },
      emailSettings: {
        smtpServer: '',
        smtpPort: '25',
        senderEmail: '',
        senderName: '',
        password: '',
        enableSSL: false
      },
      securitySettings: {
        passwordMinLength: 8,
        passwordComplexity: ['uppercase', 'numbers'],
        enableLoginLock: true,
        loginLockThreshold: 5,
        loginLockTime: 30,
        sessionTimeout: 30
      }
    };
  },
  methods: {
    beforeLogoUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传Logo只能是JPG或PNG格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传Logo大小不能超过2MB!');
        return false;
      }
      
      // 模拟上传
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.basicSettings.logoUrl = reader.result;
      };
      return false;
    },
    saveBasicSettings() {
      this.$message.success('基本设置保存成功');
      // 这里应该调用保存设置的API
    },
    resetBasicSettings() {
      this.basicSettings = {
        systemName: '管理系统',
        systemDesc: '一个基于Vue和Element UI的后台管理系统',
        logoUrl: '',
        themeColor: '#409EFF'
      };
      this.$message.info('基本设置已重置');
    },
    saveEmailSettings() {
      this.$message.success('邮件设置保存成功');
      // 这里应该调用保存设置的API
    },
    testEmailSettings() {
      this.$message.info('正在测试邮件设置...');
      setTimeout(() => {
        this.$message.success('邮件设置测试成功');
      }, 2000);
      // 这里应该调用测试邮件设置的API
    },
    saveSecuritySettings() {
      this.$message.success('安全设置保存成功');
      // 这里应该调用保存设置的API
    },
    resetSecuritySettings() {
      this.securitySettings = {
        passwordMinLength: 8,
        passwordComplexity: ['uppercase', 'numbers'],
        enableLoginLock: true,
        loginLockThreshold: 5,
        loginLockTime: 30,
        sessionTimeout: 30
      };
      this.$message.info('安全设置已重置');
    }
  }
};
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.settings-card {
  margin-bottom: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style> 