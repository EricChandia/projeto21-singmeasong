import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { jest } from '@jest/globals'
import { faker } from '@faker-js/faker';

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});


describe('Testes unitários da criação de um recomendation', () => {
    it('Deve criar uma recomendation', async () => {
        const newRecomendation = {
            name: faker.lorem.word(6),
            youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM'
        }

        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any => {});
        jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(():any => {});
        
        await recommendationService.insert(newRecomendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });


    it('Deve tentar criar um recomendation mas dar um erro por causa do name duplicado', async () => {
        const newRecomendation = {
            name: 'recomendationName',
            youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM'
        }

        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any => {
            return newRecomendation
        });
        
        const promise = recommendationService.insert(newRecomendation);

        expect(promise).rejects.toEqual({
            type: "conflict", message: "Recommendations names must be unique"
        });
        expect(recommendationRepository.create).not.toBeCalled();
    });



})