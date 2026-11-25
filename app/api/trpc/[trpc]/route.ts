import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { useCases } from "@/server/Bootstrap";
import { appRouter } from "@/server/http/trpc/routes/Index";

/** Expõe o router tRPC em /api/trpc (substitui o servidor Express). */
function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ useCases }),
    onError({ path, error }) {
      // Validação e 404 são esperados; só registramos o que é inesperado
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`❌ Erro inesperado em "${path}":`, error.cause ?? error);
      }
    },
  });
}

export { handler as GET, handler as POST };
