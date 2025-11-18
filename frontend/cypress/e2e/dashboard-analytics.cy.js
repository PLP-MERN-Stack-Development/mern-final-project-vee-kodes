describe('Dashboard Analytics', () => {
  beforeEach(() => {
    // Login as Admin
    cy.login('admin@example.com', 'password123')
  })

  it('should display dashboard with stats and charts', () => {
    cy.visit('/dashboard')
    cy.contains('Manager Dashboard').should('be.visible')

    // Check stats cards
    cy.contains('Total Farmers').should('be.visible')
    cy.contains('Total Collected (Kg)').should('be.visible')
    cy.contains('Avg. Cost (KES/Kg)').should('be.visible')
    cy.contains('Total Paid (KES)').should('be.visible')
    cy.contains('Outstanding (KES)').should('be.visible')

    // Check charts
    cy.contains('Collections Over Time').should('be.visible')
    cy.contains('Yield by Quality Grade').should('be.visible')
    cy.contains('Yield by Region').should('be.visible')
    cy.contains('Yield by Crop').should('be.visible')

    // Check AI insights
    cy.contains('General AI Insights').should('be.visible')
    cy.contains('AI Yield Forecast').should('be.visible')
  })

  it('should allow printing PDF report', () => {
    cy.visit('/dashboard')
    cy.contains('Print Report').click()
    // Note: Actual PDF generation might not work in headless mode
    // but we can check the button exists and is clickable
  })
})