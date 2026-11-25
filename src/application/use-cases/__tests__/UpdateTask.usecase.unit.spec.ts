import { describe, expect, it } from "vitest";
import { TaskNotFoundError } from "@/src/domain/Errors";
import { UpdateTaskUseCase } from "../UpdateTask.usecase";
import { makeRepoMock, makeTask } from "./helpers";

describe("UpdateTaskUseCase", () => {
  it("atualiza separando o id dos dados editáveis", async () => {
    const repo = makeRepoMock();
    const updated = makeTask({ titulo: "Novo" });
    repo.update.mockResolvedValue(updated);

    const result = await new UpdateTaskUseCase(repo).execute({
      id: "task-1",
      titulo: "Novo",
      descricao: "Desc",
    });

    expect(repo.update).toHaveBeenCalledWith("task-1", {
      titulo: "Novo",
      descricao: "Desc",
    });
    expect(result).toBe(updated);
  });

  it("lança TaskNotFoundError quando o repositório retorna undefined", async () => {
    const repo = makeRepoMock();
    repo.update.mockResolvedValue(undefined);

    await expect(
      new UpdateTaskUseCase(repo).execute({ id: "x", titulo: "t" }),
    ).rejects.toBeInstanceOf(TaskNotFoundError);
  });
});
