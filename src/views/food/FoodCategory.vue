<template>
  <div class="food-category-container">
    <!-- 顶部筛选栏，保持与FoodList页面一致的布局 -->
    <el-card class="filter-card">
      <div class="filter-container">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddCategoryDialog">添加分类</el-button>
      </div>
    </el-card>

    <el-card class="category-card" shadow="hover">
      <div class="card-title">
        <i class="el-icon-menu"></i>
        <span>食物分类管理</span>
      </div>

      <div v-loading="loading" class="category-list">
        <el-empty v-if="categories.length === 0" description="暂无分类数据"></el-empty>

        <el-row :gutter="20" v-else>
          <el-col :xs="24" :sm="12" :md="8" v-for="(category, index) in categories" :key="category.id || index" class="category-item-col">
            <el-card shadow="hover" class="category-item" :body-style="{ padding: '15px' }">
              <div class="category-content">
                <div class="category-header">
                  <el-tag :type="category.color || ''" size="medium" effect="dark">{{ category.name }}</el-tag>
                  <div class="category-count">
                    <i class="el-icon-food"></i>
                    <span>{{ category.foodCount || 0 }} 个食物</span>
                  </div>
                </div>
                <div class="category-description" v-if="category.description">
                  {{ category.description }}
                </div>
                <div class="category-description" v-else>
                  <span class="text-secondary">暂无描述</span>
                </div>
              </div>
              <div class="category-actions">
                <el-button type="primary" size="mini" icon="el-icon-edit" plain @click="handleEditCategory(category)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" plain @click="handleDeleteCategory(category)">删除</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 分页器 -->
        <div class="pagination-container">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.current"
            :page-sizes="[9, 12, 18, 24]"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="categoryForm" :rules="categoryRules" ref="categoryForm" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="显示颜色" prop="color">
          <el-select v-model="categoryForm.color" placeholder="请选择标签颜色" style="width: 100%">
            <el-option label="默认" value="">
              <el-tag>默认</el-tag>
            </el-option>
            <el-option label="成功" value="success">
              <el-tag type="success">成功</el-tag>
            </el-option>
            <el-option label="警告" value="warning">
              <el-tag type="warning">警告</el-tag>
            </el-option>
            <el-option label="危险" value="danger">
              <el-tag type="danger">危险</el-tag>
            </el-option>
            <el-option label="信息" value="info">
              <el-tag type="info">信息</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="categoryForm.description" :rows="3" placeholder="请输入分类描述" maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" icon="el-icon-close">取 消</el-button>
        <el-button type="primary" @click="submitCategoryForm" icon="el-icon-check" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { food } from '@/api';

export default {
  name: 'FoodCategory',
  data() {
    return {
      loading: false,
      submitLoading: false,
      categories: [],
      pagination: {
        current: 1,
        size: 9,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '添加分类',
      dialogType: 'add', // add or edit
      categoryForm: {
        name: '',
        color: '',
        description: '',
        id: null
      },
      categoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取分页数据
    async fetchData() {
      this.loading = true;
      try {
        // 使用分页API获取分类数据
        const params = {
          current: this.pagination.current,
          size: this.pagination.size
        };
        
        const response = await food.getCategoriesByPage(params);
        if (response.data && response.data.code === 200 && response.data.data) {
          const { records, total, current, size } = response.data.data;
          this.categories = records || [];
          this.pagination.total = total || 0;
          this.pagination.current = current || 1;
          this.pagination.size = size || 9;
        } else {
          this.$message.error('获取分类数据失败');
          this.categories = [];
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        this.$message.error('获取数据失败: ' + (error.response?.data?.message || error.message));
        this.categories = [];
      } finally {
        this.loading = false;
      }
    },

    // 处理每页显示数量变化
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.current = 1; // 重置到第一页
      this.fetchData();
    },

    // 处理当前页变化
    handleCurrentChange(current) {
      this.pagination.current = current;
      this.fetchData();
    },

    // 显示添加分类对话框
    showAddCategoryDialog() {
      this.dialogType = 'add';
      this.dialogTitle = '添加分类';
      this.categoryForm = {
        name: '',
        color: '',
        description: '',
        id: null
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.categoryForm && this.$refs.categoryForm.clearValidate();
      });
    },

    // 处理编辑分类
    handleEditCategory(category) {
      this.dialogType = 'edit';
      this.dialogTitle = '编辑分类';
      this.categoryForm = {
        id: category.id,
        name: category.name,
        color: category.color || '',
        description: category.description || ''
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.categoryForm && this.$refs.categoryForm.clearValidate();
      });
    },

    // 处理删除分类
    handleDeleteCategory(category) {
      // 检查该分类下是否有食物
      const foodCount = category.foodCount || 0;
      if (foodCount > 0) {
        this.$confirm(`该分类下有 ${foodCount} 个食物，删除分类会将这些食物归类为"其他"，是否继续?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDeleteCategory(category.id);
        }).catch(() => {
          // 取消删除
        });
      } else {
        this.$confirm(`确定要删除分类 "${category.name}" 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDeleteCategory(category.id);
        }).catch(() => {
          // 取消删除
        });
      }
    },

    // 删除分类
    async doDeleteCategory(categoryId) {
      try {
        this.loading = true;
        
        const response = await food.deleteCategory(categoryId);
        if (response.data && response.data.code === 200) {
          this.$message.success('删除分类成功');
          // 重新获取分类列表
          await this.fetchData();
        } else {
          // 处理错误情况
          this.$message.error('删除分类失败: ' + (response.data?.message || '未知错误'));
        }
      } catch (error) {
        console.error('删除分类失败:', error);
        this.$message.error('删除分类失败: ' + (error.response?.data?.message || error.message));
      } finally {
        this.loading = false;
      }
    },

    // 提交分类表单
    async submitCategoryForm() {
      this.$refs.categoryForm.validate(async (valid) => {
        if (valid) {
          try {
            this.submitLoading = true;
            
            const categoryData = { ...this.categoryForm };
            
            if (this.dialogType === 'add') {
              // 添加分类
              delete categoryData.id; // 新增时不需要ID
              
              const response = await food.addCategory(categoryData);
              if (response.data && response.data.code === 200) {
                this.$message.success('添加分类成功');
                this.dialogVisible = false;
                await this.fetchData();
              } else {
                this.$message.error('添加分类失败: ' + (response.data?.message || '未知错误'));
              }
            } else {
              // 更新分类
              const id = categoryData.id;
              
              const response = await food.updateCategory(id, categoryData);
              if (response.data && response.data.code === 200) {
                this.$message.success('更新分类成功');
                this.dialogVisible = false;
                await this.fetchData();
              } else {
                this.$message.error('更新分类失败: ' + (response.data?.message || '未知错误'));
              }
            }
          } catch (error) {
            console.error('保存分类失败:', error);
            this.$message.error('操作失败: ' + (error.response?.data?.message || error.message));
          } finally {
            this.submitLoading = false;
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.food-category-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-card {
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s;
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.card-title i {
  margin-right: 8px;
  font-size: 18px;
  color: #2a9d5c;
}

.category-list {
  min-height: 200px;
  padding: 10px 0;
}

.category-item-col {
  margin-bottom: 20px;
}

.category-item {
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid #EBEEF5;
}

.category-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.category-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.category-description {
  font-size: 14px;
  color: #606266;
  margin-top: 8px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 42px;
}

.text-secondary {
  color: #909399;
  font-style: italic;
}

.category-count {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

.category-count i {
  margin-right: 4px;
  font-size: 16px;
}

.category-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 10px;
  flex-wrap: wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
