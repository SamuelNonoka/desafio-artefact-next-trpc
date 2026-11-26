import { TRPCError } from "@trpc/server";
import {
  type DomainError,
  InvalidCursorError,
  TaskNotFoundError,
} from "../../../domain/Errors";

/** Single place that maps domain errors to tRPC/HTTP codes. */
export function toTRPCError(error: DomainError): TRPCError {
  let code: TRPCError["code"] = "BAD_REQUEST";

  if (error instanceof TaskNotFoundError) code = "NOT_FOUND";
  else if (error instanceof InvalidCursorError) code = "BAD_REQUEST";

  return new TRPCError({ code, message: error.message, cause: error });
}
