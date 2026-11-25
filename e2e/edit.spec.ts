import { expect, test } from "@playwright/test";
import { createTask, uniqueTitle } from "./helpers";

test("edita uma tarefa", async ({ page }) => {
  const titulo = uniqueTitle("E2E editar");
  await createTask(page, titulo, "Original");

  await page.getByRole("link", { name: `Editar a tarefa ${titulo}` }).click();
  await expect(page.getByRole("heading", { name: "Editar tarefa" })).toBeVisible();

  // getByRole ignora o form de /task/new que fica oculto no DOM (cacheComponents)
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
  // Restringe ao card editado: o banco pode ter outras tarefas "Alterada"
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
  // Com cacheComponents, o form de /task/new continua no DOM (oculto).
  // getByRole ignora elementos ocultos; o toHaveValue espera a tarefa carregar.
  const tituloInput = page.getByRole("textbox", { name: /Título/ });
  await expect(tituloInput).toHaveValue(titulo);
  await tituloInput.fill("");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByText("Título é obrigatório")).toBeVisible();
});

test("id inexistente mostra tarefa não encontrada", async ({ page }) => {
  await page.goto("/task/00000000-0000-4000-8000-000000000000/edit");
  await expect(page.getByText("Tarefa não encontrada")).toBeVisible();
  // O cabeçalho também tem um "Voltar para a lista": usa o da mensagem
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
