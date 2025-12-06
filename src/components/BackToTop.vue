<template>
  <el-backtop :right="30" :bottom="30" :visibility-height="50" class="custom-backtop">
    <div class="backtop-content">
      <svg class="progress-ring" width="100%" height="100%" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" stroke="#eee" stroke-width="2" fill="none" />
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          stroke="#409eff" 
          stroke-width="2" 
          fill="none" 
          stroke-linecap="round"
          :stroke-dasharray="circumference" 
          :stroke-dashoffset="dashOffset" 
          transform="rotate(-90 20 20)"
        />
      </svg>
      <div class="arrow-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </el-backtop>
</template>

<script setup lang="ts">
import { ElBacktop } from 'element-plus'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const radius = 18
const circumference = 2 * Math.PI * radius
const progress = ref(0)

const dashOffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) {
    progress.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
  }
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.custom-backtop {
  --el-backtop-bg-color: #fff;
  --el-backtop-text-color: #409eff;
  --el-backtop-hover-bg-color: #f2f6fc;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  padding: 0; /* Reset padding */
  overflow: hidden;
}
.backtop-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  color: #409eff;
}
.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.arrow-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
