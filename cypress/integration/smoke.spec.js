describe('Smoke Test', () => {
  it('Check website responds', () => {
    cy.visit('/')
    cy.contains("Hi, I'm Rick")
  })
  it('navigates', () => {
    cy.server()

    cy.route({
      method: 'GET',
      url: '*/index.partial.html',
    }).as('workRequest')

    cy.route({
      method: 'GET',
      url: '*/github',
    }).as('apiRequest')

    cy.get('nav .ml-auto').contains('work').click()

    cy.wait('@workRequest')
    cy.get('#projects')
    cy.wait('@apiRequest')
    cy.get('#projects > li')
  })
})
