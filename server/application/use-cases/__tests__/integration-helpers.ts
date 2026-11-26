import { afterEach, beforeEach, vi } from "vitest";
import { InMemoryTaskRepository } from "@/server/infra/repository/in-memory/InMemoryTask.respository";
import { makeUseCases, type UseCases } from "..";

/**
 * Registers the test hooks: fake clock (deterministic dataCriacao) and a
 * fresh in-memory repository for each test. Use ctx.useCases inside the tests.
 */
export function setupIntegration(): { useCases: UseCases } {
  const ctx = {} as { useCases: UseCases };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
    ctx.useCases = makeUseCases(new InMemoryTaskRepository());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  return ctx;
}

/** Creates tasks advancing 1s between them; the last one created is the most recent. */
export async function seed(useCases: UseCases, count: number) {
  const created = [];
  for (let n = 1; n <= count; n++) {
    created.push(await useCases.createTask.execute({ titulo: `Tarefa ${n}` }));
    vi.advanceTimersByTime(1000);
  }
  return created;
}

/** Walks through all pages following nextCursor and returns the ids of each page. */
export async function listAll(useCases: UseCases, limit: number) {
  const pages: string[][] = [];
  let cursor: string | undefined;
  do {
    const page = await useCases.listTasks.execute({ cursor, limit });
    pages.push(page.items.map((t) => t.id));
    cursor = page.nextCursor;
  } while (cursor);
  return pages;
}
