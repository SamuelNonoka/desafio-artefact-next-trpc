import { expect, test } from "@playwright/test";

test("rota inexistente mostra 404", async ({ page }) => {
  await page.goto("/rota-que-nao-existe");
  await expect(page.getByText("Página não encontrada")).toBeVisible();
  await page.getByRole("link", { name: "Ir para a lista de tarefas" }).click();
  await expect(page).toHaveURL("/");
});
