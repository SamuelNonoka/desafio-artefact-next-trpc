import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import type { UseCases } from "../application/use-cases";
import { appRouter } from "./trpc/routes/Index";

type ServerOptions = {
  useCases: UseCases;
  corsOrigin: string;
};

export function createServer({ useCases, corsOrigin }: ServerOptions) {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: corsOrigin }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: () => ({ useCases }),
      onError({ path, error }) {
        // Validação e 404 são esperados; só registramos o que é inesperado
        if (error.code === "INTERNAL_SERVER_ERROR") {
          console.error(
            `❌ Erro inesperado em "${path}":`,
            error.cause ?? error,
          );
        }
      },
    }),
  );

  // Qualquer rota fora de /trpc e /health
  app.use((_req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
  });

  return app;
}
