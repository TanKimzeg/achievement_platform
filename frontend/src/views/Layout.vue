<template>
  <div class="layout-container">
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="layout-header">
        <div class="header-left">
          <h2>中国人民公安大学学生成果管理系统</h2>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><User /></el-icon>
              {{ userStore.userName }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <el-aside class="layout-aside" width="200px">
          <el-menu
            :default-active="$route.path"
            class="sidebar-menu"
            router
            unique-opened
          >
            <!-- 学生菜单 -->
            <template v-if="userStore.userRole === 'student'">
              <el-menu-item index="/student">
                <el-icon><House /></el-icon>
                <span>控制台</span>
              </el-menu-item>
              <el-menu-item index="/student/achievements">
                <el-icon><Document /></el-icon>
                <span>我的成果</span>
              </el-menu-item>
              <el-menu-item index="/student/achievements/create">
                <el-icon><Plus /></el-icon>
                <span>添加成果</span>
              </el-menu-item>
            </template>

            <!-- 队长菜单 -->
            <template v-if="userStore.userRole === 'team_leader'">
              <el-menu-item index="/leader">
                <el-icon><House /></el-icon>
                <span>控制台</span>
              </el-menu-item>
              <el-menu-item index="/leader/audit">
                <el-icon><Check /></el-icon>
                <span>成果审核</span>
              </el-menu-item>
              <el-menu-item index="/leader/manage">
                <el-icon><Setting /></el-icon>
                <span>成果管理</span>
              </el-menu-item>
            </template>

            <!-- 管理员菜单 -->
            <template v-if="userStore.userRole === 'admin'">
              <el-menu-item index="/admin">
                <el-icon><House /></el-icon>
                <span>控制台</span>
              </el-menu-item>
              <el-menu-item index="/admin/users">
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </el-menu-item>
              <el-menu-item index="/admin/config">
                <el-icon><School /></el-icon>
                <span>系统配置</span>
              </el-menu-item>
              <el-menu-item index="/admin/monitor">
                <el-icon><Document /></el-icon>
                <span>数据监控</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-main class="layout-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { 
  User, 
  ArrowDown, 
  House, 
  Document, 
  Plus, 
  Check, 
  Setting,
  School
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      // 跳转到个人信息页面
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        userStore.logout()
        ElMessage.success('已退出登录')
        router.push('/login')
      } catch {
        // 用户取消
      }
      break
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  
  .header-left h2 {
    margin: 0;
    color: #303133;
    font-size: 18px;
    font-weight: 500;
  }
  
  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #606266;
      
      &:hover {
        color: #409eff;
      }
      
      .el-icon {
        margin: 0 4px;
      }
    }
  }
}

.layout-aside {
  background: #fff;
  border-right: 1px solid #e4e7ed;
  
  .sidebar-menu {
    border-right: none;
    height: 100%;
  }
}

.layout-main {
  background: #f5f5f5;
  padding: 20px;
}
</style>