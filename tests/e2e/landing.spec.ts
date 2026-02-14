import { expect, test } from "@playwright/test";

test("hero and pricing sections render", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "ORB AI" })).toBeVisible();
  await page.goto("/#pricing");
  await expect(page.getByRole("heading", { name: "Simple Price For All" })).toBeVisible();

  await expect(page.getByRole("button", { name: "Monthly" })).toBeVisible();
  await page.getByRole("button", { name: "Yearly" }).click();
  await expect(page.getByText("$1600/month")).toBeVisible();
});

test("contact and faq interactions work", async ({ page }) => {
  await page.goto("/");

  await page.goto("/#contact");
  await expect(page.getByRole("heading", { name: "Reach Us At Anytime" })).toBeVisible();

  await page.goto("/#faq");
  await expect(page.getByRole("heading", { name: "Questions? Answers!" })).toBeVisible();

  const targetQuestion = page.getByRole("button", { name: "How long does it take to develop an AI solution?" });
  await targetQuestion.click();
  await expect(targetQuestion).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-panel-1")).toBeVisible();
});
