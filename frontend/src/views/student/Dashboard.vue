<template>
  <div class="student-dashboard">
    <div class="welcome-card">
      <h2>欢迎，{{ userStore.userName }}！</h2>
      <p>这里是学生成果管理系统，您可以在这里管理您的学术成果。</p>
    </div>
    
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card total">
          <div class="stat-content">
            <div class="stat-number">{{ statistics.total || 0 }}</div>
            <div class="stat-label">总成果数</div>
          </div>
          <el-icon class="stat-icon"><Trophy /></el-icon>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card pending">
          <div class="stat-content">
            <div class="stat-number">{{ statistics.pending || 0 }}</div>
            <div class="stat-label">待审核</div>
          </div>
          <el-icon class="stat-icon"><Clock /></el-icon>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card approved">
          <div class="stat-content">
            <div class="stat-number">{{ statistics.approved || 0 }}</div>
            <div class="stat-label">已通过</div>
          </div>
          <el-icon class="stat-icon"><Check /></el-icon>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card returned">
          <div class="stat-content">
            <div class="stat-number">{{ statistics.returned || 0 }}</div>
            <div class="stat-label">已退回</div>
          </div>
          <el-icon class="stat-icon"><RefreshLeft /></el-icon>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>成果类型分布</span>
          </template>
          <div ref="typeChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>成果级别分布</span>
          </template>
          <div ref="levelChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="quick-actions">
      <template #header>
        <span>快速操作</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="$router.push('/student/achievements/create')" block size="large">
            <el-icon><Plus /></el-icon>
            添加成果
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button @click="$router.push('/student/achievements')" block size="large">
            <el-icon><Document /></el-icon>
            查看成果
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button @click="refreshData" block size="large">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button @click="exportData" block size="large">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { getStatistics } from '@/api/student'
import { ElMessage } from 'element-plus'
import { 
  Plus, 
  Document, 
  Trophy, 
  Clock, 
  Check, 
  RefreshLeft,
  Refresh,
  Download
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const userStore = useUserStore()

// 数据
const statistics = reactive({
  total: 0,
  pending: 0,
  approved: 0,
  returned: 0,
  rejected: 0,
  by_type: {},
  by_level: {}
})

// 图表引用
const typeChartRef = ref()
const levelChartRef = ref()
let typeChart = null
let levelChart = null

// 类型和级别的中文映射
const typeMap = {
  'paper': '论文',
  'competition': '竞赛',
  'project': '项目',
  'honor': '荣誉'
}

const levelMap = {
  'school': '校级',
  'province': '省部级',
  'national': '国家级'
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const response = await getStatistics()
    Object.assign(statistics, response.data.statistics)
    
    // 更新图表
    await nextTick()
    updateCharts()
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

// 更新图表
const updateCharts = () => {
  updateTypeChart()
  updateLevelChart()
}

// 更新类型分布图表
const updateTypeChart = () => {
  if (!typeChart) {
    typeChart = echarts.init(typeChartRef.value)
  }
  
  const data = Object.entries(statistics.by_type).map(([key, value]) => ({
    name: typeMap[key] || key,
    value
  }))
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '成果类型',
      type: 'pie',
      radius: '70%',
      data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  typeChart.setOption(option)
}

// 更新级别分布图表
const updateLevelChart = () => {
  if (!levelChart) {
    levelChart = echarts.init(levelChartRef.value)
  }
  
  const data = Object.entries(statistics.by_level).map(([key, value]) => ({
    name: levelMap[key] || key,
    value
  }))
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '成果级别',
      type: 'pie',
      radius: '70%',
      data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  levelChart.setOption(option)
}

// 刷新数据
const refreshData = () => {
  fetchStatistics()
  ElMessage.success('数据已刷新')
}

// 导出数据
const exportData = () => {
  ElMessage.info('导出功能开发中...')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchStatistics()
})
</script>

<style lang="scss" scoped>
.student-dashboard {
  .welcome-card {
    background: white;
    padding: 30px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    h2 {
      margin: 0 0 10px 0;
      color: #303133;
    }
    
    p {
      margin: 0;
      color: #606266;
    }
  }
  
  .stats-row {
    margin-bottom: 20px;
  }
  
  .stat-card {
    position: relative;
    overflow: hidden;
    
    .stat-content {
      text-align: center;
      position: relative;
      z-index: 2;
      
      .stat-number {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      .stat-label {
        font-size: 14px;
        opacity: 0.8;
      }
    }
    
    .stat-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 40px;
      opacity: 0.3;
    }
    
    &.total {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    &.pending {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }
    
    &.approved {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }
    
    &.returned {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }
  }
  
  .chart-row {
    margin-bottom: 20px;
  }
  
  .chart-card {
    .chart-container {
      height: 300px;
      width: 100%;
    }
  }
  
  .quick-actions {
    .el-button {
      height: 60px;
      font-size: 16px;
    }
  }
}
</style>