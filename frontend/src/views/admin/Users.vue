<template>
  <div class="users-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="openCreateDialog">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-select v-model="filters.role" placeholder="角色筛选" clearable @change="fetchUsers">
              <el-option label="全部角色" value="" />
              <el-option label="学生" value="student" />
              <el-option label="队长" value="team_leader" />
              <el-option label="管理员" value="admin" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="filters.class_id" placeholder="班级筛选" clearable @change="fetchUsers">
              <el-option label="全部班级" value="" />
              <el-option 
                v-for="cls in classes" 
                :key="cls.class_id" 
                :label="cls.class_name" 
                :value="cls.class_id" 
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="filters.keyword"
              placeholder="搜索用户名或姓名"
              clearable
              @keyup.enter="fetchUsers"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button @click="fetchUsers" :loading="loading">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
            <el-button @click="resetFilters">
              <el-icon><Delete /></el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>
      
      <!-- 用户列表 -->
      <el-table
        :data="users"
        v-loading="loading"
        stripe
        style="width: 100%; min-width: 1200px;"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)">{{ getRoleDisplay(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="class_name" label="所属班级" min-width="180" />
        <el-table-column prop="created_at" label="创建时间" width="180" sortable="custom">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="last_login" label="最后登录" width="180">
          <template #default="{ row }">
            {{ row.last_login ? formatDateTime(row.last_login) : '从未登录' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'">
              {{ row.is_active ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" @click="editUser(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button 
                size="small" 
                :type="row.is_active ? 'warning' : 'success'"
                @click="toggleUserStatus(row)"
              >
                {{ row.is_active ? '禁用' : '启用' }}
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteUser(row)"
                :disabled="row.role === 'admin'"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.per_page"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchUsers"
          @current-change="fetchUsers"
        />
      </div>
    </el-card>
    
    <!-- 创建/编辑用户对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="600px"
      :before-close="closeUserDialog"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="userForm.username" 
            placeholder="请输入用户名"
            :disabled="isEdit"
          />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="学生" value="student" />
            <el-option label="队长" value="team_leader" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="所属班级" prop="class_id" v-if="userForm.role !== 'admin'">
          <el-select v-model="userForm.class_id" placeholder="请选择班级" style="width: 100%">
            <el-option 
              v-for="cls in classes" 
              :key="cls.class_id" 
              :label="cls.class_name" 
              :value="cls.class_id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input 
            v-model="userForm.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword" v-if="!isEdit">
          <el-input 
            v-model="userForm.confirmPassword" 
            type="password" 
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-switch
            v-model="userForm.is_active"
            active-text="正常"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeUserDialog">取消</el-button>
          <el-button type="primary" @click="submitUser" :loading="submitting">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Delete,
  Edit
} from '@element-plus/icons-vue'
import { getAllUsers, createUser, updateUser, deleteUser as deleteUserApi } from '@/api/admin'
import { getAllClasses } from '@/api/admin'

// 数据
const loading = ref(false)
const submitting = ref(false)
const users = ref([])
const classes = ref([])
const userDialogVisible = ref(false)
const isEdit = ref(false)
const currentUser = ref(null)

// 筛选条件
const filters = reactive({
  role: '',
  class_id: '',
  keyword: ''
})

// 分页
const pagination = reactive({
  page: 1,
  per_page: 10,
  total: 0
})

// 排序
const sortConfig = reactive({
  prop: '',
  order: ''
})

// 用户表单
const userForm = reactive({
  username: '',
  name: '',
  role: '',
  class_id: '',
  password: '',
  confirmPassword: '',
  is_active: true
})

const userFormRef = ref()

const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  class_id: [
    { required: true, message: '请选择班级', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== userForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 角色映射
const roleMap = {
  'student': '学生',
  'team_leader': '队长',
  'admin': '管理员'
}

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      per_page: pagination.per_page,
      ...filters
    }
    
    if (sortConfig.prop) {
      params.sort_by = sortConfig.prop
      params.sort_order = sortConfig.order === 'ascending' ? 'asc' : 'desc'
    }
    
    const response = await getAllUsers(params)
    users.value = response.data.users
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取班级列表
const fetchClasses = async () => {
  try {
    const response = await getAllClasses()
    classes.value = response.data.classes
  } catch (error) {
    ElMessage.error('获取班级列表失败')
  }
}

// 重置筛选条件
const resetFilters = () => {
  Object.assign(filters, {
    role: '',
    class_id: '',
    keyword: ''
  })
  pagination.page = 1
  fetchUsers()
}

// 排序处理
const handleSortChange = ({ prop, order }) => {
  sortConfig.prop = prop
  sortConfig.order = order
  fetchUsers()
}

// 打开创建对话框
const openCreateDialog = () => {
  isEdit.value = false
  resetUserForm()
  userDialogVisible.value = true
}

// 编辑用户
const editUser = (user) => {
  isEdit.value = true
  currentUser.value = user
  Object.assign(userForm, {
    username: user.username,
    name: user.name,
    role: user.role,
    class_id: user.class_id,
    is_active: user.is_active !== false
  })
  userDialogVisible.value = true
}

// 关闭用户对话框
const closeUserDialog = () => {
  userDialogVisible.value = false
  resetUserForm()
  currentUser.value = null
}

// 重置用户表单
const resetUserForm = () => {
  Object.assign(userForm, {
    username: '',
    name: '',
    role: '',
    class_id: '',
    password: '',
    confirmPassword: '',
    is_active: true
  })
}

// 提交用户
const submitUser = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = { ...userForm }
        delete data.confirmPassword
        
        if (isEdit.value) {
          await updateUser(currentUser.value.user_id, data)
          ElMessage.success('用户更新成功')
        } else {
          await createUser(data)
          ElMessage.success('用户创建成功')
        }
        
        closeUserDialog()
        fetchUsers()
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 切换用户状态
const toggleUserStatus = async (user) => {
  try {
    await updateUser(user.user_id, { is_active: !user.is_active })
    ElMessage.success(`用户已${user.is_active ? '禁用' : '启用'}`)
    fetchUsers()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除用户
const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteUserApi(user.user_id)
    ElMessage.success('用户删除成功')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 获取角色显示文本
const getRoleDisplay = (role) => roleMap[role] || role

// 获取角色标签类型
const getRoleTagType = (role) => {
  const roleColors = {
    'student': '',
    'team_leader': 'success',
    'admin': 'danger'
  }
  return roleColors[role] || ''
}

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUsers()
  fetchClasses()
})
</script>

<style lang="scss" scoped>
.users-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .filter-section {
    margin-bottom: 20px;
    padding: 20px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
  }
  
  .pagination-wrapper {
    margin-top: 20px;
    text-align: right;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    
    .el-button {
      flex-shrink: 0;
    }
  }
}
</style>