<template>
  <div class="achievements-page">
    <el-card>
      <template #header>
        <span>成果总览</span>
      </template>
      <p>成果总览页面正在开发中...</p>
    </el-card>
  </div>
</template>

<script setup>
// 页面逻辑待实现
</script>

<style lang="scss" scoped>
.achievements-page {
  // 深色模式适配，避免局部容器显白
  :deep(.el-card) {
    background-color: var(--bg-primary);
    border-color: var(--border-color);
    color: var(--text-primary);
  }

  :deep(.filter-section) {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    padding: 16px;
  }

  :deep(.table-container) {
    background-color: var(--bg-primary);
    border-radius: 8px;
  }

  :deep(.el-table) {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
}
</style>