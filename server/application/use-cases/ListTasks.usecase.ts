import type { CursorPage } from "../../domain/Pagination";
import type { Task } from "../../domain/Task";
import type { ITaskRepository } from "../../domain/ITask.repository";
import { decodeCursor, encodeCursor } from "../Cursor";

export type ListTasksInputDto = {
  cursor?: string;
  limit: number;
};

export class ListTasksUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute({
    cursor,
    limit,
  }: ListTasksInputDto): Promise<CursorPage<Task>> {
    const after = cursor ? decodeCursor(cursor) : undefined;

    // Fetch 1 extra item to know whether there is a next page
    const rows = await this.tasks.findAfter({ after, take: limit + 1 });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const last = items.at(-1);

    return {
      items,
      nextCursor: hasMore && last ? encodeCursor(last) : undefined,
    };
  }
}
