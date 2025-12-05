<template>
  <div class="wl-card">
    <div class="wl-title">评论</div>
    <div id="sodesu"></div> 
  </div>
</template>

<!-- 把 link 标签移到 public/index.html 或 index.html 中，Vue 单文件组件里不能写 link -->

<script setup lang="ts">
import { onMounted } from 'vue'
import { siteConfig } from 'src/site.config'

onMounted(async () => {
  const serverURL = siteConfig?.comments?.serverURL || ''
  const mountEl = document.getElementById('sodesu')
  try {
    const { init } = await import('sodesu-comment/aio')
    if (!serverURL) throw new Error('Missing serverURL')
    init({ el: '#sodesu', serverURL })
  } catch (e) {
    if (mountEl) {
      mountEl.innerHTML = '<div class="wl-empty">评论服务未连接或被阻止，请稍后再试。</div>'
    }
    console.warn('[comments] init failed:', e)
  }
})
</script>

<style scoped>
.wl-card { margin: 16px 0; padding: 0; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; }
.wl-title { font-weight: 800; font-size: 16px; padding: 12px 16px; border-bottom: 1px solid #f0f2f5; }
.wl-empty { padding: 12px 16px; color: #6b7280; font-size: 13px; }
#sodesu, [id="sodesu"] { padding: 12px 12px; }
@media (max-width: 640px) { #sodesu, [id="sodesu"] { padding: 10px 10px; } }
</style>

