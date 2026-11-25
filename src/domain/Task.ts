export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

/** Dados editáveis de uma tarefa (id e dataCriacao são gerados automaticamente). */
export type CreateTaskInputDto = Pick<Task, "titulo" | "descricao">;
export type UpdateTaskInputDto = Pick<Task, "titulo" | "descricao">;
