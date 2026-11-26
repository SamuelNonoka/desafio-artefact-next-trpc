import type { UseCases } from "../../../application/use-cases";

/** What each procedure receives in "ctx". The use cases are injected here. */
export type Context = {
  useCases: UseCases;
};
