import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await cy.request('POST', 'http://localhost:5000/tests/reset', {});
})

describe('Testa o funcionamento de listar random recomendations', () => {
  it('passes', () => {
    const recomendationTitle = faker.lorem.word(6);
    cy.createRecomendation(recomendationTitle);

    cy.intercept("GET", "http://localhost:5000/recommendations/random").as("random");
    cy.get("#randomButton").click();
    cy.wait("@random");

    cy.url().should('equal', 'http://localhost:3000/random')
    cy.contains(recomendationTitle).should("be.visible");
  })
})