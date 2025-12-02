<template>
  <el-card class="sidebar" shadow="hover">
    <div class="profile">
      <el-avatar :src="avatar" size="64" />
      <div class="info">
        <div class="name">{{ name }}</div>
        <div class="desc" v-if="description">{{ description }}</div>
      </div>
    </div>
    <div class="stats">
      <div class="stat">
        <span class="label">文章</span>
        <span class="value">{{ counts.posts }}</span>
      </div>
      <div class="stat">
        <span class="label">标签</span>
        <span class="value">{{ counts.tags }}</span>
      </div>
      <div class="stat">
        <span class="label">分类</span>
        <span class="value">{{ counts.categories }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ElCard, ElAvatar } from 'element-plus'

defineProps<{ name: string; description?: string; avatar: string; counts: { posts: number; tags: number; categories: number } }>()
</script>

<style scoped>
.sidebar { position: sticky; border-radius: 16px; }
.profile { display:flex; align-items:center; gap:12px; }
.info { display:flex; flex-direction:column; }
.name { font-weight:700; font-size:16px; }
.desc { color:#666; margin-top:4px; font-size:13px; }
.stats { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin-top:14px; }
.stat { background:#f5f7fa; border-radius:10px; padding:10px 8px; text-align:center; }
.label { color:#666; font-size:12px; }
.value { display:block; font-weight:700; font-size:18px; margin-top:4px; }
</style>
