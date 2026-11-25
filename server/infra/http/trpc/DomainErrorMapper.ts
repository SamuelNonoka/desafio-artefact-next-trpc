import { TRPCError } from "@trpc/server";
import {
  type DomainError,
  InvalidCursorError,
  TaskNotFoundError,
} from "../../../domain/Errors";

/** Único ponto que traduz erros de domínio para códigos tRPC/HTTP. */
export function toTRPCError(error: DomainError): TRPCError {
  let code: TRPCError["code"] = "BAD_REQUEST";

  if (error instanceof TaskNotFoundError) code = "NOT_FOUND";
  else if (error instanceof InvalidCursorError) code = "BAD_REQUEST";

  return new TRPCError({ code, message: error.message, cause: error });
}
