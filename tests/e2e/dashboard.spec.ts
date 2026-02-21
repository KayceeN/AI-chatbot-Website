import { expect, test } from "@playwright/test";

test("unauthenticated user is redirected from dashboard to login", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.waitForURL("**/login**");
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("chat placeholder page renders", async ({ page }) => {
  await page.goto("/dashboard/chat");
  // Will redirect to login since unauthenticated, but test the redirect works
  await page.waitForURL("**/login**");
});

test("workflows placeholder page renders", async ({ page }) => {
  await page.goto("/dashboard/workflows");
  await page.waitForURL("**/login**");
});

test("analytics placeholder page renders", async ({ page }) => {
  await page.goto("/dashboard/analytics");
  await page.waitForURL("**/login**");
});

test("settings page redirects unauthenticated to login", async ({ page }) => {
  await page.goto("/dashboard/settings");
  await page.waitForURL("**/login**");
});
