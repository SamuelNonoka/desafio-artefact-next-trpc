import { TRPCClientError } from "@trpc/client";

const GENERIC_MESSAGE = "Ocorreu um erro inesperado. Tente novamente.";

/** Código tRPC do erro (NOT_FOUND, BAD_REQUEST...) ou undefined se não for erro da API. */
export function getErrorCode(error: unknown): string | undefined {
  return error instanceof TRPCClientError ? error.data?.code : undefined;
}

/** Mensagem amigável para exibir em toasts e telas de erro. */
export function getErrorMessage(error: unknown): string {
  if (!(error instanceof TRPCClientError)) return GENERIC_MESSAGE;

  // Sem "data" = a requisição nem chegou à API (servidor fora do ar, sem internet)
  if (!error.data)
    return "Não foi possível conectar ao servidor. Verifique sua conexão.";
  if (error.data.zodError) return "Verifique os campos destacados.";
  if (error.data.code === "INTERNAL_SERVER_ERROR") return GENERIC_MESSAGE;

  return error.message;
}

/** Erros de validação por campo enviados pela API ({ titulo: ["..."] }). */
export function getFieldErrors(
  error: unknown,
): Record<string, string[] | undefined> {
  if (error instanceof TRPCClientError)
    return error.data?.zodError?.fieldErrors ?? {};
  return {};
}
