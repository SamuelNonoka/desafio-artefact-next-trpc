import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterOutputs } from "@trpc/server";
// Importa somente o TIPO do backend: nenhum código do servidor vai para o navegador
import type { AppRouter } from "@/server/http/trpc/routers";

export const trpc = createTRPCReact<AppRouter>();

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Task = RouterOutputs["task"]["byId"];
