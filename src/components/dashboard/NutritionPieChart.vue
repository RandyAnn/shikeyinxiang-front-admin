<template>
  <el-card class="chart-card">
    <div class="card-header">
      <h3>营养素分布</h3>
      <el-dropdown trigger="click" @command="handleCommand">
        <i class="el-icon-more"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="refresh">刷新数据</el-dropdown-item>
          <el-dropdown-item command="export">导出数据</el-dropdown-item>
          <el-dropdown-item command="changeType">切换图表类型</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'NutritionPieChart',
  data() {
    return {
      chart: null,
      chartType: 'pie' // 默认图表类型
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart)
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    // 处理下拉菜单命令
    handleCommand(command) {
      switch (command) {
        case 'refresh':
          this.refreshData()
          break
        case 'export':
          this.exportData()
          break
        case 'changeType':
          this.toggleChartType()
          break
      }
    },

    // 刷新数据
    refreshData() {
      this.$message({
        message: '数据已刷新',
        type: 'success'
      })
      // 这里可以添加实际的数据刷新逻辑
      this.initChart()
    },

    // 导出数据
    exportData() {
      const data = [
        ['营养素', '数值(克)'],
        ['碳水化合物', 1048],
        ['蛋白质', 735],
        ['脂肪', 580],
        ['维生素', 484],
        ['矿物质', 300]
      ]

      // 创建CSV内容
      const csvContent = data.map(row => row.join(',')).join('\n')

      // 创建Blob对象
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

      // 创建下载链接
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', '营养素分布数据.csv')
      link.style.visibility = 'hidden'

      // 添加到DOM并触发下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      this.$message({
        message: '数据已导出',
        type: 'success'
      })
    },

    // 切换图表类型
    toggleChartType() {
      this.chartType = this.chartType === 'pie' ? 'bar' : 'pie'
      this.initChart()

      this.$message({
        message: `已切换为${this.chartType === 'pie' ? '饼图' : '柱状图'}`,
        type: 'success'
      })
    },

    // 初始化图表
    initChart() {
      if (this.chart) {
        this.chart.dispose()
      }

      this.chart = echarts.init(this.$refs.chartContainer)

      // 准备数据
      const data = [
        { value: 1048, name: '碳水化合物', itemStyle: { color: '#3B82F6' } },
        { value: 735, name: '蛋白质', itemStyle: { color: '#10B981' } },
        { value: 580, name: '脂肪', itemStyle: { color: '#F59E0B' } },
        { value: 484, name: '维生素', itemStyle: { color: '#EF4444' } },
        { value: 300, name: '矿物质', itemStyle: { color: '#60A5FA' } }
      ]

      // 根据图表类型设置不同的选项
      let option

      if (this.chartType === 'pie') {
        option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            right: '5%',
            top: 'center'
          },
          series: [
            {
              name: '营养素分布',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: data
            }
          ]
        }
      } else {
        // 柱状图配置
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.name)
          },
          yAxis: {
            type: 'value',
            name: '克(g)'
          },
          series: [
            {
              name: '营养素分布',
              type: 'bar',
              barWidth: '60%',
              data: data.map(item => ({
                value: item.value,
                itemStyle: item.itemStyle
              }))
            }
          ]
        }
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
}

.el-icon-more {
  color: #15803D;
  cursor: pointer;
}
</style>