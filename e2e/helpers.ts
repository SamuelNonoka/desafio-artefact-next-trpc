import { expect, type Page } from "@playwright/test";

export const uniqueTitle = (prefix: string) =>
  `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1e4)}`;

/** Cria uma tarefa pela UI e volta para a lista. */
export async function createTask(
  page: Page,
  titulo: string,
  descricao?: string,
) {
  await page.goto("/task/new");
  await page.getByLabel(/Título/).fill(titulo);
  if (descricao) await page.getByLabel(/Descrição/).fill(descricao);
  await page.getByRole("button", { name: "Criar tarefa" }).click();
  // Folga para a primeira compilação de "/" no next dev
  await expect(page).toHaveURL("/", { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: titulo })).toBeVisible();
}
