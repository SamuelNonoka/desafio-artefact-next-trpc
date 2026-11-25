import { InvalidCursorError } from "../domain/Errors";
import type {
  CursorPositionInputDto,
  CursorPositionOutputDto,
} from "../domain/Pagination";

/** Gera um cursor opaco (base64url) a partir da posição do último item da página. */
export function encodeCursor({
  dataCriacao,
  id,
}: CursorPositionInputDto): string {
  return Buffer.from(
    JSON.stringify({ d: dataCriacao.toISOString(), i: id }),
  ).toString("base64url");
}

/** Lê o cursor recebido do cliente. Lança InvalidCursorError se estiver malformado. */
export function decodeCursor(cursor: string): CursorPositionOutputDto {
  try {
    const { d, i } = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8"),
    );
    const dataCriacao = new Date(d);
    if (
      typeof d !== "string" ||
      typeof i !== "string" ||
      Number.isNaN(dataCriacao.getTime())
    ) {
      throw new Error();
    }
    return { dataCriacao, id: i };
  } catch {
    throw new InvalidCursorError();
  }
}
