import { describe, expect, it } from "vitest";
import { TaskNotFoundError } from "@/server/domain/Errors";
import { DeleteTaskUseCase } from "../DeleteTask.usecase";
import { makeRepoMock, makeTask } from "./helpers";

describe("DeleteTaskUseCase", () => {
  it("remove a tarefa quando ela existe", async () => {
    const repo = makeRepoMock();
    repo.findById.mockResolvedValue(makeTask());
    repo.delete.mockResolvedValue(undefined);

    await expect(new DeleteTaskUseCase(repo).execute("task-1")).resolves.toBeUndefined();

    expect(repo.findById).toHaveBeenCalledWith("task-1");
    expect(repo.delete).toHaveBeenCalledWith("task-1");
  });

  it("lança TaskNotFoundError e não deleta quando não existe", async () => {
    const repo = makeRepoMock();
    repo.findById.mockResolvedValue(undefined);

    await expect(new DeleteTaskUseCase(repo).execute("x")).rejects.toBeInstanceOf(
      TaskNotFoundError,
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
