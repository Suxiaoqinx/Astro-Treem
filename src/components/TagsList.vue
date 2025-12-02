<template>
  <div class="wrap">
    <a
      v-for="(item, i) in items"
      :key="i"
      :href="`${base}/${item.name}`"
      class="tag-link"
    >
      <el-tag class="tag" effect="plain">{{ item.name }}（{{ item.count }}）</el-tag>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'

const props = defineProps<{ items: { name: string; count: number }[]; basePath?: string }>()
const base = props.basePath || '/tags'
</script>

<style scoped>
.wrap { display:flex; gap:10px; flex-wrap:wrap; }
.tag-link { text-decoration: none; }
.tag { font-size:14px; }
</style>
