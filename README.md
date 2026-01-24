# Aplicação CRUD com Node.js e Oracle Database

Esta é uma aplicação de exemplo que demonstra a implementação de um sistema CRUD (Create, Read, Update, Delete) completo utilizando Node.js, o framework Express e um banco de dados Oracle. A aplicação expõe uma API RESTful para gerenciar uma tabela de usuários.

## Funcionalidades

- **API RESTful** completa para operações com usuários.
- **Conexão com Oracle Database** utilizando a biblioteca `oracledb`.
- **Connection Pooling** para gerenciamento eficiente de conexões com o banco de dados.
- **Estrutura de projeto organizada** (Models, Views, Controllers).
- **Gerenciamento de dependências** com `npm`.
- **Variáveis de ambiente** para configuração segura com `dotenv`.
- **Tratamento de erros** e encerramento gracioso da aplicação.

## Estrutura do Projeto

A estrutura de diretórios foi organizada para separar as responsabilidades, seguindo as melhores práticas de desenvolvimento de software:

```
/nodejs-oracle-crud
├── src/
│   ├── config/
│   │   └── database.js       # Configuração da conexão com o Oracle (Connection Pool)
│   ├── controllers/
│   │   └── userController.js # Lógica de negócio e controle das requisições
│   ├── models/
│   │   └── userModel.js      # Funções para interagir com o banco de dados (CRUD)
│   ├── routes/
│   │   └── userRoutes.js     # Definição das rotas da API
│   └── app.js                # Arquivo principal da aplicação Express
├── .env                      # Arquivo para variáveis de ambiente (NÃO versionado)
├── .env.example              # Exemplo de arquivo .env
├── .gitignore                # Arquivos e pastas a serem ignorados pelo Git
├── database-setup.sql        # Script SQL para criar a tabela de usuários
├── package.json              # Metadados e dependências do projeto
└── README.md                 # Documentação do projeto
```

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (geralmente instalado com o Node.js)
- Acesso a um banco de dados Oracle (local ou remoto)

## Como Configurar e Executar

### 1. Clone o Repositório

```bash
# (Exemplo, já que você receberá o projeto em um .zip)
git clone https://github.com/AndersonGL/Crud-com-Node.js-e-Oracle-SQL-.git
cd Crud-com-Node.js-e-Oracle-SQL-
```

### 2. Instale as Dependências

Execute o comando abaixo na raiz do projeto para instalar todas as bibliotecas necessárias listadas no `package.json`.

```bash
npm install
```

### 3. Configure o Banco de Dados

Execute o script `database-setup.sql` em seu ambiente Oracle para criar a tabela `users` e inserir alguns dados de exemplo. Você pode usar uma ferramenta como SQL Developer, DBeaver ou o próprio SQL*Plus.

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, copiando o conteúdo do `.env.example`. Em seguida, preencha com as suas credenciais de acesso ao banco de dados Oracle.

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```ini
# Oracle Database Configuration
DB_USER=seu_usuario_oracle
DB_PASSWORD=sua_senha_oracle
DB_CONNECTION_STRING=localhost:1521/FREEPDB1

# Server Configuration
PORT=3000

# Pool Configuration
POOL_MIN=2
POOL_MAX=10
POOL_INCREMENT=1
```

### 5. Inicie a Aplicação

Para iniciar o servidor em modo de desenvolvimento (com reinicialização automática ao salvar arquivos), use:

```bash
npm run dev
```

Para iniciar em modo de produção:

```bash
npm start
```

Após a inicialização, a API estará disponível em `http://localhost:3000`.

## Endpoints da API

A base da URL para os endpoints de usuários é `/api/users`.

| Método | Endpoint                 | Descrição                               |
|--------|--------------------------|-------------------------------------------|
| `GET`    | `/`                      | Lista todos os usuários.                  |
| `GET`    | `/:id`                   | Busca um usuário específico pelo seu ID.  |
| `GET`    | `/email/:email`          | Busca um usuário específico pelo email.   |
| `GET`    | `/count`                 | Retorna a contagem total de usuários.     |
| `POST`   | `/`                      | Cria um novo usuário.                     |
| `PUT`    | `/:id`                   | Atualiza um usuário existente.            |
| `DELETE` | `/:id`                   | Remove um usuário.                        |

### Exemplo de Corpo para `POST` e `PUT`

O corpo da requisição deve ser um JSON com os seguintes campos:

```json
{
    "name": "Nome do Usuário",
    "email": "usuario@example.com",
    "age": 30
}
```

- `name` e `email` são obrigatórios para criação.
- Para atualização, envie apenas os campos que deseja modificar.

## Considerações Finais

Este projeto serve como um ponto de partida robusto para o desenvolvimento de aplicações Node.js com Oracle. As melhores práticas, como o uso de connection pooling e a separação de responsabilidades, foram aplicadas para garantir um código escalável e de fácil manutenção.
