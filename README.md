# projeto21-singmeasong

# <p align = "center"> Sing Me a Song </p>

<p align="center">
   <img src="https://user-images.githubusercontent.com/72531277/178094665-f46c6a55-c821-42a0-bb9c-d5dd5f2d69fa.png"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-ERIC_CHANDIA-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/EricChandia/projeto21-singmeasong?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Descrição

O projeto Sing Me a Song é uma plataforma online derecomendação de músicas entre usuários. Um usuário entra no site, cria um nome para a sua recomendação, compartilha o link do vídeo e por assim recomenda para outros usuários. Os usuários então, podem subir ou descer a pontuação das recomendações pelos botões de "upvote" ou "downvote". Assim é possível visualizar top recomendações do momento, ou então, procurar por uma recomendação aleatória entre todas as publicadas. Quando uma recomendação possui 5 votos negativos, ela é automaticamente retirada do site.

***

## :computer:	 Tecnologias e Conceitos

- REST APIs
- Node.js
- TypeScript
- Postgres with Prisma
- React

***

## :rocket: Rotas

```yml
POST /recommendations
    - Adiciona uma nova recomendação de música. A requisição tem o seguinte formato:
    - headers: {}
    - body:{
      "name": "Falamansa - Xote dos Milagres",
      "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }
```

```yml
POST /recommendations/:id/upvote
    - Adiciona um ponto à pontuação da recomendação. Não espera nada no corpo.
```
```yml
POST /recommendations/:id/downvote
    - Remove um ponto da pontuação da recomendação. Não espera nada no corpo.
- Se a pontuação fica abaixo de -5, a recomendação deve ser excluída.
```
```yml
GET /recommendations
    - Pega todas as últimas 10 recomendações.
    A resposta tem o formato:
    [
      {
        "id": 1,
        "name": "Chitãozinho E Xororó - Evidências",
        "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
        "score": 245
      }
    ]
```
```yml
GET /recommendations/:id
    - Pega uma recomendação pelo seu ID.
    - A resposta tem o formato:
    {
      "id": 1,
      "name": "Chitãozinho E Xororó - Evidências",
      "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
      "score": 245
    }
```
```yml
GET /recommendations/random
    - Pega uma recomendação aleatória, baseada na seguinte lógica:

    - **70% das vezes que baterem nessa rota**: uma música com pontuação maior que 10 deve ser recomendada aleatoriamente
    - **30% das vezes que baterem nessa rota**: uma música com pontuação entre -5 e 10 (inclusive), deve ser recomendada aleatoriamente
    - Caso só haja músicas com pontuação acima de 10 ou somente abaixo/igual a 10, 100% das vezes deve ser sorteada qualquer música
    - Caso não haja nenhuma música cadastrada, deve ser retornado status 404

    A resposta tem o formato:
    {
      "id": 1,
      "name": "Chitãozinho E Xororó - Evidências",
      "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
      "score": 245
    }
 ```
 ```yml
 GET /recommendations/top/:amount
    - Lista as músicas com maior número de pontos e sua pontuação. São retornadas as top x músicas (parâmetro :amount da rota), ordenadas por pontuação (maiores primeiro)
    [
        {
          "id": 150,
          "name": "Chitãozinho E Xororó - Evidências",
          "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
          "score": 245
        },
        {
          "id": 12,
          "name": "Falamansa - Xote dos Milagres",
          "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
          "score": 112
        },
        ...
    ]
```

## 🏁 Rodando a aplicação
Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/EricChandia/projeto21-singmeasong/
```

Este projeto possui pastas separadas para o backend e front-end. 

Para o Front-End:

Este projeto foi inicializado com o [Create React App](https://github.com/facebook/create-react-app), então certifique-se que voce tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.

Entrar na pasta "front-end".

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Finalizado o processo, é só inicializar o servidor
```
npm start
```

Para o Backend:

Entrar na pasta "back-end"

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Finalizado o processo, é só inicializar o servidor
```
npm start
```

Testes
  Frontend:
  Abrir o cypress
  ```
  npx cypress open
  ```
  Rodar os scripts de testes dentro do cypress.

  Backend:
    Rodar o seguinte comando para rodar os testes unitários:
    ```
    npm run test:unit
    ```

    Rodar o seguinte comando para rodar os testes de integração:

    ```
    npm run test:int
    ```
 
