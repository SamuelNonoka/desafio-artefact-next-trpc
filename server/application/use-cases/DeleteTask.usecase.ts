import { TaskNotFoundError } from "@/server/domain/Errors";
import { ITaskRepository } from "@/server/domain/ITask.repository";

export class DeleteTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.tasks.findById(id);
    if (!exists) throw new TaskNotFoundError(id);
    await this.tasks.delete(id);
  }
}
