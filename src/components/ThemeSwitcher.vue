<template>
  <Teleport to="body">
    <div class="fab-btn" @click="openSettings" title="布局设置">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'

const props = defineProps<{
  showModeSwitch?: boolean
  onModeChange?: (mode: 'list' | 'grid') => void
  currentMode?: 'list' | 'grid'
}>()

const mode = ref<'list' | 'grid'>(props.currentMode || 'list')
const themeStyle = ref<'default' | 'style-1' | 'style-2' | 'style-3'>('default')
let notifyInstance: any = null

function setMode(m: 'list' | 'grid') {
  mode.value = m
  if (props.onModeChange) {
    props.onModeChange(m)
  }
}

function setThemeStyle(s: 'default' | 'style-1' | 'style-2' | 'style-3') {
  themeStyle.value = s
  localStorage.setItem('theme-style', s)
  
  // Remove all theme classes first
  document.body.classList.remove('theme-style-1', 'theme-style-2', 'theme-style-3')
  
  // Add the active theme class if not default
  if (s !== 'default') {
    document.body.classList.add(`theme-${s}`)
  }
  
  window.dispatchEvent(new CustomEvent('theme-style-change', { detail: s }))
}

function openSettings() {
  if (notifyInstance) {
    notifyInstance.close()
  }

  const content = []

  if (props.showModeSwitch) {
    content.push(h('div', { class: 'switcher-title' }, '显示模式'))
    content.push(h('div', { class: 'mode-switch' }, [
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
    ]))
  }

  content.push(h('div', { class: 'switcher-title', style: props.showModeSwitch ? 'margin-top: 12px' : '' }, '主题样式'))
  content.push(h('div', { class: 'mode-switch' }, [
    h('div', { 
      class: `mode-btn ${themeStyle.value === 'default' ? 'active' : ''}`,
      onClick: () => { 
        setThemeStyle('default')
        if (notifyInstance) notifyInstance.close()
        ElMessage.success('已切换到默认样式')
      },
      title: '默认样式'
    }, [
      h('span', {}, '默认')
    ]),
    h('div', {
      class: `mode-btn ${themeStyle.value === 'style-1' ? 'active' : ''}`,
      onClick: () => { 
        setThemeStyle('style-1')
        if (notifyInstance) notifyInstance.close()
        ElMessage.success('已切换到样式1')
      },
      title: '样式1'
    }, [
      h('span', {}, '样式1')
    ]),
    h('div', {
      class: `mode-btn ${themeStyle.value === 'style-2' ? 'active' : ''}`,
      onClick: () => { 
        setThemeStyle('style-2')
        if (notifyInstance) notifyInstance.close()
        ElMessage.success('已切换到样式2')
      },
      title: '样式2'
    }, [
      h('span', {}, '样式2')
    ]),
    h('div', {
      class: `mode-btn ${themeStyle.value === 'style-3' ? 'active' : ''}`,
      onClick: () => { 
        setThemeStyle('style-3')
        if (notifyInstance) notifyInstance.close()
        ElMessage.success('已切换到样式3')
      },
      title: '样式3'
    }, [
      h('span', {}, '样式3')
    ])
  ]))

  notifyInstance = ElNotification({
    title: '布局设置',
    dangerouslyUseHTMLString: true,
    position: 'bottom-right',
    duration: 0,
    message: h('div', { class: 'layout-switcher-box' }, content),
    onClose: () => {
      notifyInstance = null
    }
  })
}

onMounted(() => {
  if (props.currentMode) {
    mode.value = props.currentMode
  }
  
  const savedStyle = localStorage.getItem('theme-style') as any
  if (['default', 'style-1', 'style-2', 'style-3'].includes(savedStyle)) {
    themeStyle.value = savedStyle
    
    // Remove all first
    document.body.classList.remove('theme-style-1', 'theme-style-2', 'theme-style-3')
    
    // Add active
    if (savedStyle !== 'default') {
      document.body.classList.add(`theme-${savedStyle}`)
    }
  }
})
</script>

<style scoped>
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
</style>
