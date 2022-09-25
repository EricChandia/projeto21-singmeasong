import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await cy.request('POST', 'http://localhost:5000/tests/reset', {});
  

})

describe('testa a criação de uma recomendação na home', () => {
  it('passes', () => {
    const recomendationTitle = faker.lorem.word(6);
    cy.createRecomendation(recomendationTitle);

    cy.contains(recomendationTitle).should("be.visible");
  })
})