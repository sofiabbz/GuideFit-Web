# GuideFit 

Sistema de treino personalizado desenvolvido com React, Node.js e PostgreSQL.

## Tecnologias

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma
- **Containerização:** Docker

## Pré-requisitos

Instale antes de começar:

- [Node.js 18+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com)

## Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/sofiabbz/guidefit.git
cd guidefit
```
### OBS!!!!!
>  **Atenção:** Se você já tinha o projeto anterior rodando no Docker, 
> pare ele antes de subir o novo para evitar conflito de portas:
> ```bash
> cd pasta-que-está-o-projeto-anterior/backend
> docker-compose down
> ```
> Depois volte para a pasta do GuideFit e continue o passo 2.


### 2. Suba o banco de dados com Docker

Abra o **Docker Desktop** e deixe ele rodando. Depois rode:

```bash
docker-compose up -d
```

Para confirmar que o banco subiu:
```bash
docker ps
```

Deve aparecer o container `guidefit_db` com status `Up`.

Para parar o banco quando não estiver usando:
```bash
docker-compose down
```

Para subir novamente:
```bash
docker-compose up -d
```

### 3. Configure o backend

Dentro da pasta `backend-node/`, crie um arquivo `.env` com o seguinte conteúdo (use o `.env.example` como base):

```
DATABASE_URL="postgresql://guidefit_user:guidefit123@localhost:5432/guidefit"
JWT_SECRET="guidefit_secret_key_2024"
PORT=3000
```

### 4. Instale as dependências e rode o backend

```bash
cd backend-node
npm install
npx prisma db push
npm run dev
```

O backend vai rodar em `http://localhost:3000`.

Para confirmar que está funcionando acesse: `http://localhost:3000/api/health`

### 5. Rode o frontend

Abra um **terminal novo** e rode:

```bash
cd frontend
npm install
npm run dev
```

O frontend vai rodar em `http://localhost:5173`.

### 6. Acesse o sistema

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000/api/health

## Estrutura do projeto

```
guidefit/
├── docker-compose.yml         # Configuração do banco de dados
├── README.md
├── backend-node/              # API Node.js + Express
│   ├── prisma/
│   │   └── schema.prisma      # Estrutura do banco de dados
│   ├── src/
│   │   ├── controllers/       # Lógica das rotas
│   │   └── routes/            # Definição das rotas
│   ├── .env.example           # Exemplo de configuração
│   └── server.js              # Entrada do servidor
└── frontend/                  # React + Vite
    └── src/
        ├── pages/             # Páginas da aplicação
        ├── components/        # Componentes reutilizáveis
        └── services/          # Conexão com a API
```

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/health | Verifica se o servidor está rodando |
| POST | /api/auth/cadastro | Cadastra um novo usuário |
| POST | /api/auth/login | Realiza login |

## Observações

- O arquivo `.env` **não é enviado para o GitHub** por segurança. Cada pessoa da equipe precisa criar o seu baseado no `.env.example`.
- O Docker precisa estar **aberto e rodando** antes de subir o banco.
- O backend e o frontend precisam estar rodando **ao mesmo tempo** em terminais separados.