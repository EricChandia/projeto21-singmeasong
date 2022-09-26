import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { jest } from '@jest/globals'
import { faker } from '@faker-js/faker';
import { Recommendation } from "@prisma/client";
import { arrayOfRecommendations, fullRecomendationBody } from '../factory/recomendationFactory';


beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});


describe('Testes unitários do recomendation service', () => {
    it('Deve criar uma recommendation', async () => {
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


    it('Deve tentar criar um recommendation mas dar um erro por causa do name duplicado', async () => {
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



    it('Deve dar um "upvote" na recommendation',  async () => {
        const recomendation:Recommendation = fullRecomendationBody();

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recomendation);

        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {});

        await recommendationService.upvote(recomendation.id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();

    });

    it('Deve resultar em erro por tentar dar um "upvote" em um id que não existe',  async () => {

        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any => {});

        //jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {});

        const promise = recommendationService.upvote(0);

        expect(recommendationRepository.find).toBeCalled();
        expect(promise).rejects.toEqual({
            type: "not_found",
            message: ""
        });

    });





    it('Deve dar um "downvote" na recommendation',  async () => {
        const recomendation:Recommendation = fullRecomendationBody();

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recomendation);

        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
            id: 1,
            name: 'recomendationName',
            youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM',
            score: -1
        });

        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(():any => {});

        await recommendationService.downvote(recomendation.id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).not.toBeCalled();
    });



    it('Deve dar um "downvote" na recommendation e remove-la por ter -5 no score',  async () => {
        const recomendation:Recommendation = fullRecomendationBody();

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recomendation);

        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
            id: 1,
            name: 'recomendationName',
            youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM',
            score: -6
        });

        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(():any => {});

        await recommendationService.downvote(recomendation.id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    });


    it('Deve dar um get em todas as recommendations', async () => {

        jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(():any => []);

        const recomendations = await recommendationService.get();

        expect(recomendations).toBeInstanceOf(Array);
        expect(recommendationRepository.findAll).toBeCalled();
    });


    it('Deve pegar as top recommendations', async() => {
        const listRecommendations = arrayOfRecommendations();

        jest.spyOn(recommendationRepository, "getAmountByScore").mockResolvedValue(listRecommendations);
        
        const topRecommendations = await recommendationService.getTop(3);
  
        expect(recommendationRepository.getAmountByScore).toBeCalled();
        expect(topRecommendations).toHaveLength(3);
        expect(topRecommendations).toBeInstanceOf(Array);
      });



    it('No getRandom deve retornar com sucesso uma recommendation aleatória quando o filtro é lte', async() => {
        const listRecommendations = arrayOfRecommendations();
  
        jest.spyOn(Math, "random").mockReturnValue(0.9);
        jest.spyOn(recommendationRepository, "findAll")
        .mockResolvedValueOnce(listRecommendations);
  
        const recommendation = await recommendationService.getRandom();
  
        expect(recommendationRepository.findAll).toBeCalled();
        expect(recommendation).toBeInstanceOf(Object);
        expect(recommendation).toHaveProperty('id')
        expect(recommendation).toHaveProperty('name')
        expect(recommendation).toHaveProperty('youtubeLink')
        expect(recommendation).toHaveProperty('score')  
      })


      it('No getRamdom deve retornar com sucesso uma recommendation aleatória quando o filtro é gt', async() => {
        const listRecommendations = arrayOfRecommendations();
  
        jest.spyOn(Math, "random").mockReturnValue(0.1);
        jest.spyOn(recommendationRepository, "findAll")
        .mockResolvedValueOnce(listRecommendations);
  
        const recommendation = await recommendationService.getRandom();
  
        expect(recommendationRepository.findAll).toBeCalled();
        expect(recommendation).toBeInstanceOf(Object);
        expect(recommendation).toHaveProperty('id')
        expect(recommendation).toHaveProperty('name')
        expect(recommendation).toHaveProperty('youtubeLink')
        expect(recommendation).toHaveProperty('score')  
      })




    
    it('No getRandom deve dar um erro por não possuir recommendations para mostrar', async() => {
     
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);
        
        const promise = recommendationService.getRandom()
  
        expect(promise).rejects.toEqual({
          message: '',
          type: 'not_found'
        });
        expect(recommendationRepository.findAll).toBeCalled()
  
      });

})
