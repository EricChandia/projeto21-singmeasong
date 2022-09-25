import * as testsRepository from '../repositories/testsRepository.js';

export async function reset() {

    
    await testsRepository.truncateRecomendations();
    return;
}