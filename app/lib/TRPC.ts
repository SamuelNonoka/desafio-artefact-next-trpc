import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterOutputs } from "@trpc/server";
// Imports only the backend TYPE: no server code is shipped to the browser
import type { AppRouter } from "@/server/infra/http/trpc/routes/Index";

export const trpc = createTRPCReact<AppRouter>();

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Task = RouterOutputs["task"]["byId"];
