# API Biblioteca SENAI

Projeto desenvolvido como atividade avaliativa do curso técnico do SENAI. A aplicação consiste em uma API REST para gerenciamento de usuários, clientes, livros e movimentações de estoque de uma biblioteca.

## Objetivos

- Cadastrar usuários e clientes.
- Autenticar usuários por meio de login e token JWT.
- Cadastrar, listar e remover livros.
- Controlar entradas e saídas do estoque.
- Restringir operações de acordo com o tipo de usuário.
- Persistir os dados em um banco MariaDB.

## Tecnologias utilizadas

- Node.js
- Express
- Sequelize
- MariaDB
- JSON Web Token (JWT)
- bcrypt para criptografia de senhas
- dotenv para variáveis de ambiente

## Pré-requisitos

- Node.js e npm instalados.
- MariaDB em execução.
- Um banco de dados chamado `biblioteca_db`.

## Instalação

1. Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/x86-i386/Biblioteca_Senai.git
cd Biblioteca_Senai
```

2. Entre na pasta da aplicação e instale as dependências:

```bash
cd src
npm install
```

3. Crie um arquivo `.env` dentro da pasta `src`:

```env
DB_NAME=biblioteca_db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=127.0.0.1
DB_PORT=3306
JWT_SECRET=uma_chave_secreta
```

4. Crie o banco de dados e, se necessário, importe a estrutura disponível em [`banco.sql`](banco.sql):

```bash
mariadb -u seu_usuario -p biblioteca_db < banco.sql
```

5. Inicie a API:

```bash
node app.js
```

A aplicação ficará disponível em `http://localhost:3000`.

## Autenticação

As rotas protegidas exigem o cabeçalho abaixo:

```http
Authorization: Bearer SEU_TOKEN
```

O token é obtido pela rota `POST /login` e possui validade de 8 horas.

## Principais rotas

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| `POST` | `/usuarios` | Pública | Cadastra um usuário |
| `POST` | `/clientes` | Pública | Cadastra um cliente |
| `POST` | `/login` | Pública | Realiza login e retorna um token |
| `GET` | `/clientes/perfil` | JWT | Consulta o perfil autenticado |
| `POST` | `/livros` | JWT | Cadastra um livro |
| `GET` | `/livros` | JWT | Lista livros |
| `DELETE` | `/livros/:id` | Administrador | Remove um livro |
| `POST` | `/movimentacoes` | JWT | Registra entrada ou saída de estoque |

## Exemplos de requisições

### Criar usuário

```http
POST /usuarios
Content-Type: application/json
```

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "senha123",
  "tipo": "operador"
}
```

O campo `tipo` aceita `operador` ou `administrador`.

### Fazer login

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "maria@email.com",
  "senha": "senha123"
}
```

### Cadastrar livro

```http
POST /livros
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
```

```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "quantidade_estoque": 10
}
```

### Listar livros

```http
GET /livros?pagina=1&limite=10&nome=Dom
Authorization: Bearer SEU_TOKEN
```

Parâmetros disponíveis:

- `pagina`: número da página, começando em 1.
- `limite`: quantidade de livros por página.
- `nome`: busca parcial pelo título.
- `data`: filtra livros criados a partir da data informada.

### Registrar movimentação

```http
POST /movimentacoes
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
```

```json
{
  "livro_id": 1,
  "tipo": "entrada",
  "quantidade": 2
}
```

O campo `tipo` aceita `entrada` ou `saida`. O sistema impede saídas maiores que o estoque disponível.

## Estrutura do projeto

```text
Biblioteca_Senai/
├── banco.sql
├── README.md
└── src/
    ├── app.js
    ├── package.json
    ├── config/
    │   └── database.js
    ├── controllers/
    ├── middlewares/
    ├── models/
    └── routes/
```

- `controllers/`: regras de negócio e tratamento das requisições.
- `models/`: modelos e relacionamentos do banco de dados.
- `routes/`: definição das rotas da API.
- `middlewares/`: autenticação e controle de permissões.
- `config/`: configuração da conexão com o banco.

## Observações

- As senhas são armazenadas usando hash com bcrypt.
- O banco é sincronizado pelo Sequelize quando a aplicação é iniciada.
- O arquivo `.env` não deve ser versionado, pois contém credenciais locais.

## Autor

Projeto acadêmico desenvolvido para o curso técnico do SENAI.
