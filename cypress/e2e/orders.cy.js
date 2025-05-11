describe("Order Management", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should create new normal order", () => {
    cy.get("button.normal").click();
    cy.get(".pending-orders .order-item").should("contain", "NORMAL");
  });

  it("should create new VIP order", () => {
    cy.get("button.vip").click();
    cy.get(".pending-orders .order-item").should("contain", "VIP");
  });

  it("should maintain unique increasing order numbers", () => {
    cy.get("button.normal").click();
    cy.get("button.normal").click();

    const orderNumbers = [];
    cy.get(".order-id")
      .each(($el) => {
        const num = parseInt($el.text().replace("#", ""));
        orderNumbers.push(num);
      })
      .then(() => {
        expect(orderNumbers[1]).to.be.greaterThan(orderNumbers[0]);
      });
  });

  it("should prioritize VIP orders over normal orders", () => {
    cy.get("button.normal").click();
    cy.get("button.vip").click();
    cy.get("button.normal").click();

    cy.get(".pending-orders .order-item").eq(0).should("contain", "VIP");
    cy.get(".pending-orders .order-item").eq(1).should("contain", "NORMAL");
  });

  it("should maintain order of multiple VIP orders", () => {
    cy.get("button.vip").click();
    cy.get("button.vip").click();

    const vipOrderNumbers = [];
    cy.get(".pending-orders .order-item.vip .order-id")
      .each(($el) => {
        const num = parseInt($el.text().replace("#", ""));
        vipOrderNumbers.push(num);
      })
      .then(() => {
        expect(vipOrderNumbers[0]).to.be.lessThan(vipOrderNumbers[1]);
      });
  });
});
