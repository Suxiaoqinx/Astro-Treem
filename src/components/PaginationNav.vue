<template>
  <div class="pagination-card fade-up">
    <el-pagination
      background
      :current-page="current"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ElPagination } from 'element-plus'

const props = defineProps<{ current: number; pageSize: number; total: number; basePath?: string }>()

function onChange(page: number) {
  const base = props.basePath || '/page'
  const href = `${base}/${page}`
  window.location.href = href
}
</script>

<style scoped>
.pagination-card {
  background: #fff;
  border-radius: 18px;
  padding: 12px 16px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>
