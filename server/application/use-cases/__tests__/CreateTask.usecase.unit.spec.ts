import { describe, expect, it } from "vitest";
import { CreateTaskUseCase } from "../CreateTask.usecase";
import { makeRepoMock, makeTask } from "./helpers";

describe("CreateTaskUseCase", () => {
  it("cria a tarefa via repositório e a retorna", async () => {
    const repo = makeRepoMock();
    const created = makeTask();
    repo.create.mockResolvedValue(created);

    const input = { titulo: "Titulo", descricao: "Descricao" };
    const result = await new CreateTaskUseCase(repo).execute(input);

    expect(repo.create).toHaveBeenCalledWith(input);
    expect(result).toBe(created);
  });

  it("propaga erros do repositório", async () => {
    const repo = makeRepoMock();
    repo.create.mockRejectedValue(new Error("falha"));

    await expect(
      new CreateTaskUseCase(repo).execute({ titulo: "x" }),
    ).rejects.toThrow("falha");
  });
});
