import { describe, expect, it } from "vitest";
import { TaskNotFoundError } from "@/src/domain/Errors";
import { FindTaskUseCase } from "../GetTask.usecase";
import { makeRepoMock, makeTask } from "./helpers";

describe("FindTaskUseCase", () => {
  it("retorna a tarefa encontrada", async () => {
    const repo = makeRepoMock();
    const task = makeTask();
    repo.findById.mockResolvedValue(task);

    await expect(new FindTaskUseCase(repo).execute("task-1")).resolves.toBe(task);
    expect(repo.findById).toHaveBeenCalledWith("task-1");
  });

  it("lança TaskNotFoundError com o id quando não existe", async () => {
    const repo = makeRepoMock();
    repo.findById.mockResolvedValue(undefined);

    await expect(new FindTaskUseCase(repo).execute("nope")).rejects.toMatchObject({
      name: "TaskNotFoundError",
      taskId: "nope",
    });
    await expect(new FindTaskUseCase(repo).execute("nope")).rejects.toBeInstanceOf(
      TaskNotFoundError,
    );
  });
});
