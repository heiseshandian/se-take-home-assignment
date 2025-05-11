import { ref } from "vue";

class OrderService {
  constructor() {
    this.orderCounter = 0;
    this.pendingOrders = ref([]);
    this.completedOrders = ref([]);
    this.bots = ref([]);
    this.processingOrders = new Map();
  }

  createOrder(type) {
    const order = {
      id: ++this.orderCounter,
      type,
      processing: false,
      progress: 0,
    };

    if (type === "vip") {
      const lastVipIndex = this.pendingOrders.value.findLastIndex(
        (order) => order.type === "vip"
      );
      const insertIndex = lastVipIndex === -1 ? 0 : lastVipIndex + 1;
      this.pendingOrders.value.splice(insertIndex, 0, order);
    } else {
      this.pendingOrders.value.push(order);
    }

    this.assignOrdersToBots();
    return order;
  }

  addBot() {
    const bot = {
      id: this.bots.value.length + 1,
      status: "idle",
    };
    this.bots.value.push(bot);
    this.assignOrdersToBots();
    return bot;
  }

  removeBot() {
    if (this.bots.value.length === 0) return;

    const bot = this.bots.value.pop();
    const processingOrder = this.processingOrders.get(bot.id);

    if (processingOrder) {
      const order = this.pendingOrders.value.find(
        (o) => o.id === processingOrder.id
      );
      if (order) {
        order.processing = false;
        order.progress = 0;
      }
      this.processingOrders.delete(bot.id);
    }
  }

  assignOrdersToBots() {
    const idleBots = this.bots.value.filter(
      (bot) => !this.processingOrders.has(bot.id)
    );
    const toCompleteOrders = this.pendingOrders.value.filter(
      (order) => order.processing === false
    );
    const len = Math.min(idleBots.length, toCompleteOrders.length);

    for (let i = 0; i < len; i++) {
      this.processOrder(idleBots[i], toCompleteOrders[i]);
    }
  }

  processOrder(bot, order) {
    order.processing = true;
    this.processingOrders.set(bot.id, order);
    bot.status = "processing";

    const startTime = Date.now();
    const processTime = 10000; // 10 seconds

    const updateProgress = () => {
      // In case the order was removed during processing
      if (!order.processing) {
        return;
      }

      const elapsed = Date.now() - startTime;
      order.progress = Math.min((elapsed / processTime) * 100, 100);

      if (elapsed < processTime) {
        requestAnimationFrame(updateProgress);
      } else {
        this.completeOrder(bot, order);
      }
    };

    requestAnimationFrame(updateProgress);
  }

  completeOrder(bot, order) {
    const orderIndex = this.pendingOrders.value.findIndex(
      (o) => o.id === order.id
    );
    if (orderIndex !== -1) {
      this.pendingOrders.value.splice(orderIndex, 1);
      order.processing = false;
      order.progress = 100;
      this.completedOrders.value.push(order);
    }

    this.processingOrders.delete(bot.id);
    bot.status = "idle";
    this.assignOrdersToBots();
  }
}

export const orderService = new OrderService();
