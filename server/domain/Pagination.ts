/** Uma página da listagem com scroll infinito. nextCursor ausente indica fim da lista. */
export type CursorPage<T> = {
  items: T[];
  nextCursor?: string;
};

/** Posição de um item na ordenação (dataCriacao desc, id desc). */
export type CursorPositionInputDto = {
  dataCriacao: Date;
  id: string;
};

export type CursorPositionOutputDto = {
  dataCriacao: Date;
  id: string;
};
