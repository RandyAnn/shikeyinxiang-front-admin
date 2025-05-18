<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" size="small" @click="handleAddUser">
        <i class="el-icon-plus"></i> 添加用户
      </el-button>
    </div>

    <el-card shadow="hover" class="table-card">
      <el-table
        :data="users"
        border
        stripe
        v-loading="loading"
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色">
          <template slot-scope="scope">
            <el-tag :type="scope.row.role === 'ADMIN' ? 'danger' : 'success'">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="isAddMode">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="普通用户" value="USER"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers } from '@/api/user';

export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      
      // 对话框相关
      dialogVisible: false,
      dialogTitle: '添加用户',
      isAddMode: true,
      submitLoading: false,
      
      // 表单数据
      userForm: {
        id: null,
        username: '',
        email: '',
        password: '',
        role: 'USER'
      },
      
      // 表单验证规则
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
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await getUsers();
        this.users = response.data.content || response.data;
        this.total = response.data.totalElements || this.users.length;
      } catch (error) {
        this.$message.error('获取用户列表失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
    
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchUsers();
    },
    
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchUsers();
    },
    
    handleAddUser() {
      this.isAddMode = true;
      this.dialogTitle = '添加用户';
      this.userForm = {
        id: null,
        username: '',
        email: '',
        password: '',
        role: 'USER'
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.userForm && this.$refs.userForm.clearValidate();
      });
    },
    
    handleEdit(row) {
      this.isAddMode = false;
      this.dialogTitle = '编辑用户';
      this.userForm = { ...row };
      delete this.userForm.password; // 编辑模式不修改密码
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.userForm && this.$refs.userForm.clearValidate();
      });
    },
    
    // eslint-disable-next-line
    handleDelete(row) {
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // 这里应该调用删除用户的API
          // await deleteUser(row.id);
          this.$message.success('删除成功');
          this.fetchUsers();
        } catch (error) {
          this.$message.error('删除失败: ' + error.message);
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    
    submitForm() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true;
          try {
            if (this.isAddMode) {
              // 这里应该调用添加用户的API
              // await addUser(this.userForm);
              this.$message.success('添加用户成功');
            } else {
              // 这里应该调用更新用户的API
              // await updateUser(this.userForm.id, this.userForm);
              this.$message.success('更新用户成功');
            }
            this.dialogVisible = false;
            this.fetchUsers();
          } catch (error) {
            this.$message.error((this.isAddMode ? '添加' : '更新') + '用户失败: ' + error.message);
          } finally {
            this.submitLoading = false;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 