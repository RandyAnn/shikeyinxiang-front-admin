<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(card, index) in statCards" :key="index">
        <el-card shadow="hover" class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-icon" :style="{ backgroundColor: card.color }">
            <i :class="card.icon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-title">{{ card.title }}</div>
            <div class="stat-value">{{ card.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="chart-header">
            <span>系统访问统计</span>
            <el-radio-group v-model="timeRange" size="small">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="year">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-placeholder">
            <!-- 这里放图表组件 -->
            <div class="chart-mock">访问量统计图表</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <div slot="header">
            <span>用户分布</span>
          </div>
          <div class="chart-placeholder">
            <!-- 这里放图表组件 -->
            <div class="chart-mock">用户分布图表</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="activity-row">
      <el-col :span="12">
        <el-card shadow="hover" class="activity-card">
          <div slot="header">
            <span>最近活动</span>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
              :type="activity.type"
              :color="activity.color"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="todo-card">
          <div slot="header">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
          </div>
          <el-table :data="todos" style="width: 100%">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.done"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="content">
              <template slot-scope="scope">
                <span :class="{ 'todo-done': scope.row.done }">{{ scope.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="deadline"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      timeRange: 'week',
      statCards: [
        {
          title: '用户总数',
          value: '1,234',
          icon: 'el-icon-user',
          color: '#409EFF'
        },
        {
          title: '今日访问',
          value: '423',
          icon: 'el-icon-view',
          color: '#67C23A'
        },
        {
          title: '系统消息',
          value: '25',
          icon: 'el-icon-message',
          color: '#E6A23C'
        },
        {
          title: '待处理事项',
          value: '12',
          icon: 'el-icon-s-claim',
          color: '#F56C6C'
        }
      ],
      activities: [
        {
          content: '完成了用户管理模块的开发',
          timestamp: '2023-10-15 14:30',
          type: 'success',
          color: '#67C23A'
        },
        {
          content: '修复了登录页面的bug',
          timestamp: '2023-10-14 10:20',
          type: 'primary',
          color: '#409EFF'
        },
        {
          content: '新增了数据统计功能',
          timestamp: '2023-10-13 16:45',
          type: 'warning',
          color: '#E6A23C'
        },
        {
          content: '系统上线',
          timestamp: '2023-10-10 09:00',
          type: 'info',
          color: '#909399'
        }
      ],
      todos: [
        {
          content: '完成首页设计',
          deadline: '今天',
          done: true
        },
        {
          content: '实现用户管理功能',
          deadline: '明天',
          done: false
        },
        {
          content: '修复已知bug',
          deadline: '10月20日',
          done: false
        },
        {
          content: '优化系统性能',
          deadline: '10月25日',
          done: false
        }
      ]
    };
  }
};
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.stat-card {
  height: 100px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.stat-icon i {
  font-size: 30px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.chart-mock {
  color: #909399;
  font-size: 16px;
}

.activity-row {
  margin-bottom: 20px;
}

.activity-card, .todo-card {
  height: 350px;
  overflow-y: auto;
}

.todo-done {
  text-decoration: line-through;
  color: #909399;
}
</style> 