<template>
  <div class="hero-desc">{{ text }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import quotes from '../data/quotes.json'

const props = defineProps<{ defaultText?: string }>()
const text = ref(props.defaultText || '')

onMounted(() => {
  if (quotes && quotes.length > 0) {
    const q = quotes[Math.floor(Math.random() * quotes.length)]
    text.value = q.content || q.text || (typeof q === 'string' ? q : JSON.stringify(q))
  }
})
</script>
