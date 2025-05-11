import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import OrderController from "../../src/components/OrderController.vue";
import { orderService } from "../../src/services/OrderService";

describe("OrderController", () => {
  let wrapper;

  beforeEach(() => {
    // Reset OrderService's state before each test
    orderService.orderCounter = 0;
    orderService.pendingOrders.value = [];
    orderService.completedOrders.value = [];
    orderService.bots.value = [];
    orderService.processingOrders = new Map();

    wrapper = mount(OrderController);
  });

  describe("Order Creation Buttons", () => {
    it("should emit createOrder event when clicking normal order button", async () => {
      await wrapper.find("button.normal").trigger("click");
      expect(wrapper.emitted("createOrder")).toBeTruthy();
      expect(wrapper.emitted("createOrder")[0][0]).toEqual({ type: "normal" });
    });

    it("should emit createOrder event when clicking VIP order button", async () => {
      await wrapper.find("button.vip").trigger("click");
      expect(wrapper.emitted("createOrder")).toBeTruthy();
      expect(wrapper.emitted("createOrder")[0][0]).toEqual({ type: "vip" });
    });
  });

  describe("Bot Management Buttons", () => {
    it("should emit addBot event when clicking add bot button", async () => {
      await wrapper.find("button.add-bot").trigger("click");
      expect(wrapper.emitted("addBot")).toBeTruthy();
    });

    it("should emit removeBot event when clicking remove bot button", async () => {
      // Add a bot first
      orderService.addBot();
      await wrapper.find("button.remove-bot").trigger("click");
      expect(wrapper.emitted("removeBot")).toBeTruthy();
    });

    it("should not emit event when clicking remove bot button with no bots", async () => {
      await wrapper.find("button.remove-bot").trigger("click");
      expect(wrapper.emitted("removeBot")).toBeFalsy();
    });
  });

  describe("Bot Status Display", () => {
    it("should correctly display total bot count", async () => {
      orderService.addBot();
      orderService.addBot();
      await wrapper.vm.$nextTick();
      expect(wrapper.find(".bot-count").text()).toContain("Total Bots: 2");
    });

    it("should correctly display working and idle bot counts", async () => {
      orderService.addBot();
      orderService.addBot();
      orderService.createOrder("normal");
      await wrapper.vm.$nextTick();
      expect(wrapper.find(".working-bots").text()).toContain("Working: 1");
      expect(wrapper.find(".idle-bots").text()).toContain("Idle: 1");
    });
  });
});
