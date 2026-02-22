import { expect, test } from "@playwright/test";

test("chat widget bubble is visible on landing page", async ({ page }) => {
  await page.goto("/");
  const bubble = page.getByRole("button", { name: "Open chat" });
  await expect(bubble).toBeVisible();
});

test("chat widget opens on bubble click", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat" }).click();
  await expect(page.getByText("kAyphI Assistant")).toBeVisible();
  await expect(page.getByPlaceholder("Ask me anything...")).toBeVisible();
});

test("chat widget closes on close button click", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat" }).click();
  await expect(page.getByText("kAyphI Assistant")).toBeVisible();

  await page.getByRole("button", { name: "Close chat" }).click();
  await expect(page.getByText("kAyphI Assistant")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open chat" })).toBeVisible();
});

test("chat widget is NOT visible on login page", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Open chat" })).not.toBeVisible();
});
