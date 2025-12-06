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

    <ThemeSwitcher 
      :showModeSwitch="true" 
      :currentMode="mode"
      :onModeChange="setMode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PostCard from './PostCard.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

const props = defineProps<{
  posts: any[]
}>()

const mode = ref<'list' | 'grid'>('list')

function setMode(m: 'list' | 'grid') {
  mode.value = m
  localStorage.setItem('post-list-mode', m)
}

function onTagClick(tag: string) {
  window.location.href = `/tags/${tag}`
}

onMounted(() => {
  const saved = localStorage.getItem('post-list-mode')
  if (saved === 'list' || saved === 'grid') {
    mode.value = saved
  }
})
</script>

<style scoped>
.post-list-wrapper { display: flex; flex-direction: column; gap: 16px; position: relative; }
.simple-list { display: flex; flex-direction: column; gap: 10px; }
.simple-list.grid-mode { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
</style>
