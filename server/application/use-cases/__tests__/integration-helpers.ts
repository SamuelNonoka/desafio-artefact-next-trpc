import { afterEach, beforeEach, vi } from "vitest";
import { InMemoryTaskRepository } from "@/server/infra/in-memory/InMemoryTask.respository";
import { makeUseCases, type UseCases } from "..";

/**
 * Registra os hooks do teste: relógio falso (dataCriacao determinística) e um
 * repositório em memória novo a cada teste. Use ctx.useCases dentro dos testes.
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

/** Cria tarefas avançando 1s entre elas; a última criada é a mais recente. */
export async function seed(useCases: UseCases, count: number) {
  const created = [];
  for (let n = 1; n <= count; n++) {
    created.push(await useCases.createTask.execute({ titulo: `Tarefa ${n}` }));
    vi.advanceTimersByTime(1000);
  }
  return created;
}

/** Percorre todas as páginas seguindo nextCursor e retorna os ids de cada página. */
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
