import { TaskNotFoundError } from "@/src/domain/Errors";
import { ITaskRepository } from "@/src/domain/ITask.repository";

export class DeleteTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.tasks.findById(id);
    if (!exists) throw new TaskNotFoundError(id);
    await this.tasks.delete(id);
  }
}
