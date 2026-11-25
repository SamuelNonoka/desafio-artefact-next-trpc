import { describe, expect, it } from "vitest";
import { InvalidCursorError } from "@/src/domain/Errors";
import { listAll, seed, setupIntegration } from "./integration-helpers";

const ctx = setupIntegration();

describe("ListTasksUseCase (integração)", () => {
  it("ordena da mais recente para a mais antiga", async () => {
    const [first, second, third] = await seed(ctx.useCases, 3);

    const { items, nextCursor } = await ctx.useCases.listTasks.execute({
      limit: 10,
    });

    expect(items.map((t) => t.id)).toEqual([third!.id, second!.id, first!.id]);
    expect(nextCursor).toBeUndefined();
  });

  it("lista vazia não tem itens nem cursor", async () => {
    await expect(ctx.useCases.listTasks.execute({ limit: 5 })).resolves.toEqual({
      items: [],
      nextCursor: undefined,
    });
  });

  it("pagina 5 itens com limit 2 em páginas 2, 2, 1 sem duplicar nem pular", async () => {
    const created = await seed(ctx.useCases, 5);
    const expected = created.map((t) => t.id).reverse();

    const pages = await listAll(ctx.useCases, 2);

    expect(pages.map((p) => p.length)).toEqual([2, 2, 1]);
    expect(pages.flat()).toEqual(expected);
  });

  it("não gera cursor quando a quantidade é exatamente o limit", async () => {
    await seed(ctx.useCases, 4);

    const pages = await listAll(ctx.useCases, 4);

    expect(pages).toHaveLength(1);
    expect(pages[0]).toHaveLength(4);
  });

  it("desempata por id desc quando dataCriacao é igual", async () => {
    // Sem avançar o relógio: todas com o mesmo dataCriacao
    const created = [];
    for (let n = 0; n < 5; n++) {
      created.push(await ctx.useCases.createTask.execute({ titulo: `T${n}` }));
    }
    const expected = created.map((t) => t.id).sort().reverse();

    const pages = await listAll(ctx.useCases, 2);

    expect(pages.flat()).toEqual(expected);
  });

  it("excluir um item já visto não afeta a próxima página", async () => {
    const created = await seed(ctx.useCases, 5); // lista: 5,4,3,2,1
    const firstPage = await ctx.useCases.listTasks.execute({ limit: 2 });
    expect(firstPage.items.map((t) => t.id)).toEqual([
      created[4]!.id,
      created[3]!.id,
    ]);

    await ctx.useCases.deleteTask.execute(created[4]!.id);

    const second = await ctx.useCases.listTasks.execute({
      cursor: firstPage.nextCursor,
      limit: 2,
    });
    expect(second.items.map((t) => t.id)).toEqual([
      created[2]!.id,
      created[1]!.id,
    ]);
  });

  it("lança InvalidCursorError para cursor malformado", async () => {
    await expect(
      ctx.useCases.listTasks.execute({ cursor: "lixo", limit: 2 }),
    ).rejects.toBeInstanceOf(InvalidCursorError);
  });
});
