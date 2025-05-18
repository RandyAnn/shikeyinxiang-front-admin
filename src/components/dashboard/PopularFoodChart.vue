<template>
  <el-card class="chart-card">
    <div class="card-header">
      <h3>热门食物分析</h3>
      <el-radio-group v-model="period" size="small" @change="fetchData">
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="quarter">本季度</el-radio-button>
      </el-radio-group>
    </div>
    <div v-loading="loading" class="chart-container">
      <div ref="chartContainer" class="chart-inner"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import { getPopularFoods } from '@/api/dashboard'

export default {
  name: 'PopularFoodChart',
  data() {
    return {
      chart: null,
      loading: false,
      period: 'month',
      foodData: [],
      categoryColors: {
        '蔬菜': '#91cc75',
        '水果': '#fac858',
        '肉类': '#ee6666',
        '谷物': '#73c0de',
        '蛋奶': '#3ba272',
        '海鲜': '#5470c6',
        '淀粉': '#fc8452',
        '饮料': '#9a60b4',
        '零食': '#ea7ccc'
      }
    }
  },
  mounted() {
    this.fetchData()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    // 获取热门食物数据
    async fetchData() {
      this.loading = true
      try {
        const response = await getPopularFoods(this.period)
        if (response && response.data && response.data.code === 200) {
          this.foodData = response.data.data || []
          this.initChart()
        } else {
          this.$message.error('获取热门食物数据失败')
        }
      } catch (error) {
        console.error('获取热门食物数据失败:', error)
        this.$message.error('获取热门食物数据失败: ' + (error.message || '未知错误'))
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

      // 按记录次数排序（从小到大，便于横向条形图展示）
      const sortedData = [...this.foodData].sort((a, b) => a.count - b.count)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            const data = params[0]
            return `${data.name}<br/>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${data.color};"></span>
                    记录次数: ${data.value} 次`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 次'
          }
        },
        yAxis: {
          type: 'category',
          data: sortedData.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 0
          }
        },
        series: [
          {
            name: '记录次数',
            type: 'bar',
            data: sortedData.map((item, index) => ({
              value: item.count,
              itemStyle: {
                // 使用预定义的颜色数组，根据索引循环使用不同颜色
                color: [
                  '#5470c6', '#91cc75', '#fac858', '#ee6666',
                  '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
                  '#ea7ccc', '#f86c6b'
                ][index % 10]
              }
            })),
            label: {
              show: true,
              position: 'right',
              formatter: '{c} 次'
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
  height: 350px;
  width: 100%;
}

.chart-inner {
  height: 100%;
  width: 100%;
}
</style>