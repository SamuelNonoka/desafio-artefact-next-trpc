import { expect, test } from "@playwright/test";
import { createTask, uniqueTitle } from "./helpers";

test("edita uma tarefa", async ({ page }) => {
  const titulo = uniqueTitle("E2E editar");
  await createTask(page, titulo, "Original");

  await page.getByRole("link", { name: `Editar a tarefa ${titulo}` }).click();
  await expect(page.getByRole("heading", { name: "Editar tarefa" })).toBeVisible();

  // getByRole ignores the /task/new form that stays hidden in the DOM (cacheComponents)
  const tituloInput = page.getByRole("textbox", { name: /Título/ });
  const descricaoInput = page.getByRole("textbox", { name: /Descrição/ });
  await expect(tituloInput).toHaveValue(titulo);
  await expect(descricaoInput).toHaveValue("Original");

  const novo = `${titulo} (editada)`;
  await tituloInput.fill(novo);
  await descricaoInput.fill("Alterada");
  await page.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(page.getByText("Tarefa atualizada")).toBeVisible();
  await expect(page).toHaveURL("/");
  // Scope to the edited card: the database may have other "Alterada" tasks
  const card = page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name: novo }) });
  await expect(card).toBeVisible();
  await expect(card.getByText("Alterada")).toBeVisible();
});

test("não permite salvar título vazio", async ({ page }) => {
  const titulo = uniqueTitle("E2E editar vazio");
  await createTask(page, titulo);
  await page.getByRole("link", { name: `Editar a tarefa ${titulo}` }).click();
  // With cacheComponents, the /task/new form stays in the DOM (hidden).
  // getByRole ignores hidden elements; toHaveValue waits for the task to load.
  const tituloInput = page.getByRole("textbox", { name: /Título/ });
  await expect(tituloInput).toHaveValue(titulo);
  await tituloInput.fill("");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByText("Título é obrigatório")).toBeVisible();
});

test("id inexistente mostra tarefa não encontrada", async ({ page }) => {
  await page.goto("/task/00000000-0000-4000-8000-000000000000/edit");
  await expect(page.getByText("Tarefa não encontrada")).toBeVisible();
  // The header also has a "Voltar para a lista": use the one in the message
  await page
    .getByRole("status")
    .getByRole("link", { name: "Voltar para a lista" })
    .click();
  await expect(page).toHaveURL("/");
});

test("id inválido mostra tarefa não encontrada", async ({ page }) => {
  await page.goto("/task/abc/edit");
  await expect(page.getByText("Tarefa não encontrada")).toBeVisible();
});
