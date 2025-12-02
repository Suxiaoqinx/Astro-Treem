<template>
  <div>
    <div style="display:flex; gap:12px; align-items:center;">
      <el-select v-model="selected" placeholder="选择标签" clearable style="width: 220px;">
        <el-option v-for="t in allTags" :key="t" :label="t" :value="t" />
      </el-select>
      <el-radio-group v-model="mode" size="small">
        <el-radio-button label="list">列表</el-radio-button>
        <el-radio-button label="grid">网格</el-radio-button>
      </el-radio-group>
    </div>
    <div :class="['cards', mode]">
      <PostCard
        v-for="p in filtered"
        :key="p.slug"
        :title="p.data.title"
        :description="p.data.description"
        :date="p.data.date"
        :tags="p.data.tags"
        :slug="p.slug"
        :cover="p.data.cover"
        :side="p.data.coverSide"
        :showCover="mode === 'list'"
        @tagClick="onTagClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElSelect, ElOption, ElRadioGroup, ElRadioButton } from 'element-plus'
import PostCard from './PostCard.vue'

type Post = {
  slug: string
  data: { title: string; description?: string; date: string; tags: string[]; category?: string; cover?: string; coverSide?: 'left' | 'right' }
}

const props = defineProps<{ posts: Post[] }>()

const selected = ref<string | ''>('')
const mode = ref<'list' | 'grid'>('list')
const allTags = computed(() => {
  const set = new Set<string>()
  props.posts.forEach((p) => p.data.tags?.forEach((t) => set.add(t)))
  return Array.from(set).sort()
})

const filtered = computed(() => {
  if (!selected.value) return props.posts
  return props.posts.filter((p) => p.data.tags?.includes(selected.value as string))
})

function onTagClick(tag: string) {
  selected.value = tag
}
</script>

<style scoped>
.cards { display: grid; gap: 16px; margin-top: 16px; }
.cards.grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.cards.list { grid-template-columns: 1fr; }
</style>
