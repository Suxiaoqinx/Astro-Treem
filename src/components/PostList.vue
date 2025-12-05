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

    <Teleport to="body">
      <div class="fab-btn" @click="openSettings" title="布局设置">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
import PostCard from './PostCard.vue'

const props = defineProps<{
  posts: any[]
}>()

const mode = ref<'list' | 'grid'>('list')
let notifyInstance: any = null

function setMode(m: 'list' | 'grid') {
  mode.value = m
  localStorage.setItem('post-list-mode', m)
}

function openSettings() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = ElNotification({
    title: '列表布局',
    dangerouslyUseHTMLString: true,
    position: 'bottom-right',
    duration: 0, // keep open until user clicks
    message: h('div', { class: 'layout-switcher-box' }, [
      h('div', { class: 'switcher-title' }, '切换显示模式'),
      h('div', { class: 'mode-switch' }, [
        h('div', { 
          class: `mode-btn ${mode.value === 'list' ? 'active' : ''}`,
          onClick: () => { 
            setMode('list')
            if (notifyInstance) notifyInstance.close()
            ElMessage.success('已切换到列表模式')
          },
          title: '列表模式'
        }, [
          h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
            h('line', { x1: '8', y1: '6', x2: '21', y2: '6' }),
            h('line', { x1: '8', y1: '12', x2: '21', y2: '12' }),
            h('line', { x1: '8', y1: '18', x2: '21', y2: '18' }),
            h('line', { x1: '3', y1: '6', x2: '3.01', y2: '6' }),
            h('line', { x1: '3', y1: '12', x2: '3.01', y2: '12' }),
            h('line', { x1: '3', y1: '18', x2: '3.01', y2: '18' })
          ]),
          h('span', { style: 'margin-left: 4px' }, '列表')
        ]),
        h('div', {
          class: `mode-btn ${mode.value === 'grid' ? 'active' : ''}`,
          onClick: () => { 
            setMode('grid')
            if (notifyInstance) notifyInstance.close()
            ElMessage.success('已切换到网格模式')
          },
          title: '网格模式'
        }, [
          h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
            h('rect', { x: '3', y: '3', width: '7', height: '7' }),
            h('rect', { x: '14', y: '3', width: '7', height: '7' }),
            h('rect', { x: '14', y: '14', width: '7', height: '7' }),
            h('rect', { x: '3', y: '14', width: '7', height: '7' })
          ]),
          h('span', { style: 'margin-left: 4px' }, '网格')
        ])
      ])
    ]),
    onClose: () => {
      notifyInstance = null
    }
  })
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
.fab-btn {
  position: fixed;
  bottom: 80px;
  right: 30px;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #409eff;
  z-index: 999;
  transition: all 0.3s;
}
.fab-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); background-color: #f2f6fc; }

@media (max-width: 768px) {
  .fab-btn { display: none; }
}

.simple-list { display: flex; flex-direction: column; gap: 10px; }
.simple-list.grid-mode { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
</style>
