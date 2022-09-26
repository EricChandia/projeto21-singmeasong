import app from "../../src/app";
import supertest from "supertest";
import * as recommendationsFactory from '../factory/recomendationFactory';
import { prisma } from "../../src/database";
import { Recommendation } from "@prisma/client";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("/recommendations POST", () => {
  it("Deve retornar 201 ao cadastrar um recommendation com sucesso.", async () => {
    const recommendation = recommendationsFactory.newRecomendationBody();
    
    const response = await supertest(app).post("/recommendations").send(recommendation);
    expect(response.status).toBe(201);
  });  
  it("Deve retornar erro 422 ao tentar cadastrar uma recommendation com formato inválido.", async () => {
    const recommendation = recommendationsFactory.invalidRecommendation();

    const response = await supertest(app).post("/recommendations").send(recommendation);
    expect(response.status).toBe(422);
  });

  it("Deve retornar 409 ao tentar cadastrar uma recommendation com nome duplicado.", async () => {
    const recommendation = recommendationsFactory.newRecomendationBody();

    await supertest(app).post("/recommendations").send(recommendation);
    const response = await supertest(app).post("/recommendations").send(recommendation);
    expect(response.status).toBe(409);
  });
});

describe("/recommendations GET", () => {
  it("Deve retornar 200 e um array de recommendations", async () => {
    const response = await supertest(app).get("/recommendations").send();
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});



describe("/recommendations/random GET", () => {
  it("Deve retornar 200 e uma recomendation aleatória.", async () => {
    const recommendation = recommendationsFactory.newRecomendationBody();
    await supertest(app).post("/recommendations").send(recommendation);
    const response = await supertest(app).get("/recommendations/random").send();
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("youtubeLink");
    expect(response.body).toHaveProperty("score");
  });
});  

  it("Deve retornar 404 ao buscar ramdom recommendations por não existir nenhuma cadastrada", async () => {
    const response = await supertest(app).get("/recommendations/random").send();
    expect(response.status).toBe(404);
  });


describe("/recommendations/id GET", () => {
  it("Deve retornar 200 ao buscar um id existente.", async () => {
    const recommendation = recommendationsFactory.newRecomendationBody();
    await supertest(app).post("/recommendations").send(recommendation);

    const result = await prisma.recommendation.findMany();
    const id = result[0].id;

    const response = await supertest(app).get(`/recommendations/${id}`).send();
    expect(response.status).toBe(200);
  });

  it("Deve retornar 404 ao buscar um id que não existe.", async () => {
    const response = await supertest(app).get("/recommendations/-1").send();
    expect(response.status).toBe(404);
  });
});

describe("/recommendations/top/:amount GET", () => {
  it("Deve retornar 200 e um array ao buscar as top recommendations.", async () => {
    const recommendation = recommendationsFactory.newRecomendationBody();
    await supertest(app).post("/recommendations").send(recommendation);
    const response = await supertest(app).get(`/recommendations/top/1`).send();
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("/recommendations/:id/upvote POST", () => {
  it("Deve retornar 200 ao dar um upvote em uma recommendation existente", async () => {
    const recommendation = recommendationsFactory.newRecomendationBody();
    await supertest(app).post("/recommendations").send(recommendation);
    const result: Recommendation[] = await prisma.recommendation.findMany();
    const id = result[0].id;
    const response = await supertest(app).post(`/recommendations/${id}/upvote`);
    expect(response.status).toBe(200);
  });

  it("Deve retornar 404 dar um upvote em uma recommendation inexistente.", async () => {
    const response = await supertest(app).post(`/recommendations/-1/upvote`);
    expect(response.status).toBe(404);
  });
});

describe("/recommendations/:id/downvote POST", () => {
  it("Deve retornar 200 ao dar downvote em um recommendation existente.", async () => {
    const recommendation = recommendationsFactory.newRecomendationBody();
    await supertest(app).post("/recommendations").send(recommendation);
    const result: Recommendation[] = await prisma.recommendation.findMany();
    const id = result[0].id;

    const response = await supertest(app).post(
      `/recommendations/${id}/downvote`
    );
    expect(response.status).toBe(200);
  });
  it("Deve retornar 404 dar um downvote em uma recommendation inexistente.", async () => {
    const response = await supertest(app).post(`/recommendations/-999/downvote`);
    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});