ZenUp – Backend

API REST para monitorar e analisar o bem-estar de colaboradores (humor, energia, estresse), com foco em:

- Check-ins diários (via app mobile)
- Dashboard para gestores com indicadores, métricas e sugestões
- Gestão de usuários e empresas
- Integração com chatbot / IA (endpoint mockado)

------------------------------------------------------------
1. TECNOLOGIAS E STACK
------------------------------------------------------------
Backend:
- Node.js (JavaScript – CommonJS)
- Express 5
- Prisma ORM (MySQL/MariaDB)
- JWT (jsonwebtoken)
- Bcrypt
- Swagger UI
- CORS
- dotenv

------------------------------------------------------------
2. ESTRUTURA DE PASTAS
------------------------------------------------------------
ZenUp-Backend/
├─ .env
├─ package.json
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
└─ src/
   ├─ app.js
   ├─ controllers/
   ├─ service/
   ├─ routes/
   ├─ middlewares/
   ├─ data/
   └─ schemas/

Arquitetura em camadas:
Rotas → Controllers → Services → Middleware → Prisma

------------------------------------------------------------
3. REQUISITOS
------------------------------------------------------------
- Node.js 18+
- npm
- Banco MySQL/MariaDB

------------------------------------------------------------
4. CONFIGURAÇÃO .env
------------------------------------------------------------
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/zenup"
JWT_SECRET="sua_chave_super_secreta_aqui"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"

------------------------------------------------------------
5. PASSO A PASSO PARA INICIALIZAR
------------------------------------------------------------

1) Instalar dependências:
npm install

2) Criar banco:
CREATE DATABASE zenup;

3) Rodar migrations:
npx prisma migrate dev

5) Iniciar servidor:
npm run dev

API: http://localhost:3000  
Swagger: http://localhost:3000/api-docs

------------------------------------------------------------
6. AUTENTICAÇÃO E AUTORIZAÇÃO
------------------------------------------------------------
- JWT via Authorization: Bearer TOKEN
- authMiddleware → valida token
- roleMiddleware → valida papel (gestor)
- companyAccess → valida empresa do gestor

------------------------------------------------------------
7. ENDPOINTS DA API
------------------------------------------------------------

-------------------
AUTENTICAÇÃO
-------------------

1) POST /api/auth/login
2) POST /api/login (mobile)

Body:
{
 "email": "x",
 "senha": "x"
}

Retorno:
{
 "message": "...",
 "token": "JWT",
 "user": { ... }
}

-------------------
USUÁRIOS (CRUD)
-------------------
Montados em /api/users/usuarios

POST /api/users/usuarios  
GET /api/users/usuarios  
GET /api/users/usuarios/:id  
PUT /api/users/usuarios/:id  
DELETE /api/users/usuarios/:id  
GET /api/users/usuarios/:id/empresa  

-------------------
CHECK-IN / RESPOSTAS
-------------------
POST /api/answer

Body:
{
 "humor": 7,
 "energia": 8,
 "estresse": 3,
 "resumo": "dia tranquilo"
}

-------------------
DASHBOARD (GESTOR)
-------------------
Protegido por:
- JWT
- checkRole('gestor')
- companyAccess

Endpoints:
GET /api/dashboard/empresas/:id/indicadores  
GET /api/dashboard/empresas/:id/usuarios  
GET /api/dashboard/empresas/:id/diarios  
GET /api/dashboard/empresas/:id/checkins-diarios  
GET /api/dashboard/empresas/:id_empresa/metrics/daily  
GET /api/dashboard/empresas/:id_empresa/metrics/checkins-comparison  
GET /api/dashboard/empresas/:id_empresa/metrics/mood  
GET /api/dashboard/empresas/:id_empresa/metrics/suggestions  

-------------------
ENDPOINTS MOBILE
-------------------

1) POST /api/registro-diario
Body:
{
 "humor": 5,
 "energia": 6,
 "estresse": 4
}

2) GET /api/resumo/:id_usuario

3) POST /api/chat
Body:
{
 "id": 1,
 "texto": "mensagem"
}

------------------------------------------------------------
8. DOCUMENTAÇÃO SWAGGER
------------------------------------------------------------
GET /api-docs

------------------------------------------------------------
9. SCRIPTS
------------------------------------------------------------
npm run dev  
npm start  
npm run seed (caso crie o arquivo seed.js)

------------------------------------------------------------
10. RESUMO FINAL PARA ENTREGA
------------------------------------------------------------
- API REST completa em Node.js/Express
- Prisma ORM (MySQL)
- Autenticação JWT
- Controle de papel (gestor/colaborador)
- Dashboard com métricas e indicadores
- Endpoints mobile e web
- Documentação Swagger integrada

FIM DO README
