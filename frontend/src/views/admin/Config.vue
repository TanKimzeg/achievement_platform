<template>
  <div class="config-page">
    <!-- 班级管理 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">班级管理</span>
          <el-button type="primary" @click="openClassDialog">
            <el-icon><Plus /></el-icon>
            添加班级
          </el-button>
        </div>
      </template>
      
      <div class="table-container">
        <el-table :data="classes" v-loading="classLoading" stripe>
          <el-table-column prop="class_name" label="班级名称" min-width="200" />
          <el-table-column prop="college" label="所属学院" min-width="180" />
          <el-table-column prop="student_count" label="学生数量" width="120" align="center" />
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button size="small" @click="editClass(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteClass(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <!-- 系统设置 -->
    <el-card class="section-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">系统设置</span>
          <el-button type="primary" @click="saveSystemConfig" :loading="configSaving">
            <el-icon><Check /></el-icon>
            保存设置
          </el-button>
        </div>
      </template>
      
      <div class="config-container">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form :model="systemConfig" label-width="120px" class="config-form">
              <el-form-item label="系统名称">
                <el-input v-model="systemConfig.system_name" placeholder="请输入系统名称" />
              </el-form-item>
              
              <el-form-item label="文件上传限制">
                <div class="input-with-unit">
                  <el-input-number 
                    v-model="systemConfig.max_file_size" 
                    :min="1" 
                    :max="100" 
                    controls-position="right"
                    style="width: 120px;"
                  />
                  <span class="unit">MB</span>
                </div>
              </el-form-item>
              
              <el-form-item label="默认密码">
                <el-input 
                  v-model="systemConfig.default_password" 
                  placeholder="新用户默认密码"
                  show-password
                />
              </el-form-item>
              

            </el-form>
          </el-col>
          
          <el-col :span="12">
            <el-form :model="systemConfig" label-width="120px" class="config-form">
              <el-form-item label="成果类型">
                <div class="tag-container">
                  <el-tag
                    v-for="(type, index) in systemConfig.achievement_types"
                    :key="index"
                    closable
                    @close="removeAchievementType(index)"
                    class="config-tag"
                  >
                    {{ type.label }}
                  </el-tag>
                  <el-input
                    v-if="inputVisible"
                    ref="inputRef"
                    v-model="inputValue"
                    size="small"
                    class="tag-input"
                    @keyup.enter="handleInputConfirm"
                    @blur="handleInputConfirm"
                  />
                  <el-button v-else size="small" class="add-tag-btn" @click="showInput">
                    <el-icon><Plus /></el-icon>
                    添加类型
                  </el-button>
                </div>
              </el-form-item>
              
              <el-form-item label="获奖级别">
                <div class="tag-container">
                  <el-tag
                    v-for="(level, index) in systemConfig.achievement_levels"
                    :key="index"
                    closable
                    @close="removeAchievementLevel(index)"
                    class="config-tag"
                  >
                    {{ level.label }}
                  </el-tag>
                  <el-input
                    v-if="levelInputVisible"
                    ref="levelInputRef"
                    v-model="levelInputValue"
                    size="small"
                    class="tag-input"
                    @keyup.enter="handleLevelInputConfirm"
                    @blur="handleLevelInputConfirm"
                  />
                  <el-button v-else size="small" class="add-tag-btn" @click="showLevelInput">
                    <el-icon><Plus /></el-icon>
                    添加级别
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
    
    <!-- 班级对话框 -->
    <el-dialog
      v-model="classDialogVisible"
      :title="isEditClass ? '编辑班级' : '添加班级'"
      width="500px"
      :before-close="closeClassDialog"
    >
      <el-form :model="classForm" :rules="classRules" ref="classFormRef" label-width="100px">
        <el-form-item label="班级名称" prop="class_name">
          <el-input v-model="classForm.class_name" placeholder="请输入班级名称" />
        </el-form-item>
        
        <el-form-item label="所属学院" prop="college">
          <el-input v-model="classForm.college" placeholder="请输入所属学院" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeClassDialog">取消</el-button>
          <el-button type="primary" @click="submitClass" :loading="classSubmitting">
            {{ isEditClass ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Edit,
  Delete,
  Check
} from '@element-plus/icons-vue'
import { 
  getAllClasses, 
  createClass, 
  updateClass, 
  deleteClass as deleteClassApi,
  updateSystemConfig
} from '@/api/admin'
import { useConfigStore } from '@/stores/config'

// 使用配置存储
const configStore = useConfigStore()

// 班级管理数据
const classLoading = ref(false)
const classSubmitting = ref(false)
const classes = ref([])
const classDialogVisible = ref(false)
const isEditClass = ref(false)
const currentClass = ref(null)

// 系统配置数据
const configSaving = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref()
const levelInputVisible = ref(false)
const levelInputValue = ref('')
const levelInputRef = ref()

// 班级表单
const classForm = reactive({
  class_name: '',
  college: ''
})

const classFormRef = ref()

const classRules = {
  class_name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
    { min: 2, max: 50, message: '班级名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  college: [
    { required: true, message: '请输入所属学院', trigger: 'blur' },
    { min: 2, max: 30, message: '学院名称长度在 2 到 30 个字符', trigger: 'blur' }
  ]
}

// 系统配置 - 使用全局存储
const systemConfig = configStore.config

// 获取班级列表
const fetchClasses = async () => {
  classLoading.value = true
  try {
    const response = await getAllClasses()
    classes.value = response.data.classes
  } catch (error) {
    ElMessage.error('获取班级列表失败')
  } finally {
    classLoading.value = false
  }
}

// 获取系统配置
const fetchSystemConfig = async () => {
  // 强制刷新配置，确保获取最新数据
  await configStore.refreshConfig()
}

// 打开班级对话框
const openClassDialog = () => {
  isEditClass.value = false
  resetClassForm()
  classDialogVisible.value = true
}

// 编辑班级
const editClass = (cls) => {
  isEditClass.value = true
  currentClass.value = cls
  Object.assign(classForm, {
    class_name: cls.class_name,
    college: cls.college
  })
  classDialogVisible.value = true
}

// 关闭班级对话框
const closeClassDialog = () => {
  classDialogVisible.value = false
  resetClassForm()
  currentClass.value = null
}

// 重置班级表单
const resetClassForm = () => {
  Object.assign(classForm, {
    class_name: '',
    college: ''
  })
}

// 提交班级
const submitClass = async () => {
  if (!classFormRef.value) return
  
  await classFormRef.value.validate(async (valid) => {
    if (valid) {
      classSubmitting.value = true
      try {
        if (isEditClass.value) {
          await updateClass(currentClass.value.class_id, classForm)
          ElMessage.success('班级更新成功')
        } else {
          await createClass(classForm)
          ElMessage.success('班级创建成功')
        }
        
        closeClassDialog()
        fetchClasses()
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '操作失败')
      } finally {
        classSubmitting.value = false
      }
    }
  })
}

// 删除班级
const deleteClass = async (cls) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除班级 "${cls.class_name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteClassApi(cls.class_id)
    ElMessage.success('班级删除成功')
    fetchClasses()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 保存系统配置
const saveSystemConfig = async () => {
  configSaving.value = true
  try {
    await updateSystemConfig(systemConfig)
    // 强制刷新全局配置
    await configStore.refreshConfig()
    ElMessage.success('系统配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    configSaving.value = false
  }
}

// 显示成果类型输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 确认添加成果类型
const handleInputConfirm = () => {
  if (inputValue.value) {
    const value = inputValue.value.toLowerCase().replace(/\s+/g, '_')
    systemConfig.achievement_types.push({
      value,
      label: inputValue.value
    })
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 移除成果类型
const removeAchievementType = (index) => {
  systemConfig.achievement_types.splice(index, 1)
}

// 显示级别输入框
const showLevelInput = () => {
  levelInputVisible.value = true
  nextTick(() => {
    levelInputRef.value?.focus()
  })
}

// 确认添加级别
const handleLevelInputConfirm = () => {
  if (levelInputValue.value) {
    const value = levelInputValue.value.toLowerCase().replace(/\s+/g, '_')
    systemConfig.achievement_levels.push({
      value,
      label: levelInputValue.value
    })
  }
  levelInputVisible.value = false
  levelInputValue.value = ''
}

// 移除级别
const removeAchievementLevel = (index) => {
  systemConfig.achievement_levels.splice(index, 1)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchClasses()
  fetchSystemConfig()
})
</script>

<style lang="scss" scoped>
.config-page {
  padding: 20px;
  
  .section-card {
    margin-bottom: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .table-container {
    padding: 0 10px;
    
    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
  }
  
  .config-container {
    padding: 20px;
  }
  
  .config-form {
    .el-form-item {
      margin-bottom: 24px;
      
      .el-form-item__label {
        font-weight: 500;
        color: #606266;
      }
    }
  }
  
  .input-with-unit {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .unit {
      color: #909399;
      font-size: 14px;
    }
  }
  
  .switch-container {
    .switch-description {
      font-size: 12px;
      color: #909399;
      margin-top: 8px;
      line-height: 1.4;
    }
  }
  
  .tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    min-height: 32px;
    
    .config-tag {
      margin: 0;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    }
    
    .tag-input {
      width: 120px;
    }
    
    .add-tag-btn {
      border-style: dashed;
      color: #409eff;
      border-color: #409eff;
      background: transparent;
      
      &:hover {
        background: #ecf5ff;
      }
    }
  }
  
  // 对话框样式优化
  :deep(.el-dialog) {
    border-radius: 12px;
    
    .el-dialog__header {
      padding: 20px 20px 10px;
      border-bottom: 1px solid #ebeef5;
      
      .el-dialog__title {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .el-dialog__body {
      padding: 20px;
    }
    
    .el-dialog__footer {
      padding: 10px 20px 20px;
      border-top: 1px solid #ebeef5;
    }
  }
  
  // 表格样式优化
  :deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;
    
    .el-table__header {
      th {
        background: #fafafa;
        color: #606266;
        font-weight: 600;
      }
    }
    
    .el-table__row {
      &:hover {
        background: #f5f7fa;
      }
    }
  }
  
  // 表单样式优化
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
  
  :deep(.el-input) {
    .el-input__wrapper {
      border-radius: 6px;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 0 0 1px #409eff inset;
      }
    }
  }
  
  :deep(.el-button) {
    border-radius: 6px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
}
</style>