<template>
  <el-card class="comments-card" shadow="hover">
    <div class="comments-header">
      <div class="comments-title">评论</div>
      <div class="comments-count">{{ list.length }} 条</div>
    </div>
    <el-form :model="form" class="comments-form">
      <div class="form-row">
        <el-input v-model="form.author" placeholder="昵称" maxlength="24" />
        <el-input v-model="form.email" placeholder="邮箱（可选）" maxlength="64" />
      </div>
      <el-input v-model="form.content" type="textarea" :rows="4" placeholder="写下你的看法..." maxlength="800" show-word-limit />
      <div class="form-actions">
        <el-button type="primary" @click="onSubmit" :disabled="submitting">发表</el-button>
        <el-button @click="onReset" :disabled="submitting">重置</el-button>
      </div>
    </el-form>

    <el-divider />

    <div v-if="list.length" class="comments-list">
      <div v-for="c in list" :key="c.id" class="comment-item">
        <div class="item-head">
          <div class="item-author">{{ c.author || '匿名' }}</div>
          <div class="item-date">{{ formatDate(c.date) }}</div>
        </div>
        <div class="item-body">{{ c.content }}</div>
        <div class="item-actions">
          <el-button link type="danger" size="small" @click="onDelete(c.id)">删除</el-button>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无评论" />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElCard, ElForm, ElInput, ElButton, ElDivider, ElEmpty, ElMessage } from 'element-plus'

type Comment = { id: string; author: string; email?: string; content: string; date: string }
const props = defineProps<{ slug: string; title?: string }>()

const submitting = ref(false)
const form = ref({ author: '', email: '', content: '' })
const list = ref<Comment[]>([])

const KEY = 'blog-comments'

function load() {
  try {
    const raw = localStorage.getItem(KEY) || '{}'
    const map = JSON.parse(raw)
    const arr = Array.isArray(map[props.slug]) ? map[props.slug] : []
    list.value = arr
  } catch { list.value = [] }
}
function save() {
  try {
    const raw = localStorage.getItem(KEY) || '{}'
    const map = JSON.parse(raw)
    map[props.slug] = list.value
    localStorage.setItem(KEY, JSON.stringify(map))
  } catch {}
}
function nonEmpty(s: string) { return (s || '').trim().length > 0 }
function onReset() { form.value = { author: '', email: '', content: '' } }
function uuid() { return Math.random().toString(36).slice(2) + Date.now().toString(36) }
function onSubmit() {
  if (submitting.value) return
  const content = form.value.content.trim()
  if (!nonEmpty(content)) { ElMessage.error('内容不能为空'); return }
  submitting.value = true
  const c: Comment = {
    id: uuid(),
    author: form.value.author.trim(),
    email: form.value.email.trim(),
    content,
    date: new Date().toISOString(),
  }
  list.value = [c, ...list.value]
  try { save(); ElMessage.success('已发表') } catch { ElMessage.error('保存失败') }
  submitting.value = false
  onReset()
}
function onDelete(id: string) {
  list.value = list.value.filter((x) => x.id !== id)
  save()
}
function formatDate(d: string) { try { return new Date(d).toLocaleString() } catch { return '' } }

onMounted(() => { load() })
</script>

<style scoped>
.comments-card { border-radius: 18px; margin: 18px 0; }
.comments-header { display:flex; align-items:center; justify-content:space-between; }
.comments-title { font-weight:800; font-size:16px; }
.comments-count { color:#666; font-size:13px; }
.comments-form { display:flex; flex-direction:column; gap:10px; }
.form-row { display:grid; grid-template-columns: 1fr 1fr; gap:10px; }
.form-actions { display:flex; gap:10px; justify-content:flex-end; }
.comments-list { display:flex; flex-direction:column; gap:12px; }
.comment-item { background:#fafafa; border:1px solid #eee; border-radius:12px; padding:12px; }
.item-head { display:flex; align-items:center; justify-content:space-between; }
.item-author { font-weight:700; }
.item-date { color:#666; font-size:12px; }
.item-body { margin-top:6px; white-space:pre-wrap; word-break:break-word; }
.item-actions { display:flex; justify-content:flex-end; }
@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
</style>

