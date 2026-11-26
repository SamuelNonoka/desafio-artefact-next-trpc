import { router } from "../TRPC";
import { taskRouter } from "./Task.route";

export const appRouter = router({
  task: taskRouter,
});

/** Type imported by the frontend for end-to-end typing. */
export type AppRouter = typeof appRouter;
