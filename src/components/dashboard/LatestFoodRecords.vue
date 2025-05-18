<template>
  <el-card class="records-card">
    <div slot="header" class="card-header">
      <h3>最新饮食记录</h3>
      <div class="filter-container">
        <el-select v-model="mealType" placeholder="餐次类型" clearable size="small" @change="fetchRecords">
          <el-option label="早餐" value="breakfast"></el-option>
          <el-option label="午餐" value="lunch"></el-option>
          <el-option label="晚餐" value="dinner"></el-option>
          <el-option label="加餐" value="snacks"></el-option>
        </el-select>
        <el-button size="small" type="primary" icon="el-icon-refresh" circle @click="reloadRecords" title="重新加载所有记录"></el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="records" style="width: 100%" border>
      <el-table-column prop="username" label="用户" width="120">
        <template #default="scope">
          {{ getUserName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="食物" min-width="180">
        <template #default="scope">
          {{ getFoodSummary(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="totalCalorie" label="热量(KCAL)" width="120"></el-table-column>
      <el-table-column label="餐次类型" width="100">
        <template #default="scope">
          <el-tag :type="getMealTypeTagType(scope.row.mealType)" size="small">
            {{ getMealTypeText(scope.row.mealType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" width="180">
        <template #default="scope">
          {{ formatDateTime(scope.row.date, scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="text" size="small" class="view-btn" @click="viewDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <div class="total-records">
        共 <span class="highlight">{{ total }}</span> 条记录
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange">
      </el-pagination>
    </div>

    <!-- 饮食记录详情对话框 -->
    <el-dialog title="饮食记录详情" :visible.sync="dialogVisible" width="600px">
      <div v-loading="detailLoading">
        <div v-if="recordDetail" class="record-detail">
          <div class="detail-header">
            <div class="detail-item">
              <span class="label">用户：</span>
              <span class="value">{{ getUserName(recordDetail) }}</span>
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

          <div class="food-list">
            <h4>食物清单</h4>
            <el-table :data="recordDetail.foods" border size="small">
              <el-table-column prop="name" label="食物名称"></el-table-column>
              <el-table-column label="数量">
                <template #default="scope">
                  {{ scope.row.amount }}*{{ scope.row.unit }}
                </template>
              </el-table-column>
              <el-table-column prop="calories" label="热量(kcal)"></el-table-column>
              <el-table-column prop="protein" label="蛋白质(g)"></el-table-column>
              <el-table-column prop="fat" label="脂肪(g)"></el-table-column>
              <el-table-column prop="carbs" label="碳水(g)"></el-table-column>
            </el-table>
          </div>

          <div v-if="recordDetail.remark" class="remark">
            <h4>备注</h4>
            <p>{{ recordDetail.remark }}</p>
          </div>
        </div>
        <div v-else class="no-data">
          <i class="el-icon-warning-outline"></i>
          <p>未找到记录详情</p>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getLatestDietRecords, getDietRecordDetail } from '@/api/dashboard';

export default {
  name: 'LatestFoodRecords',
  data() {
    return {
      loading: false,
      records: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      mealType: '',
      dialogVisible: false,
      detailLoading: false,
      recordDetail: null,
      selectedRecordId: null,
      // 餐次类型映射
      mealTypeMap: {
        'breakfast': '早餐',
        'lunch': '午餐',
        'dinner': '晚餐',
        'snacks': '加餐'
      },
      // 反向映射（用于后端返回英文值时转换为中文）
      mealTypeReverseMap: {
        '早餐': 'breakfast',
        '午餐': 'lunch',
        '晚餐': 'dinner',
        '加餐': 'snacks'
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
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          mealType: this.mealType || undefined
        };

        const response = await getLatestDietRecords(params);

        if (response.data && response.data.code === 200 && response.data.data) {
          const pageData = response.data.data;
          this.records = pageData.records;
          this.total = pageData.total;
        } else {
          this.records = [];
          this.total = 0;
          this.$message.warning('获取饮食记录失败');
        }
      } catch (error) {
        console.error('获取饮食记录失败:', error);
        this.$message.error('获取饮食记录失败: ' + (error.response?.data?.message || error.message));
        this.records = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    // 查看记录详情
    async viewDetail(record) {
      this.selectedRecordId = record.id;
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

    // 处理分页变化
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchRecords();
    },

    // 重新加载所有记录（清除筛选条件）
    reloadRecords() {
      // 清除筛选条件
      this.mealType = '';
      // 重置页码
      this.currentPage = 1;
      // 获取记录
      this.fetchRecords();
      // 提示用户
      this.$message.success('已重新加载所有记录');
    },

    // 获取用户名称
    getUserName(record) {
      // 这里应该根据实际数据结构调整
      // 如果后端返回了用户名，直接使用
      if (record.username) return record.username;

      // 如果有userId，可以显示为"用户ID: xxx"
      if (record.userId) return `用户ID: ${record.userId}`;

      return '未知用户';
    },

    // 获取食物摘要
    getFoodSummary(record) {
      if (!record.foods || record.foods.length === 0) {
        return '无食物记录';
      }

      // 取前两个食物名称，如果超过两个则显示"等"
      const foodNames = record.foods.map(food => food.name);
      if (foodNames.length <= 2) {
        return foodNames.join(' + ');
      } else {
        return `${foodNames[0]} + ${foodNames[1]} 等${foodNames.length}种食物`;
      }
    },

    // 格式化日期时间
    formatDateTime(date, time) {
      if (!date) return '';

      // 如果time存在，则显示日期和时间
      if (time) {
        return `${date} ${time}`;
      }

      return date;
    },

    // 获取餐次类型对应的标签类型
    getMealTypeTagType(mealType) {
      // 先尝试将英文转为中文
      const chineseMealType = this.getMealTypeText(mealType);

      const typeMap = {
        '早餐': 'success',
        '午餐': 'warning',
        '晚餐': 'danger',
        '加餐': 'info'
      };

      return typeMap[chineseMealType] || 'info';
    },

    // 将餐次类型转换为中文显示
    getMealTypeText(mealType) {
      // 如果是英文，转换为中文
      if (this.mealTypeMap[mealType]) {
        return this.mealTypeMap[mealType];
      }

      // 如果已经是中文，直接返回
      if (this.mealTypeReverseMap[mealType]) {
        return mealType;
      }

      // 未知类型
      return mealType || '未知';
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
.records-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 16px;
  font-weight: normal;
  margin: 0;
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

.view-btn {
  color: #15803D;
}

.delete-btn {
  color: #F56C6C;
}

.filter-container {
  display: flex;
  gap: 10px;
}

.record-detail {
  padding: 10px;
}

.detail-header {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.detail-item {
  margin-right: 20px;
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
  color: #606266;
}

.nutrition-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.nutrition-item {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  border-right: 1px solid #ebeef5;
}

.nutrition-item:last-child {
  border-right: none;
}

.nutrition-value {
  font-size: 24px;
  font-weight: bold;
  color: #15803D;
}

.nutrition-label {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.food-list {
  margin-bottom: 20px;
}

.food-list h4 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
}

.remark {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.remark h4 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
}

.remark p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
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