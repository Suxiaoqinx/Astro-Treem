<template>
  <div class="sidebar">
    <el-card class="profile-card" shadow="hover">
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
        
      </div>
    </el-card>

    

    <el-card v-if="headings?.length" class="block-card toc-card" shadow="hover">
      <div class="section-title">目录</div>
      <ul class="toc-list">
        <li v-for="h in headings" :key="h.slug">
          <a :href="`#${h.slug}`" class="toc-link" :style="{ marginLeft: `${(h.depth - 2) * 12}px` }">{{ h.text }}</a>
        </li>
      </ul>
    </el-card>

    <el-card v-if="hotTags?.length" class="block-card" shadow="hover">
      <div class="section-title">热门标签</div>
      <div class="section-list">
        <a v-for="t in hotTags" :key="t.name" :href="`/tags/${t.name}`" data-pjax class="item-link">
          <el-tag size="small" effect="plain">{{ t.name }}（{{ t.count }}）</el-tag>
        </a>
      </div>
    </el-card>

    <el-card v-if="recommendations?.length" class="block-card" shadow="hover">
      <div class="section-title">推荐文章</div>
      <ul class="rec-list">
        <li v-for="r in recommendations" :key="r.slug"><a :href="`/posts/${r.slug}`" data-pjax class="rec-link">{{ r.title }}</a></li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElAvatar, ElTag } from 'element-plus'

defineProps<{
  name: string
  description?: string
  avatar: string
  counts: { posts: number; tags: number }
  headings?: { slug: string; text: string; depth: number }[]
  hotTags?: { name: string; count: number }[]
  recommendations?: { slug: string; title: string }[]
}>()
</script>

<style scoped>
.sidebar { position: sticky; top: 24px; display:flex; flex-direction:column; gap:16px; }
.profile { display:flex; align-items:center; gap:12px; }
.info { display:flex; flex-direction:column; }
.name { font-weight:700; font-size:16px; }
.desc { color:#666; margin-top:4px; font-size:13px; }
.stats { display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; margin-top:14px; }
.stat { background:#f5f7fa; border-radius:10px; padding:10px 8px; text-align:center; }
.label { color:#666; font-size:12px; }
.value { display:block; font-weight:700; font-size:18px; margin-top:4px; }
.block-card { border-radius: 16px; }
.section-title { font-weight:700; font-size:14px; margin-bottom:8px; }
.section-list { display:flex; gap:8px; flex-wrap:wrap; }
.item-link { text-decoration:none; }
.rec-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; }
.rec-link { text-decoration:none; color:#333; }
.rec-link:hover { color:#409eff; }
.toc-card .toc-list { list-style:none; padding:0; margin:0; }
.toc-card .toc-list li { margin:6px 0; }
.toc-card .toc-link { text-decoration:none; color:#409eff; }
.toc-card .toc-link:hover { text-decoration:underline; }
</style>
