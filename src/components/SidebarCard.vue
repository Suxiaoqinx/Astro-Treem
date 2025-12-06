<template>
  <div class="sidebar" :class="{ 'sidebar-split': isStyle3 }">
    <template v-if="isStyle3">
      <div class="sidebar-left-col fade-up">
        <el-card class="profile-card" shadow="hover">
          <div class="profile">
            <el-avatar :src="avatar" :size="72" />
            <div class="info">
              <div class="name">{{ name }}</div>
              <div class="desc">{{ displayDesc }}</div>
            </div>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="label">文章</span>
              <span class="value">{{ counts.posts }}</span>
            </div>
            <div class="stat">
              <span class="label">标签</span>
              <span class="value">{{ counts.tags }}</span>
            </div>
          </div>
          
          <div class="social-links">
            <a href="https://github.com/Suxiaoqinx" target="_blank" class="social-item" title="Github">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://space.bilibili.com/9372624" target="_blank" class="social-item" title="Bilibili">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M8 2l2 2"></path><path d="M16 2l-2 2"></path><path d="M9 12v.01"></path><path d="M15 12v.01"></path></svg>
            </a>
          </div>
        </el-card>

        <el-card class="block-card todo-card" shadow="hover">
          <div class="section-title">待办事项</div>
          <div class="todo-list">
            <div v-for="(item, index) in visibleTodos" :key="index" class="todo-item" :class="{ done: item.done }">
              <div class="checkbox-custom">
                 <svg v-if="item.done" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span class="todo-text">{{ item.text }}</span>
            </div>
            <div v-if="visibleTodoCount < todos.length" class="load-more-container">
              <el-button link type="primary" size="small" @click="loadMoreTodos">加载更多</el-button>
            </div>
          </div>
        </el-card>

        <el-card class="block-card time-card" shadow="hover">
          <div class="section-title">时光流逝</div>
          <div class="time-list">
            <div v-for="(item, index) in timeStats" :key="index" class="time-item">
              <div class="time-label">{{ item.label }} <span class="time-value" :style="{ color: item.color }">{{ item.value }}{{ item.unit }}</span></div>
              <el-progress 
                :percentage="item.percent" 
                :color="item.color" 
                :stroke-width="10" 
                striped 
                striped-flow 
                :duration="20"
              />
            </div>
          </div>
        </el-card>
      </div>

      <div class="sidebar-right-col fade-up">
        <el-card v-if="notice" class="block-card notice-card" shadow="hover">
          <div class="section-title">公告</div>
          <div class="notice-content">{{ notice }}</div>
        </el-card>

        <el-card v-if="headingsState?.length" class="block-card toc-card" shadow="hover">
          <div class="section-title">目录</div>
          <el-anchor :offset="80" class="custom-anchor">
            <el-anchor-link 
              v-for="h in headingsState" 
              :key="h.slug" 
              :href="`#${h.slug}`" 
              :title="h.text"
              :class="`toc-depth-${h.depth}`"
            />
          </el-anchor>
        </el-card>

        <el-card v-if="hotTags?.length" class="block-card hot-tags-card" shadow="hover">
          <div class="section-title">热门标签</div>
          <div class="section-list">
            <a v-for="t in visibleTags" :key="t.name" :href="`/tags/${t.name}`" class="item-link">
              <el-tag size="small" effect="plain">{{ t.name }}（{{ t.count }}）</el-tag>
            </a>
          </div>
          <div v-if="visibleTagLimit < (hotTags?.length || 0)" class="load-more-container">
              <el-button link type="primary" size="small" @click="loadMoreTags">加载更多</el-button>
          </div>
        </el-card>

        <el-card class="block-card route-card" shadow="hover">
          <div class="section-header">
            <div class="section-title">线路切换</div>
            <el-button link type="primary" size="small" @click="refreshLatencies">手动测试</el-button>
          </div>
          <div class="routes">
            <a href="https://blog.toubiec.cn" class="route-link" :class="{ active: currentLine === 'cn' }">
              <span class="rt-label">EdgeOne CN</span>
              <span class="rt-latency" :class="latencyClass('cn')">{{ latencyText('cn') }}</span>
              <span class="rt-dot" :class="dotClass('cn')"></span>
            </a>
            <a href="https://vercel-blog.toubiec.cn" class="route-link" :class="{ active: currentLine === 'vercel' }">
              <span class="rt-label">Vercel</span>
              <span class="rt-latency" :class="latencyClass('vercel')">{{ latencyText('vercel') }}</span>
              <span class="rt-dot" :class="dotClass('vercel')"></span>
            </a>
            <a href="https://netlify-blog.toubiec.cn" class="route-link" :class="{ active: currentLine === 'netlify' }">
              <span class="rt-label">Netlify</span>
              <span class="rt-latency" :class="latencyClass('netlify')">{{ latencyText('netlify') }}</span>
              <span class="rt-dot" :class="dotClass('netlify')"></span>
            </a>
            <a href="https://cf-blog.toubiec.cn" class="route-link" :class="{ active: currentLine === 'Cloudflare' }">
              <span class="rt-label">Cloudflare</span>
              <span class="rt-latency" :class="latencyClass('Cloudflare')">{{ latencyText('Cloudflare') }}</span>
              <span class="rt-dot" :class="dotClass('Cloudflare')"></span>
            </a>
            <a href="http://localhost:4321" class="route-link" :class="{ active: currentLine === 'dev' }">
              <span class="rt-label">Dev</span>
              <span class="rt-latency" :class="latencyClass('dev')">{{ latencyText('dev') }}</span>
              <span class="rt-dot" :class="dotClass('dev')"></span>
            </a>
          </div>
        </el-card>

        <el-card v-if="recommendations?.length" class="block-card recommend-card" shadow="hover">
          <div class="section-title">推荐文章</div>
          <ul class="rec-list">
            <li v-for="(r, i) in visibleRecs" :key="r.slug" class="rec-item">
              <span class="rec-index">{{ i + 1 }}</span>
              <a :href="`/posts/${r.slug}`" class="rec-link">{{ r.title }}</a>
              <span v-if="r.date" class="rec-date">{{ formatDate(r.date as any) }}</span>
            </li>
          </ul>
          <div v-if="visibleRecLimit < (recommendations?.length || 0)" class="load-more-container">
              <el-button link type="primary" size="small" @click="loadMoreRecs">加载更多</el-button>
          </div>
        </el-card>
      </div>
    </template>

    <div v-else class="sidebar-content fade-up">
      <el-card class="profile-card" shadow="hover">
        <div class="profile">
          <el-avatar :src="avatar" :size="72" />
          <div class="info">
            <div class="name">{{ name }}</div>
            <div class="desc">{{ displayDesc }}</div>
          </div>
        </div>
        <div class="stats">
          <div class="stat">
            <span class="label">文章</span>
            <span class="value">{{ counts.posts }}</span>
          </div>
          <div class="stat">
            <span class="label">标签</span>
            <span class="value">{{ counts.tags }}</span>
          </div>
        </div>
        
        <div class="social-links">
          <a href="https://github.com/Suxiaoqinx" target="_blank" class="social-item" title="Github">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="https://space.bilibili.com/9372624" target="_blank" class="social-item" title="Bilibili">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M8 2l2 2"></path><path d="M16 2l-2 2"></path><path d="M9 12v.01"></path><path d="M15 12v.01"></path></svg>
          </a>
        </div>
      </el-card>

      <el-card class="block-card todo-card" shadow="hover">
        <div class="section-title">待办事项</div>
        <div class="todo-list">
          <div v-for="(item, index) in visibleTodos" :key="index" class="todo-item" :class="{ done: item.done }">
            <div class="checkbox-custom">
               <svg v-if="item.done" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="todo-text">{{ item.text }}</span>
          </div>
          <div v-if="visibleTodoCount < todos.length" class="load-more-container">
            <el-button link type="primary" size="small" @click="loadMoreTodos">加载更多</el-button>
          </div>
        </div>
      </el-card>

      <el-card class="block-card time-card" shadow="hover">
        <div class="section-title">时光流逝</div>
        <div class="time-list">
          <div v-for="(item, index) in timeStats" :key="index" class="time-item">
            <div class="time-label">{{ item.label }} <span class="time-value" :style="{ color: item.color }">{{ item.value }}{{ item.unit }}</span></div>
            <el-progress 
              :percentage="item.percent" 
              :color="item.color" 
              :stroke-width="10" 
              striped 
              striped-flow 
              :duration="20"
            />
          </div>
        </div>
      </el-card>
      
      <el-card v-if="notice" class="block-card notice-card" shadow="hover">
        <div class="section-title">公告</div>
        <div class="notice-content">{{ notice }}</div>
      </el-card>

      <el-card v-if="headingsState?.length" class="block-card toc-card" shadow="hover">
        <div class="section-title">目录</div>
        <el-anchor :offset="80" class="custom-anchor">
          <el-anchor-link 
            v-for="h in headingsState" 
            :key="h.slug" 
            :href="`#${h.slug}`" 
            :title="h.text"
            :class="`toc-depth-${h.depth}`"
          />
        </el-anchor>
      </el-card>

      <el-card v-if="hotTags?.length" class="block-card hot-tags-card" shadow="hover">
        <div class="section-title">热门标签</div>
        <div class="section-list">
          <a v-for="t in visibleTags" :key="t.name" :href="`/tags/${t.name}`" class="item-link">
            <el-tag size="small" effect="plain">{{ t.name }}（{{ t.count }}）</el-tag>
          </a>
        </div>
        <div v-if="visibleTagLimit < (hotTags?.length || 0)" class="load-more-container">
            <el-button link type="primary" size="small" @click="loadMoreTags">加载更多</el-button>
        </div>
      </el-card>

      <el-card class="block-card route-card" shadow="hover">
        <div class="section-header">
          <div class="section-title">线路切换</div>
          <el-button link type="primary" size="small" @click="refreshLatencies">手动测试</el-button>
        </div>
        <div class="routes">
          <a href="https://blog.toubiec.cn" class="route-link" :class="{ active: currentLine === 'cn' }">
            <span class="rt-label">EdgeOne CN</span>
            <span class="rt-latency" :class="latencyClass('cn')">{{ latencyText('cn') }}</span>
            <span class="rt-dot" :class="dotClass('cn')"></span>
          </a>
          <a href="https://vercel-blog.toubiec.cn" class="route-link" :class="{ active: currentLine === 'vercel' }">
            <span class="rt-label">Vercel</span>
            <span class="rt-latency" :class="latencyClass('vercel')">{{ latencyText('vercel') }}</span>
            <span class="rt-dot" :class="dotClass('vercel')"></span>
          </a>
          <a href="https://netlify-blog.toubiec.cn" class="route-link" :class="{ active: currentLine === 'netlify' }">
            <span class="rt-label">Netlify</span>
            <span class="rt-latency" :class="latencyClass('netlify')">{{ latencyText('netlify') }}</span>
            <span class="rt-dot" :class="dotClass('netlify')"></span>
          </a>
          <a href="https://cf-blog.toubiec.cn" class="route-link" :class="{ active: currentLine === 'Cloudflare' }">
            <span class="rt-label">Cloudflare</span>
            <span class="rt-latency" :class="latencyClass('Cloudflare')">{{ latencyText('Cloudflare') }}</span>
            <span class="rt-dot" :class="dotClass('Cloudflare')"></span>
          </a>
          <a href="http://localhost:4321" class="route-link" :class="{ active: currentLine === 'dev' }">
            <span class="rt-label">Dev</span>
            <span class="rt-latency" :class="latencyClass('dev')">{{ latencyText('dev') }}</span>
            <span class="rt-dot" :class="dotClass('dev')"></span>
          </a>
        </div>
      </el-card>

      <el-card v-if="recommendations?.length" class="block-card recommend-card" shadow="hover">
        <div class="section-title">推荐文章</div>
        <ul class="rec-list">
          <li v-for="(r, i) in visibleRecs" :key="r.slug" class="rec-item">
            <span class="rec-index">{{ i + 1 }}</span>
            <a :href="`/posts/${r.slug}`" class="rec-link">{{ r.title }}</a>
            <span v-if="r.date" class="rec-date">{{ formatDate(r.date as any) }}</span>
          </li>
        </ul>
        <div v-if="visibleRecLimit < (recommendations?.length || 0)" class="load-more-container">
            <el-button link type="primary" size="small" @click="loadMoreRecs">加载更多</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElAvatar, ElTag, ElAnchor, ElAnchorLink, ElButton, ElProgress } from 'element-plus'
import quotes from '../data/quotes.json'
import { ref, onMounted, onUnmounted, computed } from 'vue'

type Heading = { slug: string; text: string; depth: number }

const props = defineProps<{
  name: string
  description?: string
  avatar: string
  counts: { posts: number; tags: number }
  headings?: Heading[]
  hotTags?: { name: string; count: number }[]
  recommendations?: { slug: string; title: string; date?: string }[]
  notice?: string
}>()

const displayDesc = ref(props.description || '')
const isStyle3 = ref(false)

import todoList from '../data/todos.json'

// Todo logic
const todos = ref(todoList)
const visibleTodoCount = ref(3)
const visibleTodos = computed(() => todos.value.slice(0, visibleTodoCount.value))
function loadMoreTodos() { visibleTodoCount.value += 3 }

// Time Passing Logic
const timeStats = ref([
  { label: '今日已经过去', value: 0, unit: '小时', percent: 0, color: '#409eff' },
  { label: '这周已经过去', value: 0, unit: '天', percent: 0, color: '#e6a23c' },
  { label: '本月已经过去', value: 0, unit: '天', percent: 0, color: '#f56c6c' },
  { label: '今年已经过去', value: 0, unit: '个月', percent: 0, color: '#67c23a' }
])

function updateTimeStats() {
  const now = new Date()
  const year = now.getFullYear()
  
  // Today
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const passedToday = now.getTime() - startOfDay
  const hoursPassed = Math.floor(passedToday / (1000 * 60 * 60))
  const percentToday = (passedToday / (1000 * 60 * 60 * 24)) * 100

  // Week (Mon start)
  const day = now.getDay()
  const dayIndex = day === 0 ? 6 : day - 1
  const passedWeekDays = dayIndex
  const percentWeek = ((dayIndex + (hoursPassed/24)) / 7) * 100
  
  // Month
  const date = now.getDate()
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate()
  const percentMonth = ((date - 1 + (hoursPassed/24)) / daysInMonth) * 100
  
  // Year
  const startOfYear = new Date(year, 0, 1).getTime()
  const passedYear = now.getTime() - startOfYear
  const percentYear = (passedYear / (1000 * 60 * 60 * 24 * (year % 4 === 0 ? 366 : 365))) * 100
  
  timeStats.value[0].value = hoursPassed
  timeStats.value[0].percent = Number(percentToday.toFixed(0))
  timeStats.value[1].value = passedWeekDays
  timeStats.value[1].percent = Number(percentWeek.toFixed(0))
  timeStats.value[2].value = date - 1
  timeStats.value[2].percent = Number(percentMonth.toFixed(0))
  timeStats.value[3].value = now.getMonth()
  timeStats.value[3].percent = Number(percentYear.toFixed(0))
}

// Headings
const headingsState = ref<Heading[]>(props.headings || [])

// Hot Tags
const visibleTagLimit = ref(10)
const visibleTags = computed(() => (props.hotTags || []).slice(0, visibleTagLimit.value))
function loadMoreTags() { visibleTagLimit.value += 10 }

// Recommendations
const visibleRecLimit = ref(5)
const visibleRecs = computed(() => (props.recommendations || []).slice(0, visibleRecLimit.value))
function loadMoreRecs() { visibleRecLimit.value += 5 }

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('zh-CN')
}

// Latency Test
const currentLine = ref('dev')
const latencies = ref<Record<string, number>>({})

function latencyClass(key: string) {
  const l = latencies.value[key]
  if (!l) return 'gray'
  if (l < 200) return 'green'
  if (l < 500) return 'orange'
  return 'red'
}
function dotClass(key: string) {
  return latencyClass(key)
}
function latencyText(key: string) {
  const l = latencies.value[key]
  if (!l) return '测速中'
  return l + 'ms'
}

async function testLatency(url: string, key: string) {
  const start = performance.now()
  try {
    await fetch(url, { method: 'HEAD', mode: 'no-cors' })
    const end = performance.now()
    latencies.value[key] = Math.round(end - start)
  } catch {
    latencies.value[key] = 999
  }
}

function refreshLatencies() {
  latencies.value = {}
  testLatency('https://blog.toubiec.cn', 'cn')
  testLatency('https://vercel-blog.toubiec.cn', 'vercel')
  testLatency('https://netlify-blog.toubiec.cn', 'netlify')
  testLatency('https://cf-blog.toubiec.cn', 'Cloudflare')
  testLatency('http://localhost:4321', 'dev')
}

// Determine current line
function checkLine() {
  const h = window.location.hostname
  if (h.includes('vercel')) currentLine.value = 'vercel'
  else if (h.includes('netlify')) currentLine.value = 'netlify'
  else if (h.includes('cf-blog')) currentLine.value = 'Cloudflare'
  else if (h.includes('localhost')) currentLine.value = 'dev'
  else currentLine.value = 'cn'
}

function handleThemeChange(e: any) {
  isStyle3.value = e.detail === 'style-3'
}

onMounted(() => {
  updateTimeStats()
  setInterval(updateTimeStats, 60000)
  checkLine()
  refreshLatencies()
  
  // Random quote logic
  if (quotes && quotes.length > 0) {
    // If no description provided or user wants random update
    // Check if user provided description in props. If yes, maybe append?
    // User said "update sidebar personal info description... using random json"
    // So we override displayDesc
    const randomIndex = Math.floor(Math.random() * quotes.length)
    displayDesc.value = quotes[randomIndex].content
  }
  
  const style = localStorage.getItem('theme-style')
  isStyle3.value = style === 'style-3'
  
  window.addEventListener('theme-style-change', handleThemeChange)
})

onUnmounted(() => {
  window.removeEventListener('theme-style-change', handleThemeChange)
})
</script>

<style scoped>
.sidebar {
  /* Default sidebar styles */
}
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.profile-card .profile { display:flex; gap:16px; align-items:center; margin-bottom:16px; }
.profile-card .name { font-size:20px; font-weight:700; color:#1f2937; }
.profile-card .desc { font-size:13px; color:#6b7280; margin-top:4px; line-height:1.4; }
.profile-card .stats { display:flex; justify-content:space-around; padding:12px 0; border-top:1px solid #f3f4f6; border-bottom:1px solid #f3f4f6; margin-bottom:16px; }
.profile-card .stat { display:flex; flex-direction:column; align-items:center; gap:4px; }
.profile-card .label { font-size:12px; color:#9ca3af; }
.profile-card .value { font-size:18px; font-weight:700; color:#111827; }
.social-links { display:flex; justify-content:center; gap:12px; }
.social-item { width:36px; height:36px; border-radius:50%; background:#f3f4f6; display:flex; align-items:center; justify-content:center; color:#6b7280; transition:all .2s; }
.social-item:hover { background:#409eff; color:#fff; transform:translateY(-2px); }

.block-card .section-title { font-size:15px; font-weight:700; color:#111827; margin-bottom:12px; padding-left:10px; border-left:4px solid #409eff; line-height:1; }
.notice-content { font-size:14px; color:#4b5563; line-height:1.6; background:#f9fafb; padding:10px; border-radius:8px; }

.custom-anchor :deep(.el-anchor__link) { font-size:13px; padding: 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.custom-anchor :deep(.el-anchor__link.is-active) { color:#409eff; font-weight:600; }
.toc-depth-2 { margin-left: 0; }
.toc-depth-3 { margin-left: 12px; }
.toc-depth-4 { margin-left: 24px; }

.section-list { display:flex; flex-wrap:wrap; gap:8px; }
.item-link { text-decoration:none; }

.route-card .section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.routes { display:flex; flex-direction:column; gap:8px; }
.route-link { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:#f9fafb; border-radius:8px; text-decoration:none; color:#374151; font-size:13px; transition:all .2s; border:1px solid transparent; }
.route-link:hover { background:#f3f4f6; }
.route-link.active { background:#ecf5ff; border-color:#d9ecff; color:#409eff; }
.rt-latency { margin-left:auto; margin-right:8px; font-size:12px; font-family:monospace; }
.rt-latency.green { color:#67c23a; }
.rt-latency.orange { color:#e6a23c; }
.rt-latency.red { color:#f56c6c; }
.rt-latency.gray { color:#909399; }
.rt-dot { width:8px; height:8px; border-radius:50%; background:#909399; }
.rt-dot.green { background:#67c23a; }
.rt-dot.orange { background:#e6a23c; }
.rt-dot.red { background:#f56c6c; }

.rec-list { list-style:none; padding:0; margin:0; }
.rec-item { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px dashed #f3f4f6; }
.rec-item:last-child { border-bottom:none; }
.rec-index { width:18px; height:18px; background:#f3f4f6; color:#909399; font-size:11px; display:flex; align-items:center; justify-content:center; border-radius:4px; flex-shrink:0; }
.rec-item:nth-child(1) .rec-index { background:#f56c6c; color:#fff; }
.rec-item:nth-child(2) .rec-index { background:#e6a23c; color:#fff; }
.rec-item:nth-child(3) .rec-index { background:#67c23a; color:#fff; }
.rec-link { flex:1; font-size:13px; color:#4b5563; text-decoration:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rec-link:hover { color:#409eff; text-decoration:underline; }
.rec-date { font-size:12px; color:#9ca3af; flex-shrink:0; }

.todo-list { display: flex; flex-direction: column; gap: 8px; }
.todo-item { display: flex; align-items: center; gap: 8px; padding: 8px; background: #f9fafb; border-radius: 6px; }
.todo-item.done .todo-text { text-decoration: line-through; color: #9ca3af; }
.checkbox-custom { width: 16px; height: 16px; border: 1px solid #dcdfe6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #409eff; background: #fff; }
.todo-item.done .checkbox-custom { border-color: #409eff; background: #ecf5ff; }
.todo-text { font-size: 13px; color: #606266; }
.load-more-container { text-align: center; margin-top: 8px; }

.time-list { display: flex; flex-direction: column; gap: 12px; }
.time-item { }
.time-label { font-size: 13px; color: #606266; margin-bottom: 4px; display: flex;}
.time-value { font-weight: 700; margin: 0 4px; }

/* Split Mode Styles */
.sidebar-left-col, .sidebar-right-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
