<template>
  <div class="advice-list-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span class="page-title">营养建议管理</span>
        <el-button
          style="float: right; margin-left: 10px"
          type="success"
          size="small"
          icon="el-icon-plus"
          @click="handleAdd"
        >
          新增建议
        </el-button>
        <el-select
          v-model="conditionType"
          placeholder="选择条件类型"
          style="float: right; width: 150px"
          size="small"
          @change="handleConditionTypeChange"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="蛋白质" value="protein"></el-option>
          <el-option label="碳水化合物" value="carbs"></el-option>
          <el-option label="脂肪" value="fat"></el-option>
          <el-option label="热量" value="calorie"></el-option>
          <el-option label="默认" value="default"></el-option>
        </el-select>
      </div>

      <el-table
        v-loading="loading"
        :data="adviceList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="conditionType" label="条件类型" width="120" align="center">
          <template slot-scope="scope">
            <el-tag :type="getConditionTypeTag(scope.row.conditionType)" effect="plain">
              {{ getConditionTypeLabel(scope.row.conditionType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="建议类型" width="120" align="center">
          <template slot-scope="scope">
            <el-tag :type="getAdviceTypeTag(scope.row.type)" effect="light">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150"></el-table-column>
        <el-table-column prop="description" label="详情" min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column label="百分比范围" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isDefault" class="default-tag">默认建议</span>
            <span v-else class="percentage-range">{{ scope.row.minPercentage }}% - {{ scope.row.maxPercentage }}%</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="view-btn"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              class="delete-btn"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      @close="resetForm"
      class="advice-dialog"
    >
      <el-form
        ref="adviceForm"
        :model="adviceForm"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="条件类型" prop="conditionType">
          <el-select v-model="adviceForm.conditionType" placeholder="请选择条件类型" style="width: 100%">
            <el-option label="蛋白质" value="protein"></el-option>
            <el-option label="碳水化合物" value="carbs"></el-option>
            <el-option label="脂肪" value="fat"></el-option>
            <el-option label="热量" value="calorie"></el-option>
            <el-option label="默认" value="default"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建议类型" prop="type">
          <el-select v-model="adviceForm.type" placeholder="请选择建议类型" style="width: 100%">
            <el-option label="成功" value="success"></el-option>
            <el-option label="警告" value="warning"></el-option>
            <el-option label="危险" value="danger"></el-option>
            <el-option label="信息" value="info"></el-option>
          </el-select>
          <div class="form-item-tip">不同类型的建议将使用不同的标签样式显示</div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="adviceForm.title" placeholder="请输入建议标题"></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="description">
          <el-input
            v-model="adviceForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入建议详情"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否默认建议">
          <el-switch
            v-model="adviceForm.isDefault"
            active-color="#2a9d5c"
            @change="handleIsDefaultChange"
          ></el-switch>
          <div class="form-item-tip">默认建议不需要设置百分比范围，用于不符合任何范围时的建议</div>
        </el-form-item>
        <template v-if="!adviceForm.isDefault">
          <el-form-item label="最小百分比" prop="minPercentage">
            <el-input-number
              v-model="adviceForm.minPercentage"
              :min="0"
              :max="999"
              :step="5"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="最大百分比" prop="maxPercentage">
            <el-input-number
              v-model="adviceForm.maxPercentage"
              :min="0"
              :max="999"
              :step="5"
              style="width: 100%"
            ></el-input-number>
            <div class="form-item-tip">百分比范围用于判断营养素摄入比例是否在正常范围</div>
          </el-form-item>
        </template>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllAdvices,
  getAdvicesByConditionType,
  createAdvice,
  updateAdvice,
  deleteAdvice
} from '@/api/nutrition';

export default {
  name: 'AdviceList',
  data() {
    return {
      loading: false,
      submitLoading: false,
      adviceList: [],
      conditionType: '',
      dialogVisible: false,
      dialogTitle: '新增营养建议',
      isEdit: false,
      adviceForm: {
        id: null,
        conditionType: 'protein',
        type: 'info',
        title: '',
        description: '',
        minPercentage: 0,
        maxPercentage: 100,
        isDefault: false,
        priority: 10,
        status: 1
      },
      rules: {
        conditionType: [{ required: true, message: '请选择条件类型', trigger: 'change' }],
        type: [{ required: true, message: '请选择建议类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入建议标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入建议详情', trigger: 'blur' }],
        minPercentage: [{ required: true, message: '请输入最小百分比', trigger: 'blur' }],
        maxPercentage: [{ required: true, message: '请输入最大百分比', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.fetchAdviceList();
  },
  methods: {
    // 获取营养建议列表
    async fetchAdviceList() {
      this.loading = true;
      try {
        let response;
        if (this.conditionType) {
          response = await getAdvicesByConditionType(this.conditionType);
        } else {
          response = await getAllAdvices();
        }

        if (response.data.code === 200) {
          this.adviceList = response.data.data;
        } else {
          this.$message.error(response.data.message || '获取营养建议列表失败');
        }
      } catch (error) {
        console.error('获取营养建议列表失败', error);
        this.$message.error('获取营养建议列表失败');
      } finally {
        this.loading = false;
      }
    },

    // 条件类型变更
    handleConditionTypeChange() {
      this.fetchAdviceList();
    },

    // 获取条件类型标签样式
    getConditionTypeTag(type) {
      const map = {
        protein: 'success',
        carbs: 'primary',
        fat: 'warning',
        calorie: 'danger',
        default: 'info'
      };
      return map[type] || 'info';
    },

    // 获取条件类型显示文本
    getConditionTypeLabel(type) {
      const map = {
        protein: '蛋白质',
        carbs: '碳水化合物',
        fat: '脂肪',
        calorie: '热量',
        default: '默认'
      };
      return map[type] || type;
    },

    // 获取建议类型标签样式
    getAdviceTypeTag(type) {
      return type;
    },



    // 处理新增
    handleAdd() {
      this.isEdit = false;
      this.dialogTitle = '新增营养建议';
      this.resetForm();
      this.dialogVisible = true;
    },

    // 处理编辑
    handleEdit(row) {
      this.isEdit = true;
      this.dialogTitle = '编辑营养建议';
      // 复制所有字段，确保优先级和状态字段被保留
      this.adviceForm = {
        ...row,
        priority: row.priority !== undefined ? row.priority : 10,
        status: row.status !== undefined ? row.status : 1
      };
      this.dialogVisible = true;
    },

    // 处理删除
    handleDelete(row) {
      this.$confirm('确认删除该营养建议吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await deleteAdvice(row.id);
          if (response.data.code === 200) {
            this.$message.success('删除成功');
            this.fetchAdviceList();
          } else {
            this.$message.error(response.data.message || '删除失败');
          }
        } catch (error) {
          console.error('删除失败', error);
          this.$message.error('删除失败');
        }
      }).catch(() => {
        // 取消删除
      });
    },

    // 处理是否默认建议变更
    handleIsDefaultChange(val) {
      if (val) {
        // 如果是默认建议，清空百分比范围
        this.adviceForm.minPercentage = null;
        this.adviceForm.maxPercentage = null;
      } else {
        // 如果不是默认建议，设置默认百分比范围
        this.adviceForm.minPercentage = 0;
        this.adviceForm.maxPercentage = 100;
      }
    },

    // 重置表单
    resetForm() {
      if (this.$refs.adviceForm) {
        this.$refs.adviceForm.resetFields();
      }
      this.adviceForm = {
        id: null,
        conditionType: 'protein',
        type: 'info',
        title: '',
        description: '',
        minPercentage: 0,
        maxPercentage: 100,
        isDefault: false,
        priority: 10,
        status: 1
      };
    },

    // 提交表单
    submitForm() {
      this.$refs.adviceForm.validate(async valid => {
        if (!valid) return;

        // 确保优先级和状态字段有默认值
        if (this.adviceForm.priority === undefined || this.adviceForm.priority === null) {
          this.adviceForm.priority = 10;
        }
        if (this.adviceForm.status === undefined || this.adviceForm.status === null) {
          this.adviceForm.status = 1;
        }

        this.submitLoading = true;
        try {
          let response;
          if (this.isEdit) {
            // 编辑时，从请求体中排除id字段，因为id通过URL路径参数传递
            // eslint-disable-next-line
            const { id, createdAt, updatedAt, ...adviceData } = this.adviceForm;
            response = await updateAdvice(id, adviceData);
          } else {
            // 新增时，排除id字段
            // eslint-disable-next-line
            const { id, createdAt, updatedAt, ...adviceData } = this.adviceForm;
            response = await createAdvice(adviceData);
          }

          if (response.data.code === 200) {
            this.$message.success(this.isEdit ? '更新成功' : '创建成功');
            this.dialogVisible = false;
            this.fetchAdviceList();
          } else {
            this.$message.error(response.data.message || (this.isEdit ? '更新失败' : '创建失败'));
          }
        } catch (error) {
          console.error(this.isEdit ? '更新失败' : '创建失败', error);
          this.$message.error(this.isEdit ? '更新失败' : '创建失败');
        } finally {
          this.submitLoading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.advice-list-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.view-btn {
  color: #2a9d5c;
}

.delete-btn {
  color: #f56c6c;
}

/* 添加高亮效果 */
.highlight {
  color: #2a9d5c;
  font-weight: bold;
}

/* 添加表格内容样式 */
.el-table {
  margin-bottom: 20px;
}

/* 表格标题栏样式 */
.el-table th {
  background-color: #f5f7fa;
}

/* 对话框样式 */
.el-dialog__header {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.dialog-footer {
  margin-top: 10px;
}

/* 表单项提示信息 */
.form-item-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}



/* 默认标签样式 */
.default-tag {
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 百分比范围样式 */
.percentage-range {
  font-weight: 500;
  color: #409eff;
}

/* 对话框样式优化 */
.advice-dialog .el-dialog__body {
  padding-top: 20px;
}

.advice-dialog .el-form-item {
  margin-bottom: 22px;
}

.advice-dialog .el-dialog__footer {
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
}

/* 响应式样式 */
@media screen and (max-width: 768px) {
  .filter-card {
    margin-bottom: 15px;
  }

  .el-table {
    width: 100%;
    overflow-x: auto;
  }

  .el-dialog {
    width: 90% !important;
  }
}
</style>
