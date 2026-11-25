import type { UseCases } from "../../../application/use-cases";

/** O que cada procedure recebe em "ctx". Os casos de uso são injetados aqui. */
export type Context = {
  useCases: UseCases;
};
