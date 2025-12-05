<template>
  <div class="sidebar">
    <el-card class="profile-card" shadow="hover">
      <div class="profile">
        <el-avatar :src="avatar" size="large" />
        <div class="info">
          <div class="name">{{ name }}</div>
          <div class="desc" v-if="description">{{ description }}</div>
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
    </el-card>

    <el-card class="block-card todo-card" shadow="hover">
      <div class="section-title">
        待办事项
      </div>
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
          <div class="time-label">{{ item.label }} <span class="time-value" :style="{ color: item.color }">{{ item.value }}</span> {{ item.unit }}</div>
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
</template>

<script setup lang="ts">
import { ElCard, ElAvatar, ElTag, ElAnchor, ElAnchorLink, ElButton, ElProgress } from 'element-plus'
import { ref, onMounted } from 'vue'

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

import todoList from '../data/todos.json'
import { computed } from 'vue'

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
  const passedMonthDays = date - 1
  const percentMonth = ((passedMonthDays + (hoursPassed/24)) / daysInMonth) * 100

  // Year
  const month = now.getMonth()
  const percentYear = ((month + (date/daysInMonth)) / 12) * 100
  
  timeStats.value[0].value = hoursPassed
  timeStats.value[0].percent = Math.round(percentToday)
  
  timeStats.value[1].value = passedWeekDays
  timeStats.value[1].percent = Math.round(percentWeek)
  
  timeStats.value[2].value = passedMonthDays
  timeStats.value[2].percent = Math.round(percentMonth)
  
  timeStats.value[3].value = month
  timeStats.value[3].percent = Math.round(percentYear)
}

// Tags logic
const visibleTagLimit = ref(3)
const visibleTags = computed(() => (props.hotTags || []).slice(0, visibleTagLimit.value))
function loadMoreTags() { visibleTagLimit.value += 3 }

// Recommendations logic
// index.astro passes `recommendations = all.slice(0,5)`. Max 5 items.
const visibleRecLimit = ref(9)
const visibleRecs = computed(() => (props.recommendations || []).slice(0, visibleRecLimit.value))
function loadMoreRecs() { visibleRecLimit.value += 3 }

const headingsState = ref<Heading[]>(props.headings || [])

const currentLine = ref<LineKey>('cn')
try {
  const h = window.location.host
  if (h === 'blog.toubiec.cn') currentLine.value = 'cn'
  else if (h === 'vercel-blog.toubiec.cn') currentLine.value = 'vercel'
  else if (h === 'netlify-blog.toubiec.cn') currentLine.value = 'netlify'
  else if (h === 'cf-blog.toubiec.cn') currentLine.value = 'Cloudflare'
  else if (h === 'localhost:4321') currentLine.value = 'dev'
} catch {}

type LineKey = 'cn' | 'vercel' | 'dev' | 'netlify' | 'Cloudflare'
const targets: Record<LineKey, string> = {
  cn: 'https://blog.toubiec.cn/',
  vercel: 'https://vercel-blog.toubiec.cn/',
  dev: 'http://localhost:4321/',
  netlify: 'https://netlify-blog.toubiec.cn/',
  Cloudflare: 'https://cf-blog.toubiec.cn/',
}
const latencies = ref<Record<LineKey, number | null>>({ cn: null, vercel: null, dev: null, netlify: null, Cloudflare: null })

async function measure(key: LineKey) {
  const url = targets[key]
  const start = performance.now()
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 6000)
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
    clearTimeout(t as any)
    latencies.value[key] = Math.round(performance.now() - start)
  } catch {
    latencies.value[key] = -1
  }
}

function latencyText(key: LineKey) {
  const v = latencies.value[key]
  if (v === null) return '测试中'
  if (v < 0) return '超时'
  return `${v}ms`
}
function latencyClass(key: LineKey) {
  const v = latencies.value[key]
  if (v === null) return 'lat-na'
  if (v < 0) return 'lat-bad'
  if (v <= 150) return 'lat-ok'
  if (v <= 400) return 'lat-warn'
  return 'lat-bad'
}
function dotClass(key: LineKey) {
  const v = latencies.value[key]
  if (v === null) return 'dot na'
  if (v < 0) return 'dot bad'
  if (v <= 150) return 'dot ok'
  if (v <= 400) return 'dot warn'
  return 'dot bad'
}

function refreshLatencies() {
  (['cn', 'vercel', 'dev', 'netlify', 'Cloudflare'] as LineKey[]).forEach((k) => {
    latencies.value[k] = null
    measure(k)
  })
}

onMounted(() => {
  updateTimeStats()
  setInterval(updateTimeStats, 60000)
  ;(['cn', 'vercel', 'dev', 'netlify', 'Cloudflare'] as LineKey[]).forEach((k) => measure(k))
  try { document.dispatchEvent(new CustomEvent('sidebar:mounted')) } catch {}
})

try {
  document.addEventListener('ajax:updateSidebar', (e: Event) => {
    const ce = e as CustomEvent<{ headings?: Heading[] }>
    const hs = (ce.detail && ce.detail.headings) || []
    headingsState.value = Array.isArray(hs) ? hs : []
  })
} catch {}

function onToc(slug: string) {
  try {
    const el = document.getElementById(slug)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      try { history.replaceState(null, '', `#${slug}`) } catch {}
    }
  } catch {}
}

function formatDate(d: string | Date) {
  try {
    const iso = new Date(d).toISOString()
    return iso.slice(0, 10)
  } catch { return '' }
}
</script>

<style scoped>
.sidebar { position: sticky; display:flex; flex-direction:column; gap:10px; animation: fadeUp .3s ease-out both; }
.profile-card { border-radius: 18px; overflow: hidden; }
.profile { display:flex; align-items:center; gap:12px; }
.info { display:flex; flex-direction:column; }
.name { font-weight:700; font-size:16px; }
.desc { color:#666; margin-top:4px; font-size:13px; }
.stats { display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; margin-top:14px; }
.stat { background:#f5f7fa; border-radius:14px; padding:10px 8px; text-align:center; }
.label { color:#666; font-size:12px; }
.value { display:block; font-weight:700; font-size:18px; margin-top:4px; }
.block-card { border-radius: 16px; }
.section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.section-header .section-title { margin-bottom: 0; }
.section-title { display: flex; align-items: center; gap: 8px; font-weight:700; font-size:14px; margin-bottom:12px; }
.section-title::before { content: ""; display: block; width: 4px; height: 16px; background: #e05d98; border-radius: 2px; }
.section-list { display:flex; gap:8px; flex-wrap:wrap; }
.item-link { text-decoration:none; }
.notice-card .notice-content { font-size:13px; color:#4b5563; background:#f5f7fa; border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; }
.route-card .routes { display:flex; flex-direction:column; gap:8px; }
.route-link { display:grid; grid-template-columns: 1fr auto auto; align-items:center; gap:10px; padding:10px 12px; border:1px solid #e5e7eb; border-radius:12px; background:#f9fafb; color:#374151; text-decoration:none; }
.route-link .rt-label { font-weight:700; font-size:14px; }
.route-link.active { border-color:#60a5fa; background:#eff6ff; }
.rt-latency { font-size:12px; font-weight:700; }
.rt-dot { width:8px; height:8px; border-radius:50%; }
.dot.ok { background:#16a34a; }
.dot.warn { background:#f59e0b; }
.dot.bad { background:#ef4444; }
.dot.na { background:#9ca3af; }
.lat-ok { color:#16a34a; }
.lat-warn { color:#f59e0b; }
.lat-bad { color:#ef4444; }
.lat-na { color:#9ca3af; }
.rec-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
.rec-item { display:grid; grid-template-columns: 24px 1fr auto; align-items:center; gap:10px; }
.rec-index { display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; background:#eef2ff; color:#4f46e5; font-size:12px; font-weight:700; }
.rec-link { text-decoration:none; color:#333; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.rec-link:hover { color:#409eff; }
.rec-date { margin-left:auto; color:#888; font-size:12px; }
:deep(.custom-anchor .el-anchor__marker) { background: #409eff; }
:deep(.custom-anchor .el-anchor__link) { font-size: 13px; line-height: 1.6; height: auto; padding: 6px 0; color: #606266; }
:deep(.custom-anchor .el-anchor__link.is-active) { color: #409eff; font-weight: 700; }
:deep(.custom-anchor .el-anchor__link:hover) { color: #409eff; }
:deep(.toc-depth-3) { padding-left: 12px; }
:deep(.toc-depth-4) { padding-left: 24px; }
:deep(.toc-depth-5) { padding-left: 36px; }
:deep(.custom-anchor) { background: transparent; }
@media (max-width: 900px) {
  .sidebar { display: none; }
}

.todo-list { display: flex; flex-direction: column; gap: 12px; }
.todo-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #333; line-height: 1.5; transition: all 0.3s; }
.todo-item.done { text-decoration: line-through; color: #999; opacity: 0.8; }
.checkbox-custom {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 1.5px solid #e05d98;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  transition: all 0.2s;
  background: transparent;
}
.todo-item.done .checkbox-custom {
  background: #e05d98;
  border-color: #e05d98;
}
.checkbox-custom svg { color: white; }
.load-more-container { display: flex; justify-content: center; margin-top: 4px; }

.time-list { display: flex; flex-direction: column; gap: 16px; padding: 4px 0; }
.time-item { display: flex; flex-direction: column; gap: 6px; }
.time-label { font-size: 13px; color: #666; display: flex; align-items: center; }
.time-value { font-weight: bold; font-size: 15px; margin: 0 4px; }
</style>
