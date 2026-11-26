/** One page of the infinite-scroll list. A missing nextCursor means the end of the list. */
export type CursorPage<T> = {
  items: T[];
  nextCursor?: string;
};

/** Position of an item in the ordering (dataCriacao desc, id desc). */
export type CursorPositionInputDto = {
  dataCriacao: Date;
  id: string;
};

export type CursorPositionOutputDto = {
  dataCriacao: Date;
  id: string;
};
