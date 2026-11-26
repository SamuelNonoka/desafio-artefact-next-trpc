import { expect, test } from "@playwright/test";
import { createTask, uniqueTitle } from "./helpers";

test("valida título obrigatório", async ({ page }) => {
  await page.goto("/task/new");
  await page.getByRole("button", { name: "Criar tarefa" }).click();
  await expect(page.getByText("Título é obrigatório")).toBeVisible();
  await expect(page).toHaveURL("/task/new");
});

test("valida limite de 120 caracteres no título", async ({ page }) => {
  await page.goto("/task/new");
  await page.getByLabel(/Título/).fill("a".repeat(121));
  await page.getByRole("button", { name: "Criar tarefa" }).click();
  await expect(
    page.getByText("O título deve ter no máximo 120 caracteres"),
  ).toBeVisible();
});

test("cria tarefa com sucesso", async ({ page }) => {
  const titulo = uniqueTitle("E2E criar");
  await page.goto("/task/new");
  await page.getByLabel(/Título/).fill(titulo);
  await page.getByLabel(/Descrição/).fill("Descrição criada no e2e");
  await page.getByRole("button", { name: "Criar tarefa" }).click();

  await expect(page.getByText("Tarefa criada com sucesso")).toBeVisible();
  await expect(page).toHaveURL("/");
  // Scope to the created card: the database may have tasks from previous runs
  const card = page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name: titulo }) });
  await expect(card).toBeVisible();
  await expect(card.getByText("Descrição criada no e2e")).toBeVisible();
});

test("cria tarefa sem descrição", async ({ page }) => {
  await createTask(page, uniqueTitle("E2E sem desc"));
  await expect(page.getByText("Sem descrição").first()).toBeVisible();
});

test("cancelar volta para a lista", async ({ page }) => {
  await page.goto("/task/new");
  await page.getByRole("link", { name: "Cancelar" }).click();
  await expect(page).toHaveURL("/");
});
