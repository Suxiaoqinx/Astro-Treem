<template>
  <div class="drawer-demo">
    <el-drawer v-model="visible" title="站点导航" direction="rtl" size="320px" :with-header="true">
      <div class="drawer-content">
        <div class="drawer-title">{{ siteConfig.title }}</div>
        <div class="nav-card">
          <el-link href="/friends" class="menu-link" :underline="false">
            <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 20a8 8 0 0 1 16 0" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
            <span>友链</span>
          </el-link>
          <el-link href="/archives" class="menu-link" :underline="false">
            <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M4 7h16v3H4zM6 10v9h12v-9" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
            <span>归档</span>
          </el-link>
          <el-link href="/donate" class="menu-link" :underline="false">
            <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.35-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.65-7 9-7 9Z" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
            <span>赞助</span>
          </el-link>
          <el-link href="/talks" class="menu-link" :underline="false">
            <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v10H7l-3 4V5Z" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
            <span>说说</span>
          </el-link>
          <el-link href="/about" class="menu-link" :underline="false">
            <svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-9v5M12 8h.01" stroke="#7b8a9b" stroke-width="2" stroke-linecap="round"/></svg>
            <span>关于</span>
          </el-link>
        </div>
      </div>
    </el-drawer>
  </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElDrawer, ElLink } from 'element-plus'
import { siteConfig } from '../site.config'

const visible = ref(false)
function open() { visible.value = true }
defineExpose({ open })
</script>

<style scoped>
.drawer-content { display:flex; flex-direction:column; gap:12px; }
.drawer-title { font-weight:800; font-size:18px; background:#f5f7fa; border:1px solid #e5e7eb; border-radius:12px; padding:12px; text-align:center; color:#374151; }
.nav-card { background:#f5f7fa; border:1px solid #e5e7eb; border-radius:12px; padding:8px; display:flex; flex-direction:column; }
.nav-card { align-items: stretch; }
.menu-link { display:flex; align-items:center; justify-content:flex-start; gap:12px; padding:12px 14px; text-decoration:none; color:#4b5563; font-size:16px; }
.menu-link:focus { outline: none; }
:deep(.el-link), :deep(.el-link__inner) { text-decoration: none !important; }
:deep(.el-link.is-underline .el-link__inner) { border-bottom: none !important; }
/* 移动端点击蓝色高亮 */
.menu-link { -webkit-tap-highlight-color: transparent; }
:deep(.el-link), :deep(.el-link__inner) { -webkit-tap-highlight-color: transparent; }
.menu-link:active { background-color: transparent; }
.menu-link:hover { color:#1f2937; }
.icon { width:20px; height:20px; flex:0 0 auto; }
</style>
