<template>
  <div class="post-list-wrapper">
    <div class="simple-list" :class="{ 'grid-mode': mode === 'grid' }">
      <PostCard
        v-for="p in posts"
        :key="p.slug"
        v-bind="p"
        :mode="mode"
        @tagClick="onTagClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PostCard from './PostCard.vue'

const props = defineProps<{
  posts: any[]
}>()

// Initialize mode from localStorage immediately if available
const getInitialMode = () => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('post-list-mode')
    if (saved === 'list' || saved === 'grid') return saved
  }
  return 'list'
}

const mode = ref<'list' | 'grid'>(getInitialMode())

function setMode(m: 'list' | 'grid') {
  mode.value = m
  localStorage.setItem('post-list-mode', m)
}

function handleModeChange(e: Event) {
  const customEvent = e as CustomEvent
  if (customEvent.detail) {
    setMode(customEvent.detail)
  }
}

function onTagClick(tag: string) {
  const url = `/tags/${tag}`
  if ((window as any).swup) {
    (window as any).swup.navigate(url)
  } else {
    window.location.href = url
  }
}

onMounted(() => {
  window.addEventListener('layout-mode-change', handleModeChange)
  
  // Re-check in onMounted just in case
  const saved = localStorage.getItem('post-list-mode')
  if (saved === 'list' || saved === 'grid') {
    mode.value = saved
  }
  
  // Sync with switcher
  window.dispatchEvent(new CustomEvent('layout-mode-sync', { detail: mode.value }))
})

onUnmounted(() => {
  window.removeEventListener('layout-mode-change', handleModeChange)
})
</script>

<style scoped>
.post-list-wrapper { display: flex; flex-direction: column; gap: 10px; position: relative; }
.simple-list { display: flex; flex-direction: column; gap: 10px; }
.simple-list.grid-mode { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
</style>
