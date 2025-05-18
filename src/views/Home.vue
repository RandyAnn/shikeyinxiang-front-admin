<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(card, index) in statCards" :key="index">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: card.color }">
              <i :class="card.icon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ card.title }}</div>
              <div class="stat-value">{{ card.value }}</div>
            </div>
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
          <div slot="header" class="todo-header">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addTodo">添加</el-button>
          </div>
          <el-table :data="todos" style="width: 100%">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.done" @change="toggleTodo(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="content">
              <template slot-scope="scope">
                <span :class="{ 'todo-done': scope.row.done }">{{ scope.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.priority === 'high' ? 'danger' : scope.row.priority === 'medium' ? 'warning' : 'info'">
                  {{ scope.row.priority === 'high' ? '紧急' : scope.row.priority === 'medium' ? '重要' : '普通' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" @click="removeTodo(scope.$index)"></el-button>
              </template>
            </el-table-column>
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
        { title: '用户总数', value: '1,234', icon: 'el-icon-user', color: '#8B5CF6' },
        { title: '今日访问', value: '423', icon: 'el-icon-view', color: '#3B82F6' },
        { title: '系统消息', value: '25', icon: 'el-icon-message', color: '#10B981' },
        { title: '待办任务', value: '8', icon: 'el-icon-s-claim', color: '#F59E0B' }
      ],
      activities: [
        { content: '张三完成了任务审批', timestamp: '2023-10-10 10:30', type: 'success', color: '#10B981' },
        { content: '系统更新至v2.3.0版本', timestamp: '2023-10-09 14:20', type: 'info', color: '#3B82F6' },
        { content: '李四提交了请假申请', timestamp: '2023-10-08 09:15', type: 'warning', color: '#F59E0B' },
        { content: '王五创建了新项目', timestamp: '2023-10-07 16:45', type: 'primary', color: '#8B5CF6' },
        { content: '服务器例行维护', timestamp: '2023-10-06 20:00', type: 'danger', color: '#EF4444' }
      ],
      todos: [
        { content: '完成项目方案', done: false, priority: 'high' },
        { content: '准备周会材料', done: false, priority: 'medium' },
        { content: '回复客户邮件', done: true, priority: 'medium' },
        { content: '安排团队建设活动', done: false, priority: 'low' },
        { content: '更新系统文档', done: false, priority: 'low' }
      ]
    };
  },
  methods: {
    toggleTodo(todo) {
      // 这里可以调用API更新待办状态
      console.log('切换待办状态:', todo);
    },
    addTodo() {
      this.$prompt('请输入待办事项', '添加待办', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入待办内容'
      }).then(({ value }) => {
        if (value) {
          this.todos.unshift({
            content: value,
            done: false,
            priority: 'medium'
          });
          this.$message.success('添加成功');
        }
      }).catch(() => {});
    },
    removeTodo(index) {
      this.$confirm('确定删除该待办事项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.todos.splice(index, 1);
        this.$message.success('删除成功');
      }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.home-container {
  padding: 0;
}

.stat-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-icon i {
  font-size: 24px;
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
  border-radius: 8px;
  overflow: hidden;
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
  border-radius: 8px;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-done {
  text-decoration: line-through;
  color: #909399;
}

.el-radio-button >>> .el-radio-button__inner {
  background-color: #f5f7fa;
  border-color: #dcdfe6;
  color: #606266;
}

.el-radio-button.is-active >>> .el-radio-button__inner {
  background-color: #8B5CF6;
  border-color: #8B5CF6;
  color: #fff;
  box-shadow: -1px 0 0 0 #8B5CF6;
}
</style> 