import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { useCases } from "@/server/Bootstrap";
import { appRouter } from "@/server/infra/http/trpc/routes/Index";

/** Exposes the tRPC router at /api/trpc (replaces the Express server). */
function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ useCases }),
    onError({ path, error }) {
      // Validation and 404 are expected; only log what is unexpected
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`❌ Erro inesperado em "${path}":`, error.cause ?? error);
      }
    },
  });
}

export { handler as GET, handler as POST };
