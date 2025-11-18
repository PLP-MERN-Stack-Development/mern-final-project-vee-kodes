describe('User Login', () => {
  it('should login successfully as Admin', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
    cy.contains('Manager Dashboard').should('be.visible')
  })

  it('should login successfully as FieldOfficer', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('officer@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/farmers')
    cy.contains('Farmers').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('invalid@example.com')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Invalid credentials').should('be.visible')
  })
})