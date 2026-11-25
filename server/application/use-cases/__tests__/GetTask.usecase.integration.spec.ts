import { describe, expect, it } from "vitest";
import { TaskNotFoundError } from "@/server/domain/Errors";
import { setupIntegration } from "./integration-helpers";

const ctx = setupIntegration();

describe("FindTaskUseCase (integração)", () => {
  it("retorna a tarefa criada", async () => {
    const created = await ctx.useCases.createTask.execute({
      titulo: "T",
      descricao: "D",
    });

    await expect(ctx.useCases.getTask.execute(created.id)).resolves.toEqual(
      created,
    );
  });

  it("lança TaskNotFoundError para id inexistente", async () => {
    await expect(ctx.useCases.getTask.execute("nope")).rejects.toBeInstanceOf(
      TaskNotFoundError,
    );
  });
});
