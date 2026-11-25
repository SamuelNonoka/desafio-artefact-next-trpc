import { expect, test } from "@playwright/test";
import { createTask, uniqueTitle } from "./helpers";

test("cancelar e Esc mantêm a tarefa", async ({ page }) => {
  const titulo = uniqueTitle("E2E manter");
  await createTask(page, titulo);

  await page.getByRole("button", { name: `Excluir a tarefa ${titulo}` }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog.getByText("Excluir tarefa?")).toBeVisible();
  await dialog.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: `Excluir a tarefa ${titulo}` }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { name: titulo })).toBeVisible();
});

test("exclui uma tarefa", async ({ page }) => {
  const titulo = uniqueTitle("E2E excluir");
  await createTask(page, titulo);

  await page.getByRole("button", { name: `Excluir a tarefa ${titulo}` }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toContainText(titulo);
  await dialog.getByRole("button", { name: "Excluir" }).click();

  await expect(page.getByText("Tarefa excluída")).toBeVisible();
  await expect(page.getByRole("heading", { name: titulo })).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("heading", { name: titulo })).toHaveCount(0);
});
