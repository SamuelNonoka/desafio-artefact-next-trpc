import { Prisma, type PrismaClient } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { TaskNotFoundError } from "@/src/domain/Errors";
import { PrismaTaskRepository } from "../PrismaTask.repository";

const date = new Date("2024-01-01T00:00:00.000Z");

function makeRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "task-1",
    titulo: "Titulo",
    descricao: "Descricao" as string | null,
    dataCriacao: date,
    ...overrides,
  };
}

function makeSut() {
  const task = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const repo = new PrismaTaskRepository({ task } as unknown as PrismaClient);
  return { repo, task };
}

function prismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("erro", {
    code,
    clientVersion: "test",
  });
}

describe("PrismaTaskRepository", () => {
  describe("findAfter", () => {
    it("sem cursor: não filtra e ordena por dataCriacao desc, id desc", async () => {
      const { repo, task } = makeSut();
      task.findMany.mockResolvedValue([makeRow()]);

      const result = await repo.findAfter({ take: 5 });

      expect(task.findMany).toHaveBeenCalledWith({
        take: 5,
        where: undefined,
        orderBy: [{ dataCriacao: "desc" }, { id: "desc" }],
      });
      expect(result).toEqual([
        { id: "task-1", titulo: "Titulo", descricao: "Descricao", dataCriacao: date },
      ]);
    });

    it("com cursor: filtra itens estritamente depois da posição", async () => {
      const { repo, task } = makeSut();
      task.findMany.mockResolvedValue([]);

      await repo.findAfter({ take: 3, after: { dataCriacao: date, id: "x" } });

      expect(task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { dataCriacao: { lt: date } },
              { dataCriacao: date, id: { lt: "x" } },
            ],
          },
        }),
      );
    });

    it("converte descricao null em undefined", async () => {
      const { repo, task } = makeSut();
      task.findMany.mockResolvedValue([makeRow({ descricao: null })]);

      const [item] = await repo.findAfter({ take: 1 });

      expect(item?.descricao).toBeUndefined();
    });
  });

  describe("findById", () => {
    it("retorna a tarefa mapeada", async () => {
      const { repo, task } = makeSut();
      task.findUnique.mockResolvedValue(makeRow());

      await expect(repo.findById("task-1")).resolves.toMatchObject({ id: "task-1" });
      expect(task.findUnique).toHaveBeenCalledWith({ where: { id: "task-1" } });
    });

    it("retorna undefined quando não existe", async () => {
      const { repo, task } = makeSut();
      task.findUnique.mockResolvedValue(null);

      await expect(repo.findById("nope")).resolves.toBeUndefined();
    });
  });

  describe("create", () => {
    it("persiste titulo e descricao e retorna a tarefa de domínio", async () => {
      const { repo, task } = makeSut();
      task.create.mockResolvedValue(makeRow({ descricao: null }));

      const result = await repo.create({ titulo: "Titulo" });

      expect(task.create).toHaveBeenCalledWith({
        data: { titulo: "Titulo", descricao: undefined },
      });
      expect(result.descricao).toBeUndefined();
    });
  });

  describe("update", () => {
    it("atualiza titulo e descricao", async () => {
      const { repo, task } = makeSut();
      task.update.mockResolvedValue(makeRow({ titulo: "Novo" }));

      const result = await repo.update("task-1", { titulo: "Novo", descricao: "D" });

      expect(task.update).toHaveBeenCalledWith({
        where: { id: "task-1" },
        data: { titulo: "Novo", descricao: "D" },
      });
      expect(result?.titulo).toBe("Novo");
    });

    it("descrição ausente vira null para limpar o campo", async () => {
      const { repo, task } = makeSut();
      task.update.mockResolvedValue(makeRow({ descricao: null }));

      await repo.update("task-1", { titulo: "T" });

      expect(task.update).toHaveBeenCalledWith({
        where: { id: "task-1" },
        data: { titulo: "T", descricao: null },
      });
    });

    it("retorna undefined em P2025 (não encontrada)", async () => {
      const { repo, task } = makeSut();
      task.update.mockRejectedValue(prismaError("P2025"));

      await expect(repo.update("nope", { titulo: "T" })).resolves.toBeUndefined();
    });

    it("propaga outros erros", async () => {
      const { repo, task } = makeSut();
      const error = prismaError("P2002");
      task.update.mockRejectedValue(error);

      await expect(repo.update("task-1", { titulo: "T" })).rejects.toBe(error);
    });
  });

  describe("delete", () => {
    it("exclui pelo id", async () => {
      const { repo, task } = makeSut();
      task.delete.mockResolvedValue(makeRow());

      await expect(repo.delete("task-1")).resolves.toBeUndefined();
      expect(task.delete).toHaveBeenCalledWith({ where: { id: "task-1" } });
    });

    it("lança TaskNotFoundError em P2025", async () => {
      const { repo, task } = makeSut();
      task.delete.mockRejectedValue(prismaError("P2025"));

      await expect(repo.delete("nope")).rejects.toBeInstanceOf(TaskNotFoundError);
    });

    it("propaga outros erros", async () => {
      const { repo, task } = makeSut();
      const error = new Error("boom");
      task.delete.mockRejectedValue(error);

      await expect(repo.delete("task-1")).rejects.toBe(error);
    });
  });
});
