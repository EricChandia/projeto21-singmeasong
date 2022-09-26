import { Recommendation } from "@prisma/client"

export function fullRecomendationBody():Recommendation{

    return {
        id: 1,
        name: 'recomendationName',
        youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM',
        score: 0
    }
}

export function newRecomendationBody(){
    return {
        name: 'recomendationName',
        youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM'
    }
}


export function arrayOfRecommendations(){
    return [{
        id: 1,
        name: 'recomendationName',
        youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM',
        score: 0
    }, 
    {
        id: 2,
        name: 'recomendationName',
        youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM',
        score: 1
    },
    {
        id: 3,
        name: 'recomendationName',
        youtubeLink: 'https://www.youtube.com/watch?v=mtf7hC17IBM',
        score: 0
    }
]
}


export function invalidRecommendation() {
    return {};
  }