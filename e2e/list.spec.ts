import { expect, test } from "@playwright/test";

test("lista tarefas com scroll infinito até o fim", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Minhas tarefas" }),
  ).toBeVisible();

  const cards = page.locator("li h3");
  await expect(cards).toHaveCount(10);

  // Other specs create tasks, so the total may exceed the 35 from the seed:
  // scroll to the end, page by page, without relying on an exact count.
  const fim = page.getByText("Você chegou ao fim da lista ✓");
  await expect(async () => {
    await page.mouse.wheel(0, 10_000);
    await expect(fim).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 30_000 });
  expect(await cards.count()).toBeGreaterThanOrEqual(35);
});

test("link Nova tarefa leva ao formulário", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Nova tarefa" }).click();
  await expect(page).toHaveURL("/task/new");
  await expect(page.getByRole("heading", { name: "Nova tarefa" })).toBeVisible();
});
