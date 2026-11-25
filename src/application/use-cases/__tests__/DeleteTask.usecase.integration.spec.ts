import { describe, expect, it } from "vitest";
import { TaskNotFoundError } from "@/src/domain/Errors";
import { seed, setupIntegration } from "./integration-helpers";

const ctx = setupIntegration();

describe("DeleteTaskUseCase (integração)", () => {
  it("remove a tarefa e ela some da busca e da listagem", async () => {
    const [a, b] = await seed(ctx.useCases, 2);

    await ctx.useCases.deleteTask.execute(a!.id);

    await expect(ctx.useCases.getTask.execute(a!.id)).rejects.toBeInstanceOf(
      TaskNotFoundError,
    );
    const { items } = await ctx.useCases.listTasks.execute({ limit: 10 });
    expect(items.map((t) => t.id)).toEqual([b!.id]);
  });

  it("excluir duas vezes lança TaskNotFoundError", async () => {
    const created = await ctx.useCases.createTask.execute({ titulo: "T" });
    await ctx.useCases.deleteTask.execute(created.id);

    await expect(
      ctx.useCases.deleteTask.execute(created.id),
    ).rejects.toBeInstanceOf(TaskNotFoundError);
  });

  it("lança TaskNotFoundError para id inexistente", async () => {
    await expect(ctx.useCases.deleteTask.execute("nope")).rejects.toBeInstanceOf(
      TaskNotFoundError,
    );
  });
});
