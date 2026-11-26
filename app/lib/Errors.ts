import { TRPCClientError } from "@trpc/client";

const GENERIC_MESSAGE = "Ocorreu um erro inesperado. Tente novamente.";

/** tRPC error code (NOT_FOUND, BAD_REQUEST...) or undefined if it is not an API error. */
export function getErrorCode(error: unknown): string | undefined {
  return error instanceof TRPCClientError ? error.data?.code : undefined;
}

/** Friendly message to show in toasts and error screens. */
export function getErrorMessage(error: unknown): string {
  if (!(error instanceof TRPCClientError)) return GENERIC_MESSAGE;

  // No "data" = the request never reached the API (server down, no internet)
  if (!error.data)
    return "Não foi possível conectar ao servidor. Verifique sua conexão.";
  if (error.data.zodError) return "Verifique os campos destacados.";
  if (error.data.code === "INTERNAL_SERVER_ERROR") return GENERIC_MESSAGE;

  return error.message;
}

/** Per-field validation errors sent by the API ({ titulo: ["..."] }). */
export function getFieldErrors(
  error: unknown,
): Record<string, string[] | undefined> {
  if (error instanceof TRPCClientError)
    return error.data?.zodError?.fieldErrors ?? {};
  return {};
}
