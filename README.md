# Artefact Challenge — Tasks with Next.js + tRPC

🇧🇷 [Leia em português](README-PT.md)

Task management application (CRUD) built with **Next.js (App Router)** and **tRPC**, with persistence in **SQLite** via **Prisma**.

Features:

- Task listing with **infinite scroll** (cursor-based pagination)
- Creating, editing and deleting tasks (with a confirmation dialog)
- Form validation with **Zod** + **React Hook Form**
- Loading, error and "not found" states

## Stack

| Layer            | Technologies                                                 |
| ---------------- | ------------------------------------------------------------ |
| Frontend         | Next.js 16, React 19, Tailwind CSS 4, TanStack Query, Sonner |
| API              | tRPC 11 (route `/api/trpc`), Zod, SuperJSON                  |
| Database         | Prisma 6 + SQLite                                            |
| Testing          | Vitest, Testing Library, Playwright                          |
| UI documentation | Storybook 10                                                 |

## Project structure

```
app/                     # Frontend (Next.js App Router)
├── api/trpc/[trpc]/     # tRPC HTTP handler
├── components/          # Shared components (ui/ and shared/)
├── task/                # Task pages, components and hooks
│   ├── new/             # /task/new  — create task
│   └── [id]/edit/       # /task/:id/edit — edit task
└── page.tsx             # /  — listing

server/                  # Backend (layered architecture)
├── domain/              # Task entity, Zod schemas, errors, repository contract
├── application/         # Use cases (Create, Get, List, Update, Delete)
├── infra/repository/    # Repositories: Prisma and in-memory
├── infra/http/trpc/     # tRPC routers and domain error mapping
└── Bootstrap.ts         # Composition root (injects the repository into the use cases)

prisma/                  # Schema, migrations and seed
e2e/                     # End-to-end tests (Playwright)
```

## Prerequisites

- **Node.js 20.12+** (22 or later recommended)
- **npm**
- **Google Chrome** installed — only required for the E2E tests

## Installation

```bash
git clone <repository-url>
cd desafio-artefact-next-trpc
npm install
```

`npm install` already runs `prisma generate` (`postinstall` script), which generates the Prisma Client. Only run `npm run db:generate` manually if you install the dependencies with `--ignore-scripts` or after changing `prisma/schema.prisma`.

## Setup

### Summary — first installation

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Details for each step are below.

### 1. Environment variables

```bash
cp .env.example .env
```

The essential variable is `DATABASE_URL`, which points to the SQLite file (path relative to the `prisma/` folder):

```env
DATABASE_URL="file:./dev.db"
```

### 2. Database (required on first installation)

The SQLite database file (`prisma/dev.db`) **is not included in the repository**. Without creating it, the application fails when accessing the `Task` table. Create the database and apply the migrations:

```bash
npm run db:migrate
```

When creating the database, this command also runs the seed and inserts 35 sample tasks, which is useful for testing the infinite scroll.

To repopulate the database later (the seed **deletes all tasks** before inserting the sample ones):

```bash
npm run db:seed
```

> In CI or production, use `npm run db:deploy` (`prisma migrate deploy`): it only applies the existing migrations, with no interactive prompts and without running the seed.

### 3. Running the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build and run the production version:

```bash
npm run build
npm run start
```

## Testing

### Unit and integration (Vitest)

```bash
npm test             # runs once
npm run test:watch   # watch mode
```

They cover the use cases (unit tests with mocks and integration tests with the in-memory repository), the Prisma repository, the pagination cursor and frontend hooks. No database is required.

### End-to-end (Playwright)

On the first run, install the Playwright dependencies:

```bash
npx playwright install
```

Then run:

```bash
npm run test:e2e      # resets the test database and runs the tests
npm run test:e2e:ui   # opens the interactive Playwright UI
```

The E2E tests:

- use a separate database (`prisma/e2e.db`), reset before each run — the development database is not affected;
- automatically start a Next.js server on port **3100**;
- run on the **Google Chrome** installed on the system;
- cover listing, creation, editing, deletion and the "not found" page.

The HTML report is written to `playwright-report/` (`npx playwright show-report`).

### Code quality

```bash
npm run lint        # ESLint
npm run typecheck   # type checking (tsc)
```

## Storybook

UI components have stories in `__stories__/` folders:

```bash
npm run storybook         # http://localhost:6006
npm run build-storybook   # static build in storybook-static/
```

## Available scripts

| Script                    | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `npm run dev`             | Development server                             |
| `npm run build`           | Production build                               |
| `npm run start`           | Production server                              |
| `npm run lint`            | ESLint                                         |
| `npm run typecheck`       | Type checking                                  |
| `npm test`                | Unit and integration tests                     |
| `npm run test:watch`      | Tests in watch mode                            |
| `npm run test:e2e`        | End-to-end tests                               |
| `npm run test:e2e:ui`     | End-to-end tests with UI                       |
| `npm run db:generate`     | Generates the Prisma Client                    |
| `npm run db:migrate`      | Creates/applies migrations (development)       |
| `npm run db:deploy`       | Applies migrations (production)                |
| `npm run db:reset`        | Drops and recreates the database               |
| `npm run db:seed`         | Populates the database with sample data        |
| `npm run db:studio`       | Opens Prisma Studio                            |
| `npm run storybook`       | Storybook in development mode                  |
| `npm run build-storybook` | Static Storybook build                         |

## API (tRPC)

Exposed at `/api/trpc`, with the `task` router:

| Procedure     | Type     | Input                                    |
| ------------- | -------- | ---------------------------------------- |
| `task.list`   | query    | `{ cursor?, limit? (1–50, default 10) }` |
| `task.byId`   | query    | `{ id }`                                 |
| `task.create` | mutation | `{ titulo, descricao? }`                 |
| `task.update` | mutation | `{ id, titulo, descricao? }`             |
| `task.delete` | mutation | `{ id }`                                 |

Validation rules: `titulo` (title) is required (up to 120 characters); `descricao` (description) is optional (up to 1000 characters).

## Technical decisions

As required by the project, I developed a task management application using **Next.js** and **tRPC**.

### Full-stack project in a single repository

The first decision was to keep the full-stack project in a single repository, with tRPC running inside Next.js itself. Since this is a simple project, this option proved to be the most practical and viable: it removes the need for two repositories, Docker and additional infrastructure.

### Backend

I chose a modular architecture, aiming to make the codebase easier to maintain and grow. A simpler approach would be enough for the current scope, but I chose this one because it is more didactic and shows how I like to split responsibilities and organize code.

The structure isolates the application core (`domain`) and the use case layer (`application`) from the concrete implementations (`infra`). This way, changes to the infrastructure have minimal impact on the business rules.

I used an in-memory database for the test. Thanks to the dependency inversion principle (the "D" in SOLID), the application can evolve to other forms of persistence without changing the domain or the use cases: all it takes is a new repository implementation.

### Frontend

On the frontend, I chose a simple architecture, following React patterns:

- **Componentization**, separating *smart* components (with logic and data access) from *dumb* components (presentation only).
- **MVVM concept**, keeping the main logic in hooks and leaving the components focused on the interface.
- **No global state management**, since the simplicity of the project did not justify it.

Tools used:

- **Tailwind CSS** for styling;
- **Storybook** for component documentation;
- **Vitest** for testing;
- **Playwright** for end-to-end testing.

### Final considerations

I aimed to follow good software engineering practices without making the project overly complex, seeking a balance between organization and simplicity.

If this explanation does not answer all your questions, I will be happy to answer them.

Best regards,
Samuel
