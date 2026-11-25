# Desafio Artefact — Tarefas com Next.js + tRPC

🇺🇸 [Read in English](README.md)

Aplicação de gerenciamento de tarefas (CRUD) construída com **Next.js (App Router)** e **tRPC**, com persistência em **SQLite** via **Prisma**.

Funcionalidades:

- Listagem de tarefas com **scroll infinito** (paginação por cursor)
- Criação, edição e exclusão de tarefas (com diálogo de confirmação)
- Validação de formulário com **Zod** + **React Hook Form**
- Estados de carregamento, erro e "não encontrado"

## Stack

| Camada         | Tecnologias                                                |
| -------------- | ---------------------------------------------------------- |
| Frontend       | Next.js 16, React 19, Tailwind CSS 4, TanStack Query, Sonner |
| API            | tRPC 11 (rota `/api/trpc`), Zod, SuperJSON                 |
| Banco de dados | Prisma 6 + SQLite                                          |
| Testes         | Vitest, Testing Library, Playwright                        |
| Documentação UI | Storybook 10                                              |

## Estrutura do projeto

```
app/                     # Frontend (Next.js App Router)
├── api/trpc/[trpc]/     # Handler HTTP do tRPC
├── components/          # Componentes compartilhados (ui/ e shared/)
├── task/                # Páginas, componentes e hooks de tarefas
│   ├── new/             # /task/new  — criar tarefa
│   └── [id]/edit/       # /task/:id/edit — editar tarefa
└── page.tsx             # /  — listagem

server/                  # Backend (arquitetura em camadas)
├── domain/              # Entidade Task, schemas Zod, erros, contrato do repositório
├── application/         # Casos de uso (Create, Get, List, Update, Delete)
├── infra/repository/    # Repositórios: Prisma e em memória
├── infra/http/trpc/     # Routers tRPC e mapeamento de erros de domínio
└── Bootstrap.ts         # Composition root (injeta o repositório nos casos de uso)

prisma/                  # Schema, migrations e seed
e2e/                     # Testes end-to-end (Playwright)
```

## Pré-requisitos

- **Node.js 20.12+** (recomendado 22 ou superior)
- **npm**
- **Google Chrome** instalado — necessário apenas para os testes E2E

## Instalação

```bash
git clone <url-do-repositorio>
cd desafio-artefact-next-trpc
npm install
```

O `npm install` já executa o `prisma generate` (script `postinstall`), que gera o Prisma Client. Rode `npm run db:generate` manualmente só se instalar as dependências com `--ignore-scripts` ou depois de alterar o `prisma/schema.prisma`.

## Setup

### Resumo — primeira instalação

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Os detalhes de cada passo estão abaixo.

### 1. Variáveis de ambiente

```bash
cp .env.example .env
```

A variável essencial é a `DATABASE_URL`, que aponta para o arquivo SQLite (caminho relativo à pasta `prisma/`):

```env
DATABASE_URL="file:./dev.db"
```

### 2. Banco de dados (obrigatório na primeira instalação)

O arquivo do banco SQLite (`prisma/dev.db`) **não vem no repositório**. Sem criá-lo, a aplicação falha ao acessar a tabela `Task`. Crie o banco e aplique as migrations:

```bash
npm run db:migrate
```

Ao criar o banco, esse comando já roda o seed e popula 35 tarefas de exemplo, o que é útil para testar o scroll infinito.

Para repopular o banco depois (o seed **apaga todas as tarefas** antes de inserir as de exemplo):

```bash
npm run db:seed
```

> Em CI ou produção, use `npm run db:deploy` (`prisma migrate deploy`): ele só aplica as migrations existentes, sem prompts interativos e sem rodar o seed.

### 3. Rodando a aplicação

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para gerar e rodar a build de produção:

```bash
npm run build
npm run start
```

## Testes

### Unitários e de integração (Vitest)

```bash
npm test             # executa uma vez
npm run test:watch   # modo watch
```

Cobrem os casos de uso (unitários com mocks e integração com o repositório em memória), o repositório Prisma, o cursor de paginação e hooks do frontend. Não precisam de banco de dados.

### End-to-end (Playwright)

Na primeira execução, instale as dependências do Playwright:

```bash
npx playwright install
```

Depois rode:

```bash
npm run test:e2e      # reseta o banco de testes e executa os testes
npm run test:e2e:ui   # abre a interface interativa do Playwright
```

Os testes E2E:

- usam um banco separado (`prisma/e2e.db`), resetado antes de cada execução — o banco de desenvolvimento não é afetado;
- sobem automaticamente um servidor Next.js na porta **3100**;
- rodam no **Google Chrome** instalado no sistema;
- cobrem listagem, criação, edição, exclusão e a página de "não encontrado".

O relatório HTML fica em `playwright-report/` (`npx playwright show-report`).

### Qualidade de código

```bash
npm run lint        # ESLint
npm run typecheck   # checagem de tipos (tsc)
```

## Storybook

Os componentes de UI possuem stories em pastas `__stories__/`:

```bash
npm run storybook         # http://localhost:6006
npm run build-storybook   # build estático em storybook-static/
```

## Scripts disponíveis

| Script                    | Descrição                                          |
| ------------------------- | -------------------------------------------------- |
| `npm run dev`             | Servidor de desenvolvimento                        |
| `npm run build`           | Build de produção                                  |
| `npm run start`           | Servidor de produção                               |
| `npm run lint`            | ESLint                                             |
| `npm run typecheck`       | Checagem de tipos                                  |
| `npm test`                | Testes unitários e de integração                   |
| `npm run test:watch`      | Testes em modo watch                               |
| `npm run test:e2e`        | Testes end-to-end                                  |
| `npm run test:e2e:ui`     | Testes end-to-end com interface                    |
| `npm run db:generate`     | Gera o Prisma Client                               |
| `npm run db:migrate`      | Cria/aplica migrations (desenvolvimento)           |
| `npm run db:deploy`       | Aplica migrations (produção)                       |
| `npm run db:reset`        | Apaga e recria o banco                             |
| `npm run db:seed`         | Popula o banco com dados de exemplo                |
| `npm run db:studio`       | Abre o Prisma Studio                               |
| `npm run storybook`       | Storybook em modo desenvolvimento                  |
| `npm run build-storybook` | Build estático do Storybook                        |

## API (tRPC)

Exposta em `/api/trpc`, com o router `task`:

| Procedure     | Tipo     | Entrada                                  |
| ------------- | -------- | ---------------------------------------- |
| `task.list`   | query    | `{ cursor?, limit? (1–50, padrão 10) }`  |
| `task.byId`   | query    | `{ id }`                                 |
| `task.create` | mutation | `{ titulo, descricao? }`                 |
| `task.update` | mutation | `{ id, titulo, descricao? }`             |
| `task.delete` | mutation | `{ id }`                                 |

Regras de validação: `titulo` obrigatório (até 120 caracteres); `descricao` opcional (até 1000 caracteres).

## Decisões técnicas

Como requisito do projeto, desenvolvi uma aplicação de gerenciamento de tarefas utilizando **Next.js** e **tRPC**.

### Projeto full-stack em um único repositório

A primeira decisão foi manter o projeto full-stack em um único repositório, com o tRPC rodando dentro do próprio Next.js. Por se tratar de um projeto simples, essa opção se mostrou a mais prática e viável: elimina a necessidade de dois repositórios, de Docker e de infraestrutura adicional.

### Backend

Optei por uma arquitetura modular, com o objetivo de facilitar a manutenção e o crescimento da base de código. Uma abordagem mais simples seria suficiente para o escopo atual, mas escolhi esta por ser mais didática e por demonstrar como gosto de dividir responsabilidades e organizar o código.

A estrutura isola o núcleo da aplicação (`domain`) e a camada de casos de uso (`application`) das implementações concretas (`infra`). Dessa forma, mudanças na infraestrutura têm impacto mínimo nas regras de negócio.

Utilizei um banco de dados em memória para o teste. Graças ao princípio de inversão de dependência (o "D" do SOLID), a aplicação pode evoluir para outras formas de persistência sem alterar o domínio nem os casos de uso: basta criar uma nova implementação do repositório.

### Frontend

No frontend, optei por uma arquitetura simples, seguindo os padrões do React:

- **Componentização**, com a separação entre componentes *smart* (com lógica e acesso a dados) e *dumb* (apenas apresentação).
- **Conceito de MVVM**, concentrando a lógica principal em hooks e deixando os componentes focados na interface.
- **Sem gerenciamento de estado global**, pois a simplicidade do projeto não justificava essa necessidade.

Ferramentas utilizadas:

- **Tailwind CSS** para a estilização;
- **Storybook** para a documentação dos componentes;
- **Vitest** para os testes;
- **Playwright** para os testes end-to-end.

### Considerações finais

Procurei seguir boas práticas de engenharia de software sem tornar o projeto excessivamente complexo, buscando um equilíbrio entre organização e simplicidade.

Caso esta explicação não esclareça todas as dúvidas, ficarei feliz em respondê-las.

Atenciosamente,
Samuel
