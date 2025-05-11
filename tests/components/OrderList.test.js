import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OrderList from "../../src/components/OrderList.vue";

const defaultProps = {
  title: "Pending Orders",
  className: "pending-orders",
};

describe("OrderList", () => {
  describe("Basic Rendering", () => {
    it("should render title correctly", () => {
      const wrapper = mount(OrderList, {
        props: {
          ...defaultProps,
          orders: [],
        },
      });
      expect(wrapper.find("h2").text()).toBe("Pending Orders");
    });

    it("should render empty list", () => {
      const wrapper = mount(OrderList, {
        props: {
          ...defaultProps,
          orders: [],
        },
      });
      expect(wrapper.find(".orders").exists()).toBe(true);
      expect(wrapper.findAll(".order-item")).toHaveLength(0);
    });
  });

  describe("Order Display", () => {
    const orders = [
      { id: 1, type: "normal", processing: false, progress: 0 },
      { id: 2, type: "vip", processing: true, progress: 50 },
    ];

    it("should display order information correctly", () => {
      const wrapper = mount(OrderList, {
        props: {
          ...defaultProps,
          orders,
        },
      });
      const orderItems = wrapper.findAll(".order-item");
      expect(orderItems).toHaveLength(2);

      // Check Normal Order
      expect(orderItems[0].find(".order-id").text()).toBe("#1");
      expect(orderItems[0].find(".order-type").text()).toBe("NORMAL");
      expect(orderItems[0].classes()).toContain("normal");

      // Check VIP Order
      expect(orderItems[1].find(".order-id").text()).toBe("#2");
      expect(orderItems[1].find(".order-type").text()).toBe("VIP");
      expect(orderItems[1].classes()).toContain("vip");
    });

    it("should show progress for processing orders", () => {
      const wrapper = mount(OrderList, {
        props: {
          ...defaultProps,
          orders,
        },
      });
      const processingOrder = wrapper.findAll(".order-item")[1];
      expect(processingOrder.find(".processing-indicator").exists()).toBe(true);
      expect(processingOrder.find(".processing-text").text()).toBe(
        "Processing..."
      );

      const progressBar = processingOrder.find(".progress");
      expect(progressBar.attributes("style")).toContain("width: 50%");
    });

    it("should not show progress bar for non-processing orders", () => {
      const wrapper = mount(OrderList, {
        props: {
          ...defaultProps,
          orders,
        },
      });
      const normalOrder = wrapper.findAll(".order-item")[0];
      expect(normalOrder.find(".processing-indicator").exists()).toBe(false);
    });
  });
});
