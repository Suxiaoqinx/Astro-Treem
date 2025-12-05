<template>
  <el-card shadow="hover" class="post-card" @click="onCardClick">
    <div :class="['card-body', bodyClass]">
      <div v-if="showMedia" class="media">
        <img :src="cover as string" alt="cover" loading="lazy" />
      </div>
      <div class="content">
        <div v-if="top" class="pin-top">置顶</div>
        <a :href="href" class="post-title">{{ title }}</a>
        <div class="post-desc" v-if="description">{{ description }}</div>
        <div class="post-meta">
          <el-tag type="danger" size="small" effect="dark" class="meta-date">{{ dateStr }}</el-tag>
          <el-tag v-for="t in displayTags" :key="t" class="meta-tag clickable" @click.stop="onTagClick(t)">{{ t }}</el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElTag } from 'element-plus'

const { title, description, date, tags, slug, cover, side, showCover, top } = defineProps<{
  title: string
  description?: string
  date: string
  tags: string[]
  slug: string
  cover?: string
  side?: 'left' | 'right'
  showCover?: boolean
  top?: boolean
}> ()

const emit = defineEmits<{ (e: 'tagClick', tag: string): void }>()

function onTagClick(t: string) {
  const url = `/tags/${t}`
  window.location.href = url
}

function onCardClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('a')) return
  const url = href.value
  window.location.href = url
}

const dateStr = computed(() => new Date(date).toLocaleDateString())
const href = computed(() => `/posts/${slug}`)
const showMedia = computed(() => !!cover && ((showCover ?? true) === true))
const bodyClass = computed(() => (showMedia.value ? (side === 'right' ? 'row-reverse' : 'row') : 'single'))
const displayTags = computed(() => (tags ?? []).slice(0, 4))
</script>

<style scoped>
.post-card { border-radius: 16px; overflow: hidden; cursor: pointer; position: relative; }
.card-body { display:flex; gap:12px; padding: 12px; align-items: center; }
.card-body.row { flex-direction: row; }
.card-body.row-reverse { flex-direction: row-reverse; }
.card-body.single { display:block; padding: 12px; }
.media { flex: 0 0 250px; }
.media img { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; }
.content { flex: 1; display:grid; grid-template-rows: auto 1fr auto; gap: 6px; min-height: 120px; }
.post-title { font-size: 18px; font-weight: 700; display:block; text-decoration:none; color:#333; margin: 0; }
.post-desc { color: #666; margin: 0; align-self: start; }
.post-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.post-meta { margin: 0; padding-top: 10px; border-top: 1px solid #f0f2f5; display:flex; align-items:center; flex-wrap:wrap; gap:8px; }
.meta-date { color:#ffffff; font-size:12px; }
.meta-tag { margin-right: 8px; }
.clickable { cursor: pointer; }

.pin-top { position:absolute; left:12px; top:12px; background:#f5f7fa; color:#374151; border:1px solid #e5e7eb; border-radius:8px; padding:4px 8px; font-size:12px; font-weight:700; box-shadow:0 4px 12px rgba(0,0,0,.06); }

@media (max-width: 768px) {
  .card-body.row, .card-body.row-reverse { flex-direction: column; }
  .media { flex: 0 0 100%; }
  .media img { width: 100%; height: auto; aspect-ratio: 16 / 9; border-radius: 14px; object-fit: cover; }
}
</style>
