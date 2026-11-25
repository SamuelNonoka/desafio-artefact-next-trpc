import { describe, expect, it } from "vitest";
import { setupIntegration } from "./integration-helpers";

const ctx = setupIntegration();

describe("CreateTaskUseCase (integração)", () => {
  it("cria e recupera a mesma tarefa", async () => {
    const created = await ctx.useCases.createTask.execute({
      titulo: "Estudar",
      descricao: "tRPC",
    });

    expect(created).toMatchObject({ titulo: "Estudar", descricao: "tRPC" });
    expect(created.id).toEqual(expect.any(String));
    expect(created.dataCriacao).toEqual(new Date("2025-01-01T00:00:00.000Z"));
    await expect(ctx.useCases.getTask.execute(created.id)).resolves.toEqual(
      created,
    );
  });

  it("gera ids diferentes para tarefas diferentes", async () => {
    const a = await ctx.useCases.createTask.execute({ titulo: "A" });
    const b = await ctx.useCases.createTask.execute({ titulo: "B" });

    expect(a.id).not.toBe(b.id);
  });

  it("retorna cópias: alterar o resultado não afeta o armazenado", async () => {
    const created = await ctx.useCases.createTask.execute({ titulo: "Original" });
    created.titulo = "Mutado";

    await expect(ctx.useCases.getTask.execute(created.id)).resolves.toMatchObject(
      { titulo: "Original" },
    );
  });
});
