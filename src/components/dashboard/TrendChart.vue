<template>
  <el-card class="chart-card">
    <div class="card-header">
      <h3>用户营养摄入趋势</h3>
      <div class="time-range">
        <el-radio-group v-model="period" size="small" @change="fetchData">
          <el-radio-button label="week">周</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
          <el-radio-button label="year">年</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div v-loading="loading" class="chart-container">
      <div ref="chartContainer" class="chart-inner"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import { getNutritionTrend } from '@/api/dashboard'

export default {
  name: 'TrendChart',
  data() {
    return {
      period: 'month',
      chart: null,
      loading: false,
      trendData: {
        dateList: [],
        calorieList: [],
        proteinList: [],
        carbsList: [],
        fatList: []
      }
    }
  },
  mounted() {
    this.fetchData()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart)
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    // 获取营养趋势数据
    async fetchData() {
      this.loading = true
      try {
        const response = await getNutritionTrend(this.period)
        if (response && response.data && response.data.code === 200) {
          this.trendData = response.data.data || {
            dateList: [],
            calorieList: [],
            proteinList: [],
            carbsList: [],
            fatList: []
          }
          this.initChart()
        } else {
          this.$message.error('获取营养趋势数据失败')
        }
      } catch (error) {
        console.error('获取营养趋势数据失败:', error)
        this.$message.error('获取营养趋势数据失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },

    // 初始化图表
    initChart() {
      if (!this.$refs.chartContainer) return

      if (this.chart) {
        this.chart.dispose()
      }

      this.chart = echarts.init(this.$refs.chartContainer)

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let result = params[0].name + '<br/>'
            params.forEach(param => {
              // 保留一位小数
              const value = parseFloat(param.value).toFixed(1)
              // 根据不同的系列使用不同的单位
              const unit = param.seriesName === '卡路里' ? 'kcal' : 'g'
              result += `${param.marker} ${param.seriesName}: ${value}${unit}<br/>`
            })
            return result
          }
        },
        legend: {
          data: ['碳水化合物', '蛋白质', '脂肪', '卡路里']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.trendData.dateList || []
        },
        yAxis: [
          {
            type: 'value',
            name: '克(g)',
            position: 'left',
            axisLabel: {
              formatter: '{value}g'
            }
          },
          {
            type: 'value',
            name: '卡路里(kcal)',
            position: 'right',
            offset: 0,
            axisLabel: {
              formatter: '{value}kcal'
            }
          }
        ],
        series: [
          {
            name: '碳水化合物',
            type: 'line',
            data: this.trendData.carbsList || [],
            smooth: true,
            itemStyle: {
              color: '#10B981'
            }
          },
          {
            name: '蛋白质',
            type: 'line',
            data: this.trendData.proteinList || [],
            smooth: true,
            itemStyle: {
              color: '#3B82F6'
            }
          },
          {
            name: '脂肪',
            type: 'line',
            data: this.trendData.fatList || [],
            smooth: true,
            itemStyle: {
              color: '#F59E0B'
            }
          },
          {
            name: '卡路里',
            type: 'line',
            yAxisIndex: 1, // 使用右侧Y轴
            data: this.trendData.calorieList || [],
            smooth: true,
            itemStyle: {
              color: '#EF4444' // 红色
            }
          }
        ]
      }

      this.chart.setOption(option)
    },

    // 调整图表大小
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped>
.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: normal;
  margin: 0;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.chart-inner {
  height: 100%;
  width: 100%;
}
</style>