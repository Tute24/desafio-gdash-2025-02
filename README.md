# GDASH Challenge 2025/02

## Arquitetura da Solução

A aplicação tem o seguinte fluxo:

`python-collector` → `RabbitMQ` → `go-worker` → `NestJS API` → `MongoDB` → `Frontend`

### 1️⃣ Python Collector

- Conecta à API OpenWeather.
- Coleta dados climáticos reais (temperatura, umidade, vento, descrição do clima, etc.).
- Envia os dados brutos para a fila `data_queue` no RabbitMQ.

### 2️⃣ Go Worker

- Consome mensagens da fila.
- Valida e transforma o payload.
- Faz POST para o backend via HTTP.
- Implementado com `amqp091-go`.

### 3️⃣ Backend — NestJS

- Recebe os dados do worker.
- Armazena em MongoDB.
- Expõe endpoints REST.
- Integra com IA via Groq para gerar insights textuais.

### 4️⃣ Frontend — React + Vite + Tailwind

- Dashboard com tabelas, gráficos e cards.
- Exibe dados climáticos.
- Exibe insights gerados pela IA.
- Permite exportar CSV/XLSX.
- Permite que o usuário faça update do seu nome, email e/ou senha
- Permite que o usuário dele sua conta
- Caso o user seja 'admin', ele pode buscar todos os usuários com conta e saber o nome e email deles


---

## 🛠️ Tecnologias Utilizadas

### Backend

- NestJS
- MongoDB + Mongoose
- JWT (autenticação)
- Class-validator / Class-transformer
- Groq LLM API
- vitest

### Frontend

- React
- Vite
- TailwindCSS
- shadcn/ui
- vitest
- zod para validação
- react-hook-form para forms

### Worker / Collector

- Go (worker)
- Python (collector)
- RabbitMQ

### Infra

- Docker
- Docker Compose

---

## 📁 Estrutura do Projeto

```
/
├── backend/
├── frontend/
├── go-worker/
├── python-collector/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔧 Configuração

### Pré-requisitos

- Docker e Docker Compose instalados.

### ⚙️ Como Rodar o Projeto

```bash
docker-compose up --build
```

O Docker sobe automaticamente:

- **Backend** → Porta `3002`
- **Frontend** → Porta `3000`
- **RabbitMQ UI** → Porta `15672`
- **MongoDB**
- **Python Collector**
- **Go Worker**

### Acessos rápidos

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **RabbitMQ UI**: [http://localhost:15672](http://localhost:15672) (login: `guest`, senha: `guest`)

---

## 🔑 Variáveis de Ambiente

CADA SERVIÇO POSSUI SEU PRÓPRIO `.env`.

### Exemplo (backend - backend/.env)

```
MONGO_URI=mongodb://mongo:27017/weather-app
SECRET_KEY=
PORT=3002
GROQ_API_KEY=
STANDARD_USER_NAME=user
STANDARD_USER_EMAIL=user@email.com
STANDARD_USER_PASSWORD=Teste12345!
```

O env.example está na raiz do projeto

---

## 🌐 Endpoints Principais do Backend

### **Auth**  - auth domain

- `POST /auth/sign-in` - rota de sign in com email e senha
- `POST /auth/create-user` - rota de ciração do user com nome, email, senha, e confirmação de senha (default role é 'user')
- `POST /auth/sign-up` - rota de sign out com authguard
* Há também uma seed no projeto que, ao iniciar o serviço da API, um usuário default é criado, com role 'admin', caso o banco esteja vazio

### **Clima** - weather domain

- `GET /weather/get` - rota que traz os detalhes do clima recebidos através do worker (authguard)
- `GET /weather/xlsx` - rota para download do xlsx com as infos do clima (authguard)
- `GET /weather/export.xlsx`  - rota para download do csv com as infos do clima (authguard)
- `POST /weather/register` - endpoint que o worker em go acessa para registrar as informaçoes do clima

### **Usuários** - users domain

- `GET /users/get` - rota que apenas usuários com a role admin acessa e traz os usuários registrados (authguard e roleguard)
- `POST /users/update` - rota que o user acessa pra atualizar seu nome, email e/ou senha (authguard)
- `DELETE /users/delete` - rota que o usuário acessa pra deletar sua conta (authguard)

### **Ai** - ai domain

- `GET /ai/insights` - rota que usa o groq para gerar insights textuais sobre o clima dos próximos 8 dias baseado no registro do db

---

## 🖥️ Rotas do Frontend

- `/` → Sign-In
- `/register` → Registrar usuário
- `/portal/dashboard` → Dashboard climático
- `/portal/user-profile` → Gestão de usuários
* Para logar com o user padrão, o email é user@email.com e a senha é Teste12345!

---

## 📊 Funcionalidades do Dashboard

- Exibição de dados climáticos em tabela e gráficos e cards (clima atual de belo horizonte e para os proximos 8 dias)
- Insight textual gerado por IA (Groq)
- Download de dados em:
  - CSV
  - XLSX

---

## 🧪 Testes

### API e Frontend (Vitest)

```bash
npm run test
```
nos respectivos folders (backend/ e frontend/)

Cobertura incluída para:

- Services no backend
- Componentes e requests no frontend

---

## 🧪 CI

### API e Frontend

Check de lint e testes via github actions (.github/workflows/ci.yml)

<img width="1869" height="736" alt="image" src="https://github.com/user-attachments/assets/b859e74b-9c54-4599-9299-031ee9e54b58" />

---

## 📝 Instruções

O avaliador irá

1. Abrir o Pull Request criado a partir deste fork.
2. Fazer checkout da branch.
3. Rodar:

```bash
docker-compose up --build
```

---

## 🎥 Vídeo Explicativo 

🔗 Vídeo de apresentação: https://youtu.be/snlLJx2Q2Tc


---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para o processo seletivo GDASH 2025/02 e não possui licença comercial.

## @ Meu E-mail

arthurtute01@gmail.com
