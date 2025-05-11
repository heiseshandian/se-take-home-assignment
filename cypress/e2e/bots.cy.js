describe("Bot Management", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should create a new bot when + button clicked", () => {
    cy.get(".add-bot").click();
    cy.get(".bot-count").should("contain", "1");
  });

  it("should remove a bot when - button clicked", () => {
    cy.get(".add-bot").click().click();
    cy.get(".remove-bot").click();
    cy.get(".bot-count").should("contain", "1");
  });

  it("should process pending orders when bot is available", () => {
    cy.get("button.normal").click();
    cy.get(".add-bot").click();
    cy.wait(10000);
    cy.get(".pending-orders .order-item").should("not.exist");
    cy.get(".completed-orders .order-item").should("contain", "NORMAL");
  });

  it("should return order to pending if bot is removed during processing", () => {
    cy.get("button.normal").click();
    cy.get(".add-bot").click();
    cy.get(".remove-bot").click();
    cy.get(".pending-orders .order-item").should("contain", "NORMAL");
  });

  it("should process VIP orders first when multiple bots are available", () => {
    cy.get("button.normal").click().click();
    cy.get("button.vip").click();
    cy.get(".add-bot").click().click();
    cy.wait(10000);
    cy.get(".completed-orders .order-item").eq(0).should("contain", "VIP");
  });

  it("should process orders in FIFO order for same priority", () => {
    cy.get("button.normal").click();
    cy.get("button.normal").click();
    cy.get(".add-bot").click();
    cy.wait(10000);
    cy.get(".completed-orders .order-item")
      .eq(0)
      .should("have.text", "#1NORMAL");
  });

  it("should make bot idle when no orders are pending", () => {
    cy.get(".add-bot").click();
    cy.get(".idle-bots").should("contain", "1");
  });
});
