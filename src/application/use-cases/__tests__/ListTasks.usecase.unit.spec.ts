import type { Task } from "@/src/domain/Task";
import { describe, expect, it } from "vitest";
import { decodeCursor, encodeCursor } from "../../Cursor";
import { InvalidCursorError } from "@/src/domain/Errors";
import { ListTasksUseCase } from "../ListTasks.usecase";
import { makeRepoMock, makeTask } from "./helpers";

const tasks = [1, 2, 3].map((n) =>
  makeTask({ id: `t${n}`, dataCriacao: new Date(2025, 0, 10 - n) }),
) as [Task, Task, Task];

describe("ListTasksUseCase", () => {
  it("busca limit + 1 itens e não retorna cursor quando não há mais páginas", async () => {
    const repo = makeRepoMock();
    repo.findAfter.mockResolvedValue(tasks.slice(0, 2));

    const result = await new ListTasksUseCase(repo).execute({ limit: 3 });

    expect(repo.findAfter).toHaveBeenCalledWith({ after: undefined, take: 4 });
    expect(result).toEqual({ items: tasks.slice(0, 2), nextCursor: undefined });
  });

  it("não retorna cursor quando a quantidade é exatamente o limit", async () => {
    const repo = makeRepoMock();
    repo.findAfter.mockResolvedValue(tasks.slice(0, 2));

    const result = await new ListTasksUseCase(repo).execute({ limit: 2 });

    expect(result.items).toHaveLength(2);
    expect(result.nextCursor).toBeUndefined();
  });

  it("corta o item extra e gera cursor do último item retornado", async () => {
    const repo = makeRepoMock();
    repo.findAfter.mockResolvedValue(tasks);

    const result = await new ListTasksUseCase(repo).execute({ limit: 2 });

    expect(result.items).toEqual(tasks.slice(0, 2));
    expect(decodeCursor(result.nextCursor!)).toEqual({
      id: "t2",
      dataCriacao: tasks[1].dataCriacao,
    });
  });

  it("decodifica o cursor recebido e o repassa ao repositório", async () => {
    const repo = makeRepoMock();
    repo.findAfter.mockResolvedValue([]);
    const cursor = encodeCursor(tasks[0]);

    const result = await new ListTasksUseCase(repo).execute({ cursor, limit: 5 });

    expect(repo.findAfter).toHaveBeenCalledWith({
      after: { id: "t1", dataCriacao: tasks[0].dataCriacao },
      take: 6,
    });
    expect(result).toEqual({ items: [], nextCursor: undefined });
  });

  it("lança InvalidCursorError para cursor malformado sem consultar o repositório", async () => {
    const repo = makeRepoMock();

    await expect(
      new ListTasksUseCase(repo).execute({ cursor: "invalido", limit: 5 }),
    ).rejects.toBeInstanceOf(InvalidCursorError);
    expect(repo.findAfter).not.toHaveBeenCalled();
  });
});
