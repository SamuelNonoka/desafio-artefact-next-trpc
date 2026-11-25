import { vi } from "vitest";
import type { ITaskRepository } from "@/src/domain/ITask.repository";
import type { Task } from "@/src/domain/Task";

export function makeRepoMock(): { [K in keyof ITaskRepository]: ReturnType<typeof vi.fn> } & ITaskRepository {
  return {
    findAfter: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } as never;
}

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    titulo: "Titulo",
    descricao: "Descricao",
    dataCriacao: new Date("2025-01-01T00:00:00.000Z"),
    ...overrides,
  };
}
