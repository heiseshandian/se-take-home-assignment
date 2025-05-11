import { describe, it, expect, beforeEach, vi } from "vitest";
import { orderService } from "../../src/services/OrderService";

describe("OrderService", () => {
  beforeEach(() => {
    // Reset OrderService's state before each test
    orderService.orderCounter = 0;
    orderService.pendingOrders.value = [];
    orderService.completedOrders.value = [];
    orderService.bots.value = [];
    orderService.processingOrders = new Map();
    vi.useFakeTimers();
  });

  describe("Order Creation", () => {
    it("should create normal order and add to end of pending queue", () => {
      const order = orderService.createOrder("normal");
      expect(order.id).toBe(1);
      expect(order.type).toBe("normal");
      expect(orderService.pendingOrders.value).toHaveLength(1);
      expect(orderService.pendingOrders.value[0]).toStrictEqual(order);
    });

    it("should create VIP order and insert after other VIP orders but before normal orders", () => {
      orderService.createOrder("normal"); // id: 1
      orderService.createOrder("vip"); // id: 2
      orderService.createOrder("normal"); // id: 3
      const vipOrder = orderService.createOrder("vip"); // id: 4

      expect(orderService.pendingOrders.value).toHaveLength(4);
      expect(orderService.pendingOrders.value[1].id).toBe(vipOrder.id);
    });
  });

  describe("Bot Management", () => {
    it("should be able to add new bot", () => {
      const bot = orderService.addBot();
      expect(bot.id).toBe(1);
      expect(bot.status).toBe("idle");
      expect(orderService.bots.value).toHaveLength(1);
    });

    it("should be able to remove bot and return its processing order to pending queue", () => {
      orderService.addBot();
      const order = orderService.createOrder("normal");

      // Wait for order to start processing
      vi.advanceTimersByTime(100);
      expect(order.processing).toBe(true);

      orderService.removeBot();
      expect(orderService.bots.value).toHaveLength(0);
      expect(order.processing).toBe(false);
      expect(order.progress).toBe(0);
    });
  });

  describe("Order Processing", () => {
    it("should complete order processing after 10 seconds", () => {
      orderService.addBot();
      const order = orderService.createOrder("normal");

      // Wait for order to start processing
      vi.advanceTimersByTime(100);
      expect(order.processing).toBe(true);

      // Wait for order to complete
      vi.advanceTimersByTime(10000);
      expect(orderService.pendingOrders.value).toHaveLength(0);
      expect(orderService.completedOrders.value).toHaveLength(1);
      expect(orderService.completedOrders.value[0].id).toBe(order.id);
    });

    it("should prioritize processing VIP orders", () => {
      const normalOrder = orderService.createOrder("normal");
      const vipOrder = orderService.createOrder("vip");
      orderService.addBot();

      // Wait for order to start processing
      vi.advanceTimersByTime(100);
      expect(vipOrder.processing).toBe(true);
      expect(normalOrder.processing).toBe(false);
    });

    it("idle bot should immediately start processing new orders", () => {
      orderService.addBot();
      const order = orderService.createOrder("normal");

      // Wait for order to start processing
      vi.advanceTimersByTime(100);
      expect(order.processing).toBe(true);
      expect(orderService.bots.value[0].status).toBe("processing");
    });
  });
});
