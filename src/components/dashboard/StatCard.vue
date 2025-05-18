<template>
  <el-card class="stat-card" shadow="hover" :body-style="{ padding: '15px' }">
    <div v-if="loading" class="card-loading">
      <el-skeleton animated>
        <template slot="template">
          <el-skeleton-item variant="text" style="width: 50%" />
          <el-skeleton-item variant="h3" style="width: 70%; margin-top: 10px" />
          <el-skeleton-item variant="text" style="width: 40%; margin-top: 10px" />
        </template>
      </el-skeleton>
    </div>
    <template v-else>
      <div class="card-content">
        <div class="info">
          <div class="title">{{ title }}</div>
          <div class="value">{{ value }}</div>
        </div>
        <div class="icon" :style="{ color: iconColor }">
          <i :class="icon"></i>
        </div>
      </div>
      <div class="trend">
        <span :class="{ 'up': trend === 'up', 'down': trend === 'down' }">
          <i :class="trend === 'up' ? 'el-icon-top' : 'el-icon-bottom'"></i>
          {{ rate }}
        </span>
        <span class="period">较上周</span>
      </div>
    </template>
  </el-card>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: String,
    value: String,
    icon: String,
    iconColor: String,
    trend: String,
    rate: String,
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.stat-card {
  margin-bottom: 20px;
  height: 120px;
  position: relative;
}

.card-loading {
  height: 100%;
  display: flex;
  align-items: center;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.icon {
  font-size: 24px;
}

.trend {
  margin-top: 16px;
  font-size: 12px;
}

.up {
  color: #67C23A;
}

.down {
  color: #F56C6C;
}

.period {
  color: #909399;
  margin-left: 8px;
}
</style>