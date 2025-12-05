<template>
  <div class="donate-actions">
    <div class="button-row">
      <el-popover trigger="hover" placement="top" width="300" @show="onShow('alipay')">
        <template #reference>
          <el-button type="primary" size="large" round :icon="Star" data-donate="alipay" class="donate-btn">支付宝</el-button>
        </template>
        <div class="qr-wrap">
          <img :src="alipaySrc" alt="二维码" class="qr-img" />
        </div>
      </el-popover>

      <el-popover trigger="hover" placement="top" width="300" @show="onShow('wechat')">
        <template #reference>
          <el-button type="success" size="large" round :icon="Message" data-donate="wechat" class="donate-btn">微信</el-button>
        </template>
        <div class="qr-wrap">
          <img :src="wechatSrc" alt="二维码" class="qr-img" />
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElPopover } from 'element-plus'
import { Star, Message } from '@element-plus/icons-vue'

const alipaySrc = ref('')
const wechatSrc = ref('')

function onShow(type: 'alipay' | 'wechat') {
  if (type === 'alipay') alipaySrc.value = '/assets/donate/alipay.png'
  else wechatSrc.value = '/assets/donate/wechat.png'
}
</script>

<style scoped>
.donate-actions { display:flex; justify-content:center; }
.button-row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: center; }
.button-row > * { margin: 0; }
.qr-wrap { display:flex; align-items:center; justify-content:center; }
.qr-img { width: 240px; height: 240px; border-radius: 12px; object-fit: contain; background:#f5f7fa; }
.donate-btn { color: #fff !important; }
</style>
