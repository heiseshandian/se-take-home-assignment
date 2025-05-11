<template>
    <div class="order-list" :class="className">
        <h2>{{ title }}</h2>
        <div class="orders">
            <div v-for="order in orders" :key="order.id" class="order-item" :class="order.type">
                <span class="order-id">#{{ order.id }}</span>
                <span class="order-type">{{ order.type.toUpperCase() }}</span>
                <div v-if="order.processing" class="processing-indicator">
                    <span class="processing-text">Processing...</span>
                    <div class="progress-bar">
                        <div class="progress" :style="{ width: order.progress + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true,
    },
    orders: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.order-list {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

h2 {
    margin-top: 0;
    color: #333;
    margin-bottom: 20px;
}

.orders {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.order-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 6px;
    background: #f8f9fa;
    gap: 15px;
    position: relative;
}

.order-item.normal {
    border-left: 4px solid #4CAF50;
}

.order-item.vip {
    border-left: 4px solid #FFC107;
    background: #fff8e1;
}

.order-id {
    font-weight: bold;
    color: #333;
}

.order-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
}

.normal .order-type {
    background: #4CAF50;
    color: white;
}

.vip .order-type {
    background: #FFC107;
    color: black;
}

.processing-indicator {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
}

.processing-text {
    color: #2196F3;
    font-size: 0.9em;
}

.progress-bar {
    width: 100px;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: #2196F3;
    transition: width 0.3s ease;
}
</style>