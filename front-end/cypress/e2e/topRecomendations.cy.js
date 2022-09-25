import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await cy.request('POST', 'http://localhost:5000/tests/reset', {});
})

describe('Testa o funcionamento de listar as top recomendations', () => {
  it('passes', () => {
    const recomendationTitle = faker.lorem.word(6);
    cy.createRecomendation(recomendationTitle);

    cy.intercept("GET", "http://localhost:5000/recommendations/top/10").as("top10");
    cy.get("#topButton").click();
    cy.wait("@top10");

    cy.url().should('equal', 'http://localhost:3000/top')
    cy.contains(recomendationTitle).should("be.visible");
  })
})