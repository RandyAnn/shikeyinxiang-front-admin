<template>
  <div class="user-list-container">
    <!-- 操作区域 -->
    <el-card class="filter-card">
      <div class="filter-container">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddUserModal = true"
        >
          新增用户
        </el-button>

        <div class="filter-section">
          <span class="filter-label">状态：</span>
          <el-select
            v-model="statusFilter"
            placeholder="全部"
            size="small"
            clearable
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>

          <span class="filter-label">注册时间：</span>
          <el-select
            v-model="timeFilter"
            placeholder="全部时间"
            size="small"
            clearable
          >
            <el-option label="全部时间" value=""></el-option>
            <el-option label="最近一周" value="最近一周"></el-option>
            <el-option label="最近一月" value="最近一月"></el-option>
            <el-option label="最近三月" value="最近三月"></el-option>
          </el-select>

          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名/邮箱"
            prefix-icon="el-icon-search"
            size="small"
            class="search-input"
          >
          </el-input>

          <el-button type="success" size="small" plain @click="search"
            >搜索</el-button
          >
        </div>
      </div>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="user-table-card">
      <el-table
        :data="filteredUsers"
        style="width: 100%"
        border
        v-loading="loading"
      >
        <el-table-column label="用户信息" min-width="200">
          <template #default="scope">
            <div class="user-info-cell">
              <!-- 如果有头像URL则显示头像，否则显示用户名首字母 -->
              <el-avatar
                v-if="scope.row.avatarUrl"
                :src="scope.row.avatarUrl"
                :size="36"
                class="user-avatar-img"
                @error="handleAvatarError(scope.row)"
              ></el-avatar>
              <div v-else class="user-avatar">{{ scope.row.username.charAt(0) }}</div>
              <div class="user-details">
                <div class="user-name">{{ scope.row.username }}</div>
                <div class="user-email">{{ scope.row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="120"></el-table-column>
        <el-table-column
          prop="registerTime"
          label="注册时间"
          width="180"
        ></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 1 ? 'success' : 'info'"
              size="small"
            >
              {{ scope.row.status === 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              class="view-btn"
              @click="viewUserDetails(scope.row)"
              >查看详情</el-button
            >
            <el-button type="text" size="small" @click="editUser(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              class="delete-btn"
              @click="confirmDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <div class="total-records">
          共 <span class="highlight">{{ totalUsers }}</span> 条记录
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="totalUsers"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 新增用户对话框 -->
    <el-dialog title="新增用户" :visible.sync="showAddUserModal" width="30%">
      <el-form :model="newUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="newUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newUser.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="newUser.email"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="newUser.status" placeholder="请选择">
            <el-option label="正常" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddUserModal = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="showEditUserModal" width="30%">
      <el-form :model="editingUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editingUser.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editingUser.email"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editingUser.status" placeholder="请选择">
            <el-option label="正常" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditUserModal = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog title="确认删除" :visible.sync="showDeleteConfirm" width="30%">
      <span
        >确定要删除用户
        <strong>{{ userToDelete.username }}</strong> 吗？此操作不可恢复。</span
      >
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDeleteConfirm = false">取 消</el-button>
        <el-button type="danger" @click="deleteUser">确定删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
} from "@/api/user";

export default {
  name: "UserList",
  data() {
    return {
      // 筛选相关
      statusFilter: "",
      timeFilter: "",
      searchKeyword: "",

      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalUsers: 0,

      // 弹窗相关
      showAddUserModal: false,
      showEditUserModal: false,
      showDeleteConfirm: false,
      newUser: {
        username: "",
        password: "",
        email: "",
        role: "USER",
        status: 1,
      },
      editingUser: {},
      userToDelete: {},

      // 用户数据
      users: [],
      loading: false,
    };
  },
  created() {
    this.fetchUsers();
  },
  computed: {
    filteredUsers() {
      let result = [...this.users];

      // 状态筛选
      if (this.statusFilter) {
        result = result.filter(
          (user) => user.status === parseInt(this.statusFilter)
        );
      }

      // 时间筛选
      if (this.timeFilter) {
        const now = new Date();
        let cutoffDate;

        if (this.timeFilter === "最近一周") {
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (this.timeFilter === "最近一月") {
          cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
        } else if (this.timeFilter === "最近三月") {
          cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate()
          );
        }

        if (cutoffDate) {
          result = result.filter((user) => {
            const registerDate = new Date(user.registerTime);
            return registerDate >= cutoffDate;
          });
        }
      }

      // 关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(
          (user) =>
            user.username.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword)
        );
      }

      return result;
    },
  },
  methods: {
    // 获取用户列表
    async fetchUsers() {
      this.loading = true;
      try {
        // 调用 API 获取用户列表
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          status: this.statusFilter,
          keyword: this.searchKeyword,
          timeFilter: this.timeFilter,
        };

        const response = await getUserList(params);

        // 处理后端返回的数据
        if (response.data && response.data.code === 200 && response.data.data) {
          const pageData = response.data.data;
          this.users = pageData.records.map((user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            registerTime: new Date(user.createTime).toLocaleString(),
            avatarUrl: user.avatarUrl || '', // 添加头像URL字段
          }));
          this.totalUsers = pageData.total;
        } else {
          this.users = [];
          this.totalUsers = 0;
        }
      } catch (error) {
        this.$message.error(
          "获取用户列表失败: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        this.loading = false;
      }
    },

    // 搜索用户
    search() {
      this.currentPage = 1;
      this.fetchUsers();
    },

    // 分页变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchUsers();
    },

    // 添加用户
    async addUser() {
      try {
        await addUser(this.newUser);
        this.$message.success("用户添加成功");
        this.showAddUserModal = false;
        this.fetchUsers(); // 重新获取用户列表

        // 重置表单
        this.newUser = {
          username: "",
          password: "",
          email: "",
          role: "USER",
          status: 1,
        };
      } catch (error) {
        this.$message.error(
          "添加用户失败: " + (error.response?.data?.message || error.message)
        );
      }
    },

    // 更新用户
    async updateUser() {
      try {
        // 确保不发送 avatarUrl 到后端
        const { avatarUrl, ...userDataToUpdate } = this.editingUser;
        await updateUser(userDataToUpdate.id, userDataToUpdate);
        this.$message.success("用户信息更新成功");
        this.showEditUserModal = false;
        this.fetchUsers(); // 重新获取用户列表
      } catch (error) {
        this.$message.error(
          "更新用户信息失败: " +
            (error.response?.data?.message || error.message)
        );
      }
    },

    // 删除用户
    async deleteUser() {
      try {
        await deleteUser(this.userToDelete.id);
        this.$message.success("用户删除成功");
        this.showDeleteConfirm = false;
        this.fetchUsers(); // 重新获取用户列表
      } catch (error) {
        this.$message.error(
          "删除用户失败: " + (error.response?.data?.message || error.message)
        );
      }
    },

    viewUserDetails(user) {
      // 实际应用中这里会跳转到用户详情页
      console.log("查看用户详情:", user);
    },

    editUser(user) {
      // 创建一个不包含 avatarUrl 的新对象
      const { avatarUrl, ...userWithoutAvatar } = user;
      this.editingUser = { ...userWithoutAvatar };
      this.showEditUserModal = true;
    },

    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteConfirm = true;
    },

    // 处理头像加载失败
    handleAvatarError(user) {
      // 当头像加载失败时，将avatarUrl设为空，这样会显示用户名首字母作为头像
      user.avatarUrl = '';
      console.warn(`用户 ${user.username} 的头像加载失败`);
    },
  },
};
</script>

<style scoped>
.user-list-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  align-items: center;
}

.filter-label {
  margin: 0 10px 0 20px;
  color: #606266;
}

.search-input {
  width: 220px;
  margin: 0 10px;
}

.user-table-card {
  margin-bottom: 20px;
}

.user-info-cell {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #2a9d5c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 16px;
}

.user-avatar-img {
  margin-right: 10px;
  border: 1px solid #eee;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  color: #303133;
}

.user-email {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.total-records {
  font-size: 14px;
  color: #606266;
}

.highlight {
  color: #2a9d5c;
  font-weight: bold;
}

.view-btn {
  color: #2a9d5c;
}

.delete-btn {
  color: #f56c6c;
}
</style>