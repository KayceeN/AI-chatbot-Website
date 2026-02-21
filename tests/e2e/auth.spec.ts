import { expect, test } from "@playwright/test";

test("login page renders form", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
});

test("signup page renders form", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByLabel("Confirm password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
});

test("login shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Email is required")).toBeVisible();
  await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
});

test("signup shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/signup");

  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  await expect(page.getByText("Email is required")).toBeVisible();
});

test("unauthenticated user is redirected from dashboard to login", async ({ page }) => {
  await page.goto("/dashboard");

  await page.waitForURL("**/login**");
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("login page has link to signup and vice versa", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Sign up" }).click();

  await page.waitForURL("**/signup");
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();

  await page.getByRole("link", { name: "Log in" }).click();
  await page.waitForURL("**/login");
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("auth page logo links back to home", async ({ page }) => {
  await page.goto("/login");

  const logoLink = page.locator("a[href='/']").first();
  await expect(logoLink).toBeVisible();
});

test("google sign-in button shows coming soon message", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Sign in with Google" }).click();
  await expect(page.getByText("Google sign-in coming soon")).toBeVisible();
});
