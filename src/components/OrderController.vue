<template>
  <div class="order-controller">
    <div class="control-panel">
      <button @click="createNormalOrder" class="btn normal">New Normal Order</button>
      <button @click="createVIPOrder" class="btn vip">New VIP Order</button>
      <div class="bot-controls">
        <button @click="addBot" class="btn add-bot">+ Bot</button>
        <button @click="removeBot" class="btn remove-bot">- Bot</button>
        <div class="bot-stats">
          <span class="bot-count">Total Bots: {{ botCount }}</span>
          <span class="working-bots">Working: {{ workingBots }}</span>
          <span class="idle-bots">Idle: {{ idleBots }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { orderService } from '../services/OrderService'

const emit = defineEmits(['createOrder', 'addBot', 'removeBot'])
const botCount = computed(() => orderService.bots.value.length)
const workingBots = computed(() => orderService.bots.value.filter(bot => bot.status === 'processing').length)
const idleBots = computed(() => orderService.bots.value.filter(bot => bot.status === 'idle').length)

const createNormalOrder = () => {
  emit('createOrder', { type: 'normal' })
}

const createVIPOrder = () => {
  emit('createOrder', { type: 'vip' })
}

const addBot = () => {
  emit('addBot')
}

const removeBot = () => {
  if (botCount.value > 0) {
    emit('removeBot')
  }
}
</script>

<style scoped>
.order-controller {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.control-panel {
  display: flex;
  gap: 20px;
  align-items: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.normal {
  background-color: #4CAF50;
  color: white;
}

.vip {
  background-color: #FFC107;
  color: black;
}

.add-bot {
  background-color: #2196F3;
  color: white;
}

.remove-bot {
  background-color: #F44336;
  color: white;
}

.bot-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bot-stats {
  display: flex;
  gap: 15px;
}

.bot-count,
.working-bots,
.idle-bots {
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
}

.bot-count {
  color: #333;
  background-color: #e0e0e0;
}

.working-bots {
  color: white;
  background-color: #2196F3;
}

.idle-bots {
  color: white;
  background-color: #4CAF50;
}
</style>