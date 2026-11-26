export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

/** Editable data of a task (id and dataCriacao are generated automatically). */
export type CreateTaskInputDto = Pick<Task, "titulo" | "descricao">;
export type UpdateTaskInputDto = Pick<Task, "titulo" | "descricao">;
