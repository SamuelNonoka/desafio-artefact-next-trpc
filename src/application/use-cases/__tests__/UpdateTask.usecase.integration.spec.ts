import { describe, expect, it, vi } from "vitest";
import { TaskNotFoundError } from "@/src/domain/Errors";
import { setupIntegration } from "./integration-helpers";

const ctx = setupIntegration();

describe("UpdateTaskUseCase (integração)", () => {
  it("altera titulo e descricao mantendo id e dataCriacao", async () => {
    const created = await ctx.useCases.createTask.execute({
      titulo: "Antigo",
      descricao: "antiga",
    });
    vi.advanceTimersByTime(5000);

    const updated = await ctx.useCases.updateTask.execute({
      id: created.id,
      titulo: "Novo",
      descricao: "nova",
    });

    expect(updated).toEqual({ ...created, titulo: "Novo", descricao: "nova" });
    await expect(ctx.useCases.getTask.execute(created.id)).resolves.toEqual(
      updated,
    );
  });

  it("descrição omitida limpa o campo", async () => {
    const created = await ctx.useCases.createTask.execute({
      titulo: "T",
      descricao: "D",
    });

    const updated = await ctx.useCases.updateTask.execute({
      id: created.id,
      titulo: "T",
    });

    expect(updated.descricao).toBeUndefined();
  });

  it("lança TaskNotFoundError para id inexistente", async () => {
    await expect(
      ctx.useCases.updateTask.execute({ id: "nope", titulo: "X" }),
    ).rejects.toBeInstanceOf(TaskNotFoundError);
  });
});
