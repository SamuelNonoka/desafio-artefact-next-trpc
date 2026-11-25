import type { ITaskRepository } from "../../domain/ITask.repository";
import type { CreateTaskInputDto, Task } from "../../domain/Task";

export class CreateTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  execute(input: CreateTaskInputDto): Promise<Task> {
    return this.tasks.create(input);
  }
}
