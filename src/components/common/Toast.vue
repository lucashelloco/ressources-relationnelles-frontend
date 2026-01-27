<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="toast"
      :class="[`toast--${type}`]"
      role="alert"
    >
      <div class="toast__icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast__content">
        <p class="toast__message">{{ message }}</p>
      </div>
      <button @click="close" class="toast__close">✕</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 4000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)
let timer = null

const close = () => {
  visible.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    timer = setTimeout(close, props.duration)
  }
})

watch(() => props.message, () => {
  if (timer) clearTimeout(timer)
  visible.value = true
  if (props.duration > 0) {
    timer = setTimeout(close, props.duration)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  min-width: 300px;
  max-width: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  z-index: 9999;
  border-left: 4px solid;
}

.toast--success {
  border-left-color: #18753c;
}

.toast--error {
  border-left-color: #ce0500;
}

.toast--warning {
  border-left-color: #fc5d00;
}

.toast--info {
  border-left-color: #0063cb;
}

.toast__icon {
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast--success .toast__icon {
  background: #b8fec9;
  color: #18753c;
}

.toast--error .toast__icon {
  background: #ffe9e6;
  color: #ce0500;
}

.toast--warning .toast__icon {
  background: #ffe9e6;
  color: #fc5d00;
}

.toast--info .toast__icon {
  background: #e3e3fd;
  color: #0063cb;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__message {
  margin: 0;
  font-size: 0.875rem;
  color: #161616;
  line-height: 1.5;
}

.toast__close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
}

.toast__close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #161616;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
