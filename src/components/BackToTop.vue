<template>
  <el-backtop :right="30" :bottom="30" class="custom-backtop">
    <div class="backtop-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </el-backtop>
</template>

<script setup lang="ts">
import { ElBacktop } from 'element-plus'
</script>

<style scoped>
.custom-backtop {
  --el-backtop-bg-color: #fff;
  --el-backtop-text-color: #409eff;
  --el-backtop-hover-bg-color: #f2f6fc;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
}
.backtop-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  color: #409eff;
}
</style>
