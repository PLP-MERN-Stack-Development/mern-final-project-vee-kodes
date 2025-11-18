describe('Add Farm Activity', () => {
  beforeEach(() => {
    // Login as FieldOfficer
    cy.login('officer@example.com', 'password123')
  })

  it('should add a planting activity successfully', () => {
    cy.visit('/add-activity')
    // Assuming there's at least one farmer
    cy.get('select[name="farmerId"]').select(1) // Select first option
    cy.get('select[name="type"]').select('Planting')
    cy.get('input[name="seedVariety"]').type('Pioneer P3812W')
    cy.get('input[name="seedSource"]').type('AgroVet Supplies Ltd.')
    cy.get('input[name="seedQuantity"]').type('25 kg')
    cy.get('input[name="seedLotNumber"]').type('LOT#MZ-2025-001')
    cy.get('input[name="cost"]').type('1500')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/farmer/')
    cy.contains('Activity logged successfully').should('be.visible')
  })

  it('should show error when farmer is not selected', () => {
    cy.visit('/add-activity')
    cy.get('select[name="type"]').select('Weeding')
    cy.get('textarea[name="generalDetails"]').type('Manual weeding performed')
    cy.get('button[type="submit"]').click()
    cy.contains('Please select farmer and operation type').should('be.visible')
  })
})