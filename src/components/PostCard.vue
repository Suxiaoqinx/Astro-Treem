<template>
  <el-card shadow="hover" class="post-card">
    <div class="card-head" :style="{ background: headColor }">
      <span class="category" v-if="category">{{ category }}</span>
      <span class="date">{{ dateStr }}</span>
    </div>
    <a :href="href" data-pjax class="post-title">{{ title }}</a>
    <div class="post-desc" v-if="description">{{ description }}</div>
    <div class="post-meta">
      <el-tag v-for="t in tags" :key="t" class="meta-tag clickable" @click="onTagClick(t)">{{ t }}</el-tag>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElTag } from 'element-plus'

const { title, description, date, tags, slug, category } = defineProps<{
  title: string
  description?: string
  date: string
  tags: string[]
  slug: string
  category?: string
}> ()

const emit = defineEmits<{ (e: 'tagClick', tag: string): void }>()
function onTagClick(t: string) { emit('tagClick', t) }

const dateStr = computed(() => new Date(date).toLocaleDateString())
const href = computed(() => `/posts/${slug}`)
const palette: Record<string, string> = {
  Code: '#409EFF',
  Daily: '#67C23A',
  Share: '#E6A23C',
  Guide: '#909399',
}
const headColor = computed(() => palette[category || ''] || '#a0cfff')
</script>

<style scoped>
.post-card { border-radius: 16px; overflow: hidden; }
.card-head { height: 56px; display:flex; align-items:center; justify-content:space-between; padding: 0 14px; color:#fff; }
.category { font-weight:600; }
.date { opacity:0.9 }
.post-title { font-size: 18px; font-weight: 700; display:block; text-decoration:none; color:#333; margin: 12px 12px 0; }
.post-desc { color: #666; margin: 6px 12px 0; }
.post-meta { margin: 10px 12px 12px; }
.meta-tag { margin-right: 8px; }
.clickable { cursor: pointer; }
</style>
