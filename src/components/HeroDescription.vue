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
    text.value = quotes[Math.floor(Math.random() * quotes.length)]
  }
})
</script>
