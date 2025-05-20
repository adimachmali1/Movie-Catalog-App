describe("Movie App E2E", () => {
  it("Searches and adds to watchlist", () => {
    cy.visit("/");
    cy.get('input[placeholder="Search..."]').type("Avengers");
    cy.get('[aria-label^="Movie card for"]').should("exist").click();
    cy.contains("Add to Watchlist").click();
    cy.contains("Remove from Watchlist").should("exist");
  });
});
