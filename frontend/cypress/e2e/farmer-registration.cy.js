describe('Farmer Registration', () => {
  beforeEach(() => {
    // Login as FieldOfficer first
    cy.login('officer@example.com', 'password123')
  })

  it('should register a new farmer successfully', () => {
    cy.visit('/register-farmer')
    cy.get('input[name="name"]').type('John Doe')
    cy.get('select[name="region"]').select('Central')
    cy.get('input[name="contact"]').type('+254712345678')
    cy.get('input[name="contractedCrop"]').type('Maize')
    cy.get('input[name="contractId"]').type('CONTRACT-001')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/farmer/')
    cy.contains('John Doe').should('be.visible')
  })

  it('should show error when region is not selected', () => {
    cy.visit('/register-farmer')
    cy.get('input[name="name"]').type('Jane Doe')
    cy.get('input[name="contact"]').type('+254712345679')
    cy.get('input[name="contractedCrop"]').type('Beans')
    cy.get('input[name="contractId"]').type('CONTRACT-002')
    cy.get('button[type="submit"]').click()
    cy.contains('Please select a region').should('be.visible')
  })
})