import { TaskNotFoundError } from "@/src/domain/Errors";
import { ITaskRepository } from "@/src/domain/ITask.repository";
import { Task } from "@/src/domain/Task";

export class FindTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(id: string): Promise<Task> {
    const task = await this.tasks.findById(id);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }
}
