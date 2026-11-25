import { describe, expect, it } from "vitest";
import { InvalidCursorError } from "../../domain/Errors";
import { decodeCursor, encodeCursor } from "../Cursor";

const toCursor = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

describe("encodeCursor", () => {
  const dataCriacao = new Date("2024-05-10T12:30:45.123Z");

  it("retorna string não vazia em formato base64url", () => {
    const cursor = encodeCursor({ dataCriacao, id: "abc" });

    expect(cursor).not.toBe("");
    expect(cursor).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("codifica data (ISO) e id no payload", () => {
    const cursor = encodeCursor({ dataCriacao, id: "abc" });
    const payload = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));

    expect(payload).toEqual({ d: "2024-05-10T12:30:45.123Z", i: "abc" });
  });
});

describe("decodeCursor", () => {
  it("faz round-trip com encodeCursor", () => {
    const dataCriacao = new Date("2024-05-10T12:30:45.123Z");
    const result = decodeCursor(encodeCursor({ dataCriacao, id: "task-1" }));

    expect(result.dataCriacao).toBeInstanceOf(Date);
    expect(result.dataCriacao.getTime()).toBe(dataCriacao.getTime());
    expect(result.id).toBe("task-1");
  });

  it("preserva milissegundos e ids com caracteres especiais", () => {
    const dataCriacao = new Date("2024-01-01T00:00:00.007Z");
    const id = "ção/ü+=?&🚀";
    const result = decodeCursor(encodeCursor({ dataCriacao, id }));

    expect(result.dataCriacao.toISOString()).toBe("2024-01-01T00:00:00.007Z");
    expect(result.id).toBe(id);
  });

  it.each([
    ["string vazia", ""],
    ["lixo não base64", "%%%"],
    ["texto qualquer", "não-é-base64"],
    ["base64 com JSON inválido", Buffer.from("{nope").toString("base64url")],
    ["JSON null", toCursor(null)],
    ["JSON sem campos", toCursor({})],
    ["sem d", toCursor({ i: "x" })],
    ["sem i", toCursor({ d: "2024-05-10T12:30:45.123Z" })],
    ["d numérico", toCursor({ d: 123, i: "x" })],
    ["i numérico", toCursor({ d: "2024-05-10T12:30:45.123Z", i: 1 })],
    ["d com data inválida", toCursor({ d: "abc", i: "x" })],
  ])("lança InvalidCursorError para %s", (_nome, cursor) => {
    expect(() => decodeCursor(cursor)).toThrow(InvalidCursorError);
  });

  it("o erro lançado tem nome e mensagem esperados", () => {
    expect.assertions(2);
    try {
      decodeCursor("%%%");
    } catch (error) {
      expect((error as Error).name).toBe("InvalidCursorError");
      expect((error as Error).message).toBe("Cursor de paginação inválido");
    }
  });
});
