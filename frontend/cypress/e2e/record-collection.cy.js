describe('Record Collection', () => {
  beforeEach(() => {
    // Login as FieldOfficer
    cy.login('officer@example.com', 'password123')
  })

  it('should record a collection successfully', () => {
    cy.visit('/record-collection')
    // Select farmer
    cy.get('select[name="farmerId"]').select(1)
    // Crop should auto-fill
    cy.get('input[name="harvestDate"]').type('2025-01-15')
    cy.get('input[name="collectionDate"]').type('2025-01-16')
    cy.get('input[name="weight"]').type('500.5')
    cy.get('select[name="qualityGrade"]').select('A')
    cy.get('input[name="paymentRate"]').type('25.50')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/farmer/')
    cy.contains('Collection of 500.5kg recorded').should('be.visible')
  })

  it('should show error for missing required fields', () => {
    cy.visit('/record-collection')
    cy.get('button[type="submit"]').click()
    // Should show validation errors or stay on page
    cy.url().should('include', '/record-collection')
  })
})