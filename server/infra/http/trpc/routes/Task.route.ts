import { publicProcedure, router } from "../TRPC";
import {
  createTaskInput,
  listTasksInput,
  taskIdInput,
  updateTaskInput,
} from "../../../../domain/Task.schema";

/** Thin layer: validates the input (Zod), calls the use case and returns the result. */
export const taskRouter = router({
  list: publicProcedure
    .input(listTasksInput)
    .query(({ ctx, input }) => ctx.useCases.listTasks.execute(input)),

  byId: publicProcedure
    .input(taskIdInput)
    .query(({ ctx, input }) => ctx.useCases.getTask.execute(input.id)),

  create: publicProcedure
    .input(createTaskInput)
    .mutation(({ ctx, input }) => ctx.useCases.createTask.execute(input)),

  update: publicProcedure
    .input(updateTaskInput)
    .mutation(({ ctx, input }) => ctx.useCases.updateTask.execute(input)),

  delete: publicProcedure
    .input(taskIdInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.useCases.deleteTask.execute(input.id);
      return { id: input.id };
    }),
});
