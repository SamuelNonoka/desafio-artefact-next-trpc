import { PrismaClient } from "@prisma/client";
import { makeUseCases } from "./application/use-cases";
import { PrismaTaskRepository } from "./infra/repository/prisma/PrismaTask.repository";

/**
 * Composition root: o único lugar que decide quais implementações concretas usar.
 * Para trocar de banco, basta trocar o repositório aqui.
 */
export const useCases = makeUseCases(
  new PrismaTaskRepository(new PrismaClient()),
);
