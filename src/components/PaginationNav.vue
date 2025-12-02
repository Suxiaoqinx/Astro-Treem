<template>
  <el-pagination
    :current-page="current"
    :page-size="pageSize"
    :total="total"
    layout="prev, pager, next"
    @current-change="onChange"
  />
</template>

<script setup lang="ts">
import { ElPagination } from 'element-plus'

const props = defineProps<{ current: number; pageSize: number; total: number; basePath?: string }>()

function onChange(page: number) {
  const base = props.basePath || '/page'
  const href = `${base}/${page}`
  const nav = (window as any).pjaxNavigate
  if (typeof nav === 'function') nav(href)
  else window.location.href = href
}
</script>
