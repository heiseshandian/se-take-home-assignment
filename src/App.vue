<template>
  <div class="app">
    <h1>McDonald's Order Management System</h1>
    <OrderController @create-order="handleCreateOrder" @add-bot="handleAddBot" @remove-bot="handleRemoveBot" />
    <div class="orders-container">
      <OrderList title="Pending Orders" class-name="pending-orders" :orders="pendingOrders" />
      <OrderList title="Completed Orders" class-name="completed-orders" :orders="completedOrders" />
    </div>
  </div>
</template>

<script setup>
import OrderController from './components/OrderController.vue'
import OrderList from './components/OrderList.vue'
import { orderService } from './services/OrderService'

const { pendingOrders, completedOrders } = orderService

const handleCreateOrder = ({ type }) => {
  orderService.createOrder(type)
}

const handleAddBot = () => {
  orderService.addBot()
}

const handleRemoveBot = () => {
  orderService.removeBot()
}
</script>

<style>
.app {
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.orders-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
</style>
