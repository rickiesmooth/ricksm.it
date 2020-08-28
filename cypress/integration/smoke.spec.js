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
      response: {
        showcaseItems: [
          {
            name: 'home',
            url: 'https://github.com/rickiesmooth/home',
            descriptionHTML:
              '<div>React UI for <a href="https://github.com/mozilla-iot/gateway">https: //github.com/mozilla-iot/gateway</a>. </div>',
            repositoryTopics: {
              edges: [{ node: { topic: { name: 'graphql' } } }],
            },
          },
        ],
      },
    }).as('apiRequest')

    cy.get('nav .ml-auto').contains('work').click()

    cy.wait('@workRequest')
    cy.get('#projects')
    // cy.wait('@apiRequest')
    cy.get('#projects > li')
  })
})
