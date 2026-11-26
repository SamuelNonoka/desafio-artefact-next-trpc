import { PrismaClient } from "@prisma/client";
import { makeUseCases } from "./application/use-cases";
import { PrismaTaskRepository } from "./infra/repository/prisma/PrismaTask.repository";

/**
 * Composition root: the only place that decides which concrete implementations to use.
 * To switch databases, just swap the repository here.
 */
export const useCases = makeUseCases(
  new PrismaTaskRepository(new PrismaClient()),
);
