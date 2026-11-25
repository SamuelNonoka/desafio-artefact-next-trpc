import { router } from "../TRPC";
import { taskRouter } from "./Task.route";

export const appRouter = router({
  task: taskRouter,
});

/** Tipo importado pelo frontend para ter tipagem de ponta a ponta. */
export type AppRouter = typeof appRouter;
