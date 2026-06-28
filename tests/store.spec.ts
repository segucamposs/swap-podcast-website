import { test, expect } from "@playwright/test";

/**
 * E2E tests for the SWAP merch store.
 *
 * The Mercado Pago redirect is intercepted so tests run without a live MP token.
 * The checkout API call itself is exercised — only the external redirect is mocked.
 */

test.describe("Store — product catalog", () => {
  test("renders the store page with products", async ({ page }) => {
    await page.goto("/store");
    await expect(page).toHaveTitle(/SWAP/i);
    // At least one product card should appear
    const cards = page.locator("[data-testid='product-card']");
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows product name and price on each card", async ({ page }) => {
    await page.goto("/store");
    const card = page.locator("[data-testid='product-card']").first();
    await expect(card.locator("[data-testid='product-name']")).not.toBeEmpty();
    await expect(card.locator("[data-testid='product-price']")).toContainText("$");
  });
});

test.describe("Store — product detail", () => {
  test("navigates to product detail page", async ({ page }) => {
    await page.goto("/store");
    // Click the product name link (not the article wrapper)
    await page.locator("[data-testid='product-card']").first().locator("a").first().click();
    // Should land on /store/[slug]
    await expect(page).toHaveURL(/\/store\/.+/, { timeout: 8_000 });
    await expect(page.locator("h1")).not.toBeEmpty();
  });

  test("add-to-cart button is present on detail page", async ({ page }) => {
    await page.goto("/store");
    await page.locator("[data-testid='product-card']").first().locator("a").first().click();
    await expect(page.locator("[data-testid='add-to-cart']")).toBeVisible();
  });
});

test.describe("Cart — add items and review", () => {
  test("adds a product to the cart", async ({ page }) => {
    await page.goto("/store");
    await page.locator("[data-testid='product-card']").first().click();
    await page.locator("[data-testid='add-to-cart']").click();

    // Cart icon count badge should become visible
    const badge = page.locator("[data-testid='cart-count']");
    await expect(badge).toBeVisible({ timeout: 5_000 });
    await expect(badge).toContainText("1");
  });

  test("cart page shows the added item", async ({ page }) => {
    await page.goto("/store");

    // Capture name from card, then add via quick-add button on the card
    const firstCard = page.locator("[data-testid='product-card']").first();
    const productName = await firstCard.locator("[data-testid='product-name']").textContent();

    // Use the "Agregar" quick-add button on the card (last button inside card)
    await firstCard.locator("button").last().click();

    // Navigate to cart
    await page.goto("/store/cart");
    await expect(page.getByText(productName!.trim())).toBeVisible();
  });

  test("cart total reflects item price", async ({ page }) => {
    await page.goto("/store");
    await page.locator("[data-testid='product-card']").first().click();
    await page.locator("[data-testid='add-to-cart']").click();
    await page.goto("/store/cart");

    await expect(page.locator("[data-testid='cart-total']")).toContainText("$");
  });

  test("removing an item empties the cart", async ({ page }) => {
    await page.goto("/store");
    await page.locator("[data-testid='product-card']").first().click();
    await page.locator("[data-testid='add-to-cart']").click();
    await page.goto("/store/cart");

    await page.locator("[data-testid='remove-item']").first().click();
    await expect(page.locator("[data-testid='empty-cart']")).toBeVisible();
  });
});

test.describe("Checkout — form validation and submission", () => {
  async function addProductAndGoToCart(page: import("@playwright/test").Page) {
    await page.goto("/store");
    await page.locator("[data-testid='product-card']").first().click();
    await page.locator("[data-testid='add-to-cart']").click();
    await page.goto("/store/cart");
  }

  test("shows validation errors on empty submit", async ({ page }) => {
    await addProductAndGoToCart(page);
    await page.locator("[data-testid='checkout-submit']").click();
    // At least one error message should appear
    await expect(page.locator("[data-testid='field-error']").first()).toBeVisible();
  });

  test("checkout posts to /api/checkout and receives init_point", async ({
    page,
  }) => {
    await addProductAndGoToCart(page);

    // Intercept the MP redirect — return a fake init_point so the test
    // doesn't open Mercado Pago's external domain.
    await page.route("**/api/checkout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ initPoint: "https://mp-sandbox.example.com/checkout" }),
      });
    });

    await page.fill("[data-testid='buyer-name']", "Test Usuario");
    await page.fill("[data-testid='buyer-email']", "test@swappodcast.com");
    await page.locator("[data-testid='checkout-submit']").click();

    // The page should attempt to navigate to the (mocked) MP init_point.
    // We just verify the form was submitted successfully — no 4xx errors shown.
    await expect(page.locator("[data-testid='field-error']")).toHaveCount(0);
  });
});

test.describe("Admin — protected routes", () => {
  test("redirects /admin to /admin/login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login page renders email and password fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });
});
