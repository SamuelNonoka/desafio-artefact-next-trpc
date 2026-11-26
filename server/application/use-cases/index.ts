import { ITaskRepository } from "@/server/domain/ITask.repository";
import { ListTasksUseCase } from "./ListTasks.usecase";
import { FindTaskUseCase } from "./GetTask.usecase";
import { CreateTaskUseCase } from "./CreateTask.usecase";
import { UpdateTaskUseCase } from "./UpdateTask.usecase";
import { DeleteTaskUseCase } from "./DeleteTask.usecase";

/** Builds all use cases from a repository (any implementation). */
export function makeUseCases(repository: ITaskRepository) {
  return {
    listTasks: new ListTasksUseCase(repository),
    getTask: new FindTaskUseCase(repository),
    createTask: new CreateTaskUseCase(repository),
    updateTask: new UpdateTaskUseCase(repository),
    deleteTask: new DeleteTaskUseCase(repository),
  };
}

export type UseCases = ReturnType<typeof makeUseCases>;
