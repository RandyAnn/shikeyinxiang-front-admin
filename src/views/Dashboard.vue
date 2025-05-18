<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(card, index) in statCards" :key="index">
        <stat-card
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :icon-color="card.color"
          :trend="card.trend"
          :rate="card.rate"
          :loading="loading"
        />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <trend-chart />
      </el-col>
      <el-col :span="12">
        <popular-food-chart />
      </el-col>
    </el-row>

    <latest-food-records />
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import StatCard from '@/components/dashboard/StatCard.vue'
import TrendChart from '@/components/dashboard/TrendChart.vue'
import PopularFoodChart from '@/components/dashboard/PopularFoodChart.vue'
import LatestFoodRecords from '@/components/dashboard/LatestFoodRecords.vue'

export default {
  name: 'DashboardView',
  components: {
    StatCard,
    TrendChart,
    PopularFoodChart,
    LatestFoodRecords
  },
  data() {
    return {
      loading: true,
      statCards: [
        {
          title: '总用户数',
          value: '0',
          icon: 'el-icon-user',
          color: '#3B82F6',
          trend: 'up',
          rate: '0%'
        },
        {
          title: '今日饮食记录',
          value: '0',
          icon: 'el-icon-dish',
          color: '#10B981',
          trend: 'up',
          rate: '0%'
        },
        {
          title: '营养达标率',
          value: '0%',
          icon: 'el-icon-data-line',
          color: '#F59E0B',
          trend: 'up',
          rate: '0%'
        },
        {
          title: '推荐准确率',
          value: '0%',
          icon: 'el-icon-aim',
          color: '#EF4444',
          trend: 'up',
          rate: '0%'
        }
      ],
      lastStats: {
        totalUsers: 0,
        todayRecords: 0,
        nutritionComplianceRate: 0,
        recommendationAccuracy: 0
      }
    }
  },
  computed: {
  },
  created() {
    this.fetchDashboardStats()
  },
  mounted() {
    // 设置定时刷新
    this.refreshInterval = setInterval(() => {
      this.fetchDashboardStats()
    }, 5 * 60 * 1000)
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    async fetchDashboardStats() {
      this.loading = true

      try {
        const response = await this.$store.dispatch('dashboard/fetchDashboardStats')

        if (response && response.data && response.data.data) {
          const stats = response.data.data

          const usersTrend = this.calculateTrend(stats.totalUsers, this.lastStats.totalUsers)
          const recordsTrend = this.calculateTrend(stats.todayRecords, this.lastStats.todayRecords)
          const complianceTrend = this.calculateTrend(stats.nutritionComplianceRate, this.lastStats.nutritionComplianceRate)
          const accuracyTrend = this.calculateTrend(stats.recommendationAccuracy, this.lastStats.recommendationAccuracy)

          this.statCards[0].value = this.formatNumber(stats.totalUsers)
          this.statCards[0].trend = usersTrend.direction
          this.statCards[0].rate = usersTrend.rate

          this.statCards[1].value = this.formatNumber(stats.todayRecords)
          this.statCards[1].trend = recordsTrend.direction
          this.statCards[1].rate = recordsTrend.rate

          this.statCards[2].value = `${Math.round(stats.nutritionComplianceRate)}%`
          this.statCards[2].trend = complianceTrend.direction
          this.statCards[2].rate = complianceTrend.rate

          this.statCards[3].value = `${Math.round(stats.recommendationAccuracy)}%`
          this.statCards[3].trend = accuracyTrend.direction
          this.statCards[3].rate = accuracyTrend.rate

          this.lastStats = { ...stats }
        }
      } catch (error) {
        console.error('获取仪表盘数据失败', error)
        this.$message.error('获取仪表盘数据失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    calculateTrend(current, previous) {
      if (!previous) return { direction: 'up', rate: '0%' }

      const change = current - previous
      const percentage = previous !== 0 ? Math.abs(Math.round((change / previous) * 100)) : 0

      return {
        direction: change >= 0 ? 'up' : 'down',
        rate: `${percentage}%`
      }
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 10px;
}
</style>