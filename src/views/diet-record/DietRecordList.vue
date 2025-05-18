<template>
  <div class="diet-record-list-container">
    <!-- 操作区域 -->
    <el-card class="filter-card">
      <div class="filter-container">
        <div class="action-btns">
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchRecords">刷新列表</el-button>
          <el-button type="success" icon="el-icon-download" size="small" @click="exportData">导出数据</el-button>
        </div>

        <div class="filter-section">
          <span class="filter-label">用户ID：</span>
          <el-input v-model="queryParams.userId" placeholder="输入用户ID" clearable size="small" style="width: 120px"></el-input>

          <span class="filter-label">日期范围：</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="handleDateRangeChange"
            clearable
            size="small">
          </el-date-picker>

          <span class="filter-label">餐次类型：</span>
          <el-select v-model="queryParams.mealType" placeholder="全部" clearable size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="早餐" value="breakfast"></el-option>
            <el-option label="午餐" value="lunch"></el-option>
            <el-option label="晚餐" value="dinner"></el-option>
            <el-option label="加餐" value="snacks"></el-option>
          </el-select>

          <el-button type="success" size="small" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button size="small" plain @click="resetQuery">重置</el-button>
        </div>
      </div>
    </el-card>

    <!-- 列表数据 -->
    <el-card class="record-table-card">
      <el-table
        v-loading="loading"
        :data="recordList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column label="用户信息" width="150">
          <template #default="scope">
            <div class="user-details">
              <div class="user-name">{{ scope.row.username }}</div>
              <div class="user-id">ID: {{ scope.row.userId }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="餐次类型" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getMealTypeTagType(scope.row.mealType)" size="small">
              {{ getMealTypeText(scope.row.mealType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="食物信息" min-width="200">
          <template #default="scope">
            <div class="food-summary">
              {{ getFoodSummary(scope.row) }}
            </div>
            <div class="nutrition-info">
              <div class="nutrition-item">
                <span class="nutrition-label">热量:</span>
                <span class="nutrition-value">{{ scope.row.totalCalorie }}kcal</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="日期时间" width="180">
          <template #default="scope">
            <div>{{ scope.row.date }}</div>
            <div>{{ scope.row.time }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="text" size="small" class="view-btn" @click="viewDetail(scope.row)">查看详情</el-button>
            <el-button type="text" size="small" class="delete-btn" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <div class="total-records">
          共 <span class="highlight">{{ total }}</span> 条记录
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            background
            layout="prev, pager, next, jumper, sizes"
            :total="total"
            :page-size="queryParams.size"
            :current-page="queryParams.page"
            :page-sizes="[10, 20, 50, 100]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 饮食记录详情对话框 -->
    <el-dialog title="饮食记录详情" :visible.sync="dialogVisible" width="650px">
      <div v-loading="detailLoading">
        <div v-if="recordDetail" class="record-detail">
          <!-- 基础信息 -->
          <el-card class="detail-card">
            <div slot="header" class="detail-header-title">
              <i class="el-icon-user"></i> 用户信息
            </div>
            <div class="detail-header">
              <div class="detail-item">
                <span class="label">用户：</span>
                <span class="value">
                  {{ recordDetail.username }}
                  <small style="color: #909399; margin-left: 5px;">(ID: {{ recordDetail.userId }})</small>
                </span>
              </div>
              <div class="detail-item">
                <span class="label">日期：</span>
                <span class="value">{{ recordDetail.date }}</span>
              </div>
              <div class="detail-item">
                <span class="label">时间：</span>
                <span class="value">{{ recordDetail.time }}</span>
              </div>
              <div class="detail-item">
                <span class="label">餐次：</span>
                <span class="value">
                  <el-tag :type="getMealTypeTagType(recordDetail.mealType)" size="small">
                    {{ getMealTypeText(recordDetail.mealType) }}
                  </el-tag>
                </span>
              </div>
            </div>
          </el-card>

          <!-- 营养数据摘要 -->
          <el-card class="detail-card">
            <div slot="header" class="detail-header-title">
              <i class="el-icon-data-analysis"></i> 营养摘要
            </div>
            <div class="nutrition-summary">
              <div class="nutrition-item">
                <div class="nutrition-value">{{ recordDetail.totalCalorie }}</div>
                <div class="nutrition-label">总热量(kcal)</div>
              </div>
              <div class="nutrition-item">
                <div class="nutrition-value">{{ getTotalNutrition(recordDetail, 'protein') }}</div>
                <div class="nutrition-label">蛋白质(g)</div>
              </div>
              <div class="nutrition-item">
                <div class="nutrition-value">{{ getTotalNutrition(recordDetail, 'fat') }}</div>
                <div class="nutrition-label">脂肪(g)</div>
              </div>
              <div class="nutrition-item">
                <div class="nutrition-value">{{ getTotalNutrition(recordDetail, 'carbs') }}</div>
                <div class="nutrition-label">碳水(g)</div>
              </div>
            </div>
          </el-card>

          <!-- 食物清单 -->
          <el-card class="detail-card">
            <div slot="header" class="detail-header-title">
              <i class="el-icon-dish"></i> 食物清单
            </div>
            <el-table :data="recordDetail.foods" border size="small">
              <el-table-column prop="name" label="食物名称"></el-table-column>
              <el-table-column label="数量" width="120">
                <template #default="scope">
                  {{ scope.row.amount }}{{ scope.row.unit }}
                  <span v-if="scope.row.grams">({{ scope.row.grams }}g)</span>
                </template>
              </el-table-column>
              <el-table-column prop="calories" label="热量(kcal)" width="100"></el-table-column>
              <el-table-column prop="protein" label="蛋白质(g)" width="100"></el-table-column>
              <el-table-column prop="fat" label="脂肪(g)" width="100"></el-table-column>
              <el-table-column prop="carbs" label="碳水(g)" width="100"></el-table-column>
            </el-table>
          </el-card>

          <!-- 备注信息 -->
          <el-card v-if="recordDetail.remark" class="detail-card">
            <div slot="header" class="detail-header-title">
              <i class="el-icon-document"></i> 备注信息
            </div>
            <p class="remark-content">{{ recordDetail.remark }}</p>
          </el-card>
        </div>
        <div v-else class="no-data">
          <i class="el-icon-warning-outline"></i>
          <p>未找到记录详情</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDietRecords, getDietRecordDetail, deleteDietRecord } from '@/api/diet';
import { parseTime, downloadExcel } from '@/utils';

export default {
  name: 'DietRecordList',
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        userId: undefined,
        startDate: undefined,
        endDate: undefined,
        mealType: undefined
      },
      // 日期范围选择器
      dateRange: [],
      // 列表数据
      recordList: [],
      // 总记录数
      total: 0,
      // 加载状态
      loading: false,
      // 详情对话框
      dialogVisible: false,
      detailLoading: false,
      recordDetail: null,
      // 餐次类型映射
      mealTypeMap: {
        'breakfast': '早餐',
        'lunch': '午餐',
        'dinner': '晚餐',
        'snacks': '加餐'
      }
    };
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    // 获取饮食记录列表
    async fetchRecords() {
      this.loading = true;
      try {
        console.log('获取饮食记录，参数:', this.queryParams);
        const response = await getDietRecords(this.queryParams);
        console.log('饮食记录API响应:', response);

        if (response.data && response.data.code === 200 && response.data.data) {
          const pageData = response.data.data;
          console.log('获取到饮食记录数据:', pageData);

          // 确保records是数组
          if (Array.isArray(pageData.records)) {
            this.recordList = pageData.records;
            this.total = pageData.total || 0;
            console.log('设置记录列表成功，数量:', this.recordList.length);
          } else {
            console.error('API返回的records不是数组:', pageData.records);
            this.recordList = [];
            this.total = 0;
            this.$message.warning('获取饮食记录列表失败: 数据格式错误');
          }
        } else {
          console.error('API响应格式错误:', response);
          this.recordList = [];
          this.total = 0;
          this.$message.warning('获取饮食记录列表失败: 响应格式错误');
        }
      } catch (error) {
        console.error('获取饮食记录列表失败:', error);
        this.$message.error('获取饮食记录列表失败: ' + (error.response?.data?.message || error.message));
        this.recordList = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    // 查看记录详情
    async viewDetail(record) {
      this.dialogVisible = true;
      this.detailLoading = true;
      this.recordDetail = null;

      try {
        const response = await getDietRecordDetail(record.id);
        if (response.data && response.data.code === 200 && response.data.data) {
          this.recordDetail = response.data.data;
        } else {
          this.$message.warning('获取记录详情失败');
        }
      } catch (error) {
        console.error('获取记录详情失败:', error);
        this.$message.error('获取记录详情失败: ' + (error.response?.data?.message || error.message));
      } finally {
        this.detailLoading = false;
      }
    },

    // 处理删除记录
    async handleDelete(record) {
      this.$confirm(`确认删除ID为 ${record.id} 的饮食记录吗？此操作不可逆`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await deleteDietRecord(record.id);
          if (response.data && response.data.code === 200) {
            this.$message.success('删除成功');
            this.fetchRecords();
          } else {
            this.$message.error(response.data?.message || '删除失败');
          }
        } catch (error) {
          console.error('删除饮食记录失败:', error);
          this.$message.error('删除饮食记录失败: ' + (error.response?.data?.message || error.message));
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },

    // 处理日期范围变化
    handleDateRangeChange(dates) {
      if (dates) {
        this.queryParams.startDate = dates[0];
        this.queryParams.endDate = dates[1];
      } else {
        this.queryParams.startDate = undefined;
        this.queryParams.endDate = undefined;
      }
    },

    // 搜索
    handleSearch() {
      this.queryParams.page = 1;
      this.fetchRecords();
    },

    // 重置查询条件
    resetQuery() {
      this.dateRange = [];
      this.queryParams = {
        page: 1,
        size: 10,
        userId: undefined,
        startDate: undefined,
        endDate: undefined,
        mealType: undefined
      };
      this.fetchRecords();
    },

    // 处理每页显示数量变化
    handleSizeChange(size) {
      this.queryParams.size = size;
      this.fetchRecords();
    },

    // 处理页码变化
    handleCurrentChange(page) {
      this.queryParams.page = page;
      this.fetchRecords();
    },

    // 导出数据
    exportData() {
      if (this.recordList.length === 0) {
        this.$message.warning('没有可导出的数据');
        return;
      }

      try {
        // 准备导出数据
        const exportData = this.recordList.map(record => {
          return {
            'ID': record.id,
            '用户': record.username,
            '用户ID': record.userId,
            '餐次类型': this.getMealTypeText(record.mealType),
            '总热量(kcal)': record.totalCalorie,
            '日期': record.date,
            '时间': record.time,
            '食物': this.getFoodSummary(record)
          };
        });

        // 导出CSV（带BOM头，解决中文乱码问题）
        downloadExcel(exportData, '饮食记录列表', 'csv');
        this.$message.success('导出成功');
      } catch (error) {
        console.error('导出数据失败:', error);
        this.$message.error('导出数据失败: ' + error.message);
      }
    },

    // 格式化日期时间
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      try {
        return parseTime(dateTime);
      } catch (error) {
        console.error('日期格式化错误:', error, dateTime);
        return dateTime; // 如果解析失败，返回原始值
      }
    },

    // 获取餐次类型文本
    getMealTypeText(mealType) {
      return this.mealTypeMap[mealType] || mealType || '未知';
    },

    // 获取餐次类型对应的标签类型
    getMealTypeTagType(mealType) {
      const typeMap = {
        'breakfast': 'success',
        'lunch': 'warning',
        'dinner': 'danger',
        'snacks': 'info'
      };
      return typeMap[mealType] || 'info';
    },

    // 获取食物摘要
    getFoodSummary(record) {
      if (!record.foods || record.foods.length === 0) {
        return '无食物记录';
      }

      // 取前两个食物名称，如果超过两个则显示"等"
      const foodNames = record.foods.map(food => food.name || food.foodName);
      if (foodNames.length <= 2) {
        return foodNames.join(' + ');
      } else {
        return `${foodNames[0]} + ${foodNames[1]} 等${foodNames.length}种食物`;
      }
    },

    // 计算总营养素
    getTotalNutrition(record, nutrientType) {
      if (!record.foods || record.foods.length === 0) {
        return '0';
      }

      const total = record.foods.reduce((sum, food) => {
        return sum + (parseFloat(food[nutrientType]) || 0);
      }, 0);

      return total.toFixed(1);
    }
  }
}
</script>

<style scoped>
.diet-record-list-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-container {
  display: flex;
  flex-direction: column;
}

.action-btns {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.action-btns .el-button {
  border-radius: 4px;
  padding: 8px 15px;
  transition: all 0.3s;
}

.action-btns .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.filter-label {
  margin-right: 5px;
  margin-left: 15px;
  color: #606266;
}

.filter-label:first-child {
  margin-left: 0;
}

.record-table-card {
  margin-bottom: 20px;
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
  color: #15803D;
  font-weight: bold;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  color: #303133;
}

.user-id {
  font-size: 12px;
  color: #909399;
}

.food-summary {
  margin-bottom: 6px;
  color: #303133;
}

.nutrition-info {
  display: flex;
  flex-wrap: wrap;
}

.nutrition-item {
  margin-right: 15px;
  font-size: 12px;
}

.nutrition-label {
  color: #909399;
  margin-right: 3px;
}

.nutrition-value {
  color: #409EFF;
  font-weight: bold;
}

.view-btn {
  color: #409EFF;
}

.delete-btn {
  color: #F56C6C;
}

/* 详情样式 */
.detail-card {
  margin-bottom: 20px;
}

.detail-header-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.detail-header {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
}

.detail-item {
  margin-right: 20px;
  margin-bottom: 10px;
  min-width: 200px;
}

.label {
  font-weight: bold;
  color: #606266;
}

.nutrition-summary {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
}

.nutrition-summary .nutrition-item {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  position: relative;
}

.nutrition-summary .nutrition-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background-color: #EBEEF5;
}

.nutrition-summary .nutrition-value {
  font-size: 24px;
  font-weight: bold;
  color: #15803D;
  margin-bottom: 5px;
}

.nutrition-summary .nutrition-label {
  font-size: 12px;
  color: #909399;
}

.remark-content {
  margin: 0;
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
}

.no-data {
  text-align: center;
  padding: 30px 0;
  color: #909399;
}

.no-data i {
  font-size: 48px;
  margin-bottom: 10px;
}
</style>