import { InvalidCursorError } from "../domain/Errors";
import type {
  CursorPositionInputDto,
  CursorPositionOutputDto,
} from "../domain/Pagination";

/** Builds an opaque cursor (base64url) from the position of the page's last item. */
export function encodeCursor({
  dataCriacao,
  id,
}: CursorPositionInputDto): string {
  return Buffer.from(
    JSON.stringify({ d: dataCriacao.toISOString(), i: id }),
  ).toString("base64url");
}

/** Parses the cursor received from the client. Throws InvalidCursorError if malformed. */
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
