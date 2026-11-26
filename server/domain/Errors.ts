/** Base for business rule errors. Knows nothing about HTTP or tRPC. */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class TaskNotFoundError extends DomainError {
  constructor(public readonly taskId: string) {
    super("Tarefa não encontrada");
  }
}

export class InvalidCursorError extends DomainError {
  constructor() {
    super("Cursor de paginação inválido");
  }
}
