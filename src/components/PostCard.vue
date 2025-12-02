<template>
  <el-card shadow="hover" class="post-card">
    <div :class="['card-body', bodyClass]">
      <div v-if="showMedia" class="media">
        <img :src="cover as string" alt="cover" />
      </div>
      <div class="content">
        <a :href="href" data-ajax="post" class="post-title">{{ title }}</a>
        <div class="post-desc" v-if="description">{{ description }}</div>
        <div class="post-meta">
          <el-tag type="danger" size="small" effect="dark" class="meta-date">{{ dateStr }}</el-tag>
          <el-tag v-for="t in tags" :key="t" class="meta-tag clickable" @click="onTagClick(t)">{{ t }}</el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElTag } from 'element-plus'

const { title, description, date, tags, slug, cover, side, showCover } = defineProps<{
  title: string
  description?: string
  date: string
  tags: string[]
  slug: string
  cover?: string
  side?: 'left' | 'right'
  showCover?: boolean
}> ()

const emit = defineEmits<{ (e: 'tagClick', tag: string): void }>()
function onTagClick(t: string) { emit('tagClick', t) }

const dateStr = computed(() => new Date(date).toLocaleDateString())
const href = computed(() => `/posts/${slug}`)
const showMedia = computed(() => !!cover && ((showCover ?? true) === true))
const bodyClass = computed(() => (showMedia.value ? (side === 'right' ? 'row-reverse' : 'row') : 'single'))
</script>

<style scoped>
.post-card { border-radius: 16px; overflow: hidden; }
.card-body { display:flex; gap:12px; padding: 12px; align-items: center; }
.card-body.row { flex-direction: row; }
.card-body.row-reverse { flex-direction: row-reverse; }
.card-body.single { display:block; padding: 12px; }
.media { max-width: 30%; }
.media img { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; }
.content { flex: 1; }
.post-title { font-size: 18px; font-weight: 700; display:block; text-decoration:none; color:#333; margin: 0 0 0; }
.post-desc { color: #666; margin: 6px 0 0; }
.post-meta { margin: 10px 0 0; display:flex; align-items:center; flex-wrap:wrap; gap:8px; }
.meta-date { color:#ffffff; font-size:12px; }
.meta-tag { margin-right: 8px; }
.clickable { cursor: pointer; }
</style>
