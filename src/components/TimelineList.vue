<template>
  <el-timeline>
    <el-timeline-item
      v-for="p in posts"
      :key="p.slug"
      :timestamp="formatDate(p.data.date)"
      placement="top"
    >
      <a :href="`/posts/${p.slug}`" data-pjax class="title">{{ p.data.title }}</a>
      <div v-if="p.data.description" class="desc">{{ p.data.description }}</div>
      <div class="tags" v-if="p.data.tags?.length">
        <el-tag v-for="t in p.data.tags" :key="t" size="small" effect="plain" class="clickable" @click="onTag(t)">{{ t }}</el-tag>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import { ElTimeline, ElTimelineItem, ElTag } from 'element-plus'

type Post = { slug: string; data: { title: string; description?: string; date: string; tags?: string[]; category?: string } }
const { posts } = defineProps<{ posts: Post[] }>()

function formatDate(d: string) { return new Date(d).toLocaleDateString() }

function onTag(t: string) {
  const href = `/tags/${t}`
  const nav = (window as any).pjaxNavigate
  if (typeof nav === 'function') nav(href)
  else window.location.href = href
}
</script>

<style scoped>
.title { font-weight: 700; font-size: 16px; text-decoration: none; color: #333; }
.title:hover { color: #409eff; }
.desc { color:#666; margin-top:6px; }
.tags { margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; }
.clickable { cursor: pointer; }
</style>
