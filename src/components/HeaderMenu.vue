<template>
  <nav class="header-nav">
    <div class="nav-list-card">
      <a href="/friends" class="nav-item">
        <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 20a8 8 0 0 1 16 0" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
        友链
      </a>
      <a href="/archives" class="nav-item">
        <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M4 7h16v3H4zM6 10v9h12v-9" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
        归档
      </a>
      <a href="/donate" class="nav-item">
        <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.35-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.65-7 9-7 9Z" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
        赞助
      </a>
      <a href="/talks" class="nav-item">
        <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v10H7l-3 4V5Z" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
        说说
      </a>
      <a href="/about" class="nav-item">
        <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-9v5M12 8h.01" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
        关于
      </a>
      <a href="#" class="nav-item" data-search-trigger="1">
        <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm9-1-4.35-4.35" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        搜索
      </a>
    </div>
    <button id="nav-search-button" class="icon-btn search" aria-label="搜索">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm9-1-4.35-4.35" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button id="nav-menu-button" class="icon-btn menu" aria-label="打开抽屉" @click="openDrawer">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#333" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
    <DrawerDemo ref="drawerRef" />
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DrawerDemo from './DrawerDemo.vue'
const drawerRef = ref<InstanceType<typeof DrawerDemo> | null>(null)
function openDrawer(){ drawerRef.value?.open() }
</script>

<style scoped>
.header-nav { margin-left:auto; display:flex; align-items:center;}
.nav-list-card { display:flex; align-items:center; gap:6px; background:#f5f7fa; border:1px solid #e5e7eb; border-radius:12px; padding:6px 8px; }
.nav-item { display:inline-flex; align-items:center; gap:8px; padding:8px 10px; text-decoration:none; color:#374151; border-radius:10px; }
.nav-item:hover { background:#eef2ff; color:#4f46e5; }
.icon { width:16px; height:16px; }
.icon-btn { width: 36px; height: 36px; display:inline-flex; align-items:center; justify-content:center; border:none; background:transparent; cursor:pointer; border-radius:8px; }
.icon-btn:hover { background:#f5f7fa; }
.icon-btn.menu { display: none; }
.icon-btn.search { display: none; }
@media (max-width: 900px) {
  .nav-list-card { display: none; }
  .icon-btn.menu { display: inline-flex; }
  .icon-btn.search { display: inline-flex; }
}
</style>
