import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod";
import { DomainError } from "../../domain/Errors";
import type { Context } from "./Context";
import { toTRPCError } from "./DomainErrorMapper";

const t = initTRPC.context<Context>().create({
  // Preserva tipos como Date entre servidor e cliente
  transformer: superjson,

  // Padroniza a resposta de erro: inclui os erros de validação por campo
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? z.flattenError(error.cause)
            : undefined,
      },
    };
  },
});

/** Converte erros de domínio (TaskNotFoundError etc.) em TRPCError com o código certo. */
const mapDomainErrors = t.middleware(async ({ next }) => {
  const result = await next();
  if (!result.ok && result.error.cause instanceof DomainError) {
    throw toTRPCError(result.error.cause);
  }
  return result;
});

export const router = t.router;
export const publicProcedure = t.procedure.use(mapDomainErrors);
export const createCallerFactory = t.createCallerFactory;
