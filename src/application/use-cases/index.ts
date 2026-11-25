import { ITaskRepository } from "@/src/domain/ITask.repository";
import { ListTasksUseCase } from "./ListTasks.usecase";
import { FindTaskUseCase } from "./GetTask.usecase";
import { CreateTaskUseCase } from "./CreateTask.usecase";
import { UpdateTaskUseCase } from "./UpdateTask.usecase";
import { DeleteTaskUseCase } from "./DeleteTask.usecase";

/** Monta todos os casos de uso a partir de um repositório (qualquer implementação). */
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
