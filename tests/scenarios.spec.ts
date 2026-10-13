import { test, expect } from "@playwright/test";
async function guest(page: any) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Continue as Guest", exact: true })
    .click();
}
async function plan(page: any) {
  await guest(page);
  await page.getByLabel("To · your destination").fill("UTS");
  await page
    .getByRole("button", { name: /University of Technology Sydney/ })
    .click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Plan Route", exact: true }).click();
}
test("Scenario 1: guest confirms origin, finds UTS and plans", async ({
  page,
}) => {
  await plan(page);
  await expect(
    page.getByRole("heading", { name: "Choose your journey" }),
  ).toBeVisible();
  await expect(page.locator(".route-card")).toHaveCount(3);
  await expect(
    page.getByText("Simulated transport data · not live bus arrivals"),
  ).toBeVisible();
});
test("Scenario 2: compare timings, select fastest and inspect map", async ({
  page,
}) => {
  await plan(page);
  const fastest = page
    .locator(".route-card")
    .filter({ hasText: "Fastest Route" });
  await expect(fastest).toContainText("24");
  await expect(fastest).toContainText("Next Bus Arrival: ~5 min");
  await expect(fastest).toContainText("9 min walk");
  await fastest.click();
  await expect(
    page
      .getByRole("heading", { name: "Bus + a short walk", exact: true })
      .first(),
  ).toBeVisible();
  await expect(page.locator(".maplibregl-canvas")).toBeVisible();
  await page.getByRole("button", { name: "Start this journey" }).click();
  await expect(page).toHaveURL(/\/map$/);
  await expect(
    page.getByText("Bus + a short walk · 24 min total · simulated"),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("sydneygo:selected")!),
    ),
  ).toBe("b");
});
test("Scenario 3: traffic legend, incident marker and alternatives", async ({
  page,
}) => {
  await guest(page);
  await page.getByRole("link", { name: "Map", exact: true }).click();
  await expect(page.getByLabel("Traffic colour legend")).toContainText(
    "Smooth",
  );
  await expect(page.getByLabel("Traffic colour legend")).toContainText(
    "Moderate",
  );
  await expect(page.getByLabel("Traffic colour legend")).toContainText("Heavy");
  const marker = page.getByRole("button", {
    name: "Broadway incident",
    exact: true,
  });
  await expect(marker).toBeVisible({ timeout: 15000 });
  await marker.click();
  await expect(
    page.getByRole("heading", { name: "What’s happening?" }),
  ).toBeVisible();
  await expect(
    page.getByText("SydneyGo university scenario · simulated report"),
  ).toBeVisible();
  await expect(
    page.getByText("(scenario timestamp)", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "View Alternative Routes", exact: true })
    .click();
  await expect(page.getByText("Alternative saves 11 minutes")).toBeVisible();
  await page
    .getByRole("button", { name: "Switch to alternative route", exact: true })
    .click();
  await expect(
    page
      .getByRole("heading", { name: "Bus + a short walk", exact: true })
      .first(),
  ).toBeVisible();
});
test("Scenario 4: incident chat sends, persists and returns to map", async ({
  page,
}) => {
  await guest(page);
  await page.goto("/incident/broadway");
  await page
    .getByRole("button", { name: "View Live Chat", exact: true })
    .click();
  await expect(
    page.getByText("Single-device prototype:", { exact: false }),
  ).toBeVisible();
  await page
    .getByLabel("Your commuter update")
    .fill("Traffic is moving slowly near Broadway.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText("Traffic is moving slowly near Broadway.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Traffic is moving slowly near Broadway.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Report message from Guest commuter" })
    .click();
  await expect(page.locator(".toast")).toContainText("Report saved");
  await page.getByRole("link", { name: "Back to Map", exact: true }).click();
  await expect(page).toHaveURL(/\/map$/);
});
test("Community posts, comments, helpful control and persistence", async ({
  page,
}) => {
  await guest(page);
  await page
    .getByRole("link", { name: "Community", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: "New post" }).click();
  await page.getByLabel("Route or service").fill("370");
  await page.getByLabel("Location", { exact: true }).fill("Broadway");
  await page
    .getByLabel("Your experience")
    .fill("A useful test tip for commuters.");
  await page.getByRole("button", { name: "Publish locally" }).click();
  await page.getByLabel("Add a comment").fill("Thanks for this tip.");
  await page.getByRole("button", { name: "Send comment" }).click();
  await expect(
    page.getByText("Thanks for this tip.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "0 helpful" }).click();
  await expect(page.getByRole("button", { name: "1 helpful" })).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Thanks for this tip.", { exact: true }),
  ).toBeVisible();
});
test("Sign up, edit profile, logout and login", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Your name", { exact: true }).fill("Test commuter");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("prototype123");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.getByLabel("A little about you").fill("UTS student");
  await page.getByRole("button", { name: "Save profile" }).click();
  await page.getByRole("link", { name: "Profile", exact: true }).click();
  await expect(page.getByText("UTS student", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await page.goto("/login");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("prototype123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/plan$/);
});
test("Resolution closes chat, location denial explained, no overflow or JS errors", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (_success: unknown, error: (e: unknown) => void) =>
          error({ code: 1, message: "Permission denied" }),
      },
      configurable: true,
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await guest(page);
  await page
    .getByRole("button", { name: "Use my location", exact: true })
    .click();
  await expect(page.locator(".toast")).toContainText("Location permission", {
    timeout: 15000,
  });
  await page.goto("/incident/broadway");
  await page
    .getByRole("button", { name: "Simulate incident resolved" })
    .click();
  await page.getByRole("link", { name: "Read incident chat" }).click();
  await expect(
    page.getByText("Read-only · Traffic back to normal"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Send message" })).toHaveCount(
    0,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });
  expect(
    await page
      .locator(".phone-shell")
      .evaluate((e) => e.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(440);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: "/tmp/sydneygo-chat-desktop.png",
    fullPage: true,
  });
});

test("Photo message requires caption, sends image and survives reload", async ({
  page,
}) => {
  await guest(page);
  await page.goto("/chat/broadway");
  const image = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
    "base64",
  );
  await page.locator("input[type=file]").setInputFiles({
    name: "traffic.png",
    mimeType: "image/png",
    buffer: image,
  });
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".toast")).toContainText("Add a caption");
  await page.getByLabel("Photo caption").fill("Broadway photo caption");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByRole("img", { name: "Broadway photo caption" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("img", { name: "Broadway photo caption" }),
  ).toBeVisible();
});

test("Browser geolocation grant confirms a position without assuming home", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: -33.8795, longitude: 151.1855 });
  await guest(page);
  await page
    .getByRole("button", { name: "Use my location", exact: true })
    .click();
  await expect(page.getByLabel("From · your origin")).toHaveValue(
    "Current location",
  );
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem("sydneygo:home"))).toBe(
    null,
  );
  await page.getByRole("button", { name: "Save as Home", exact: true }).click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("sydneygo:home")!).name,
    ),
  ).toBe("Saved Home");
});

test("Geocoding and road routing integrations consume fixture API responses", async ({
  page,
}) => {
  await page.route("https://photon.komoot.io/**", (route) =>
    route.fulfill({
      json: {
        features: [
          {
            properties: { name: "Sydney Test Library", city: "Sydney" },
            geometry: { coordinates: [151.2, -33.88] },
          },
        ],
      },
    }),
  );
  await page.route("https://router.project-osrm.org/**", (route) =>
    route.fulfill({
      json: {
        code: "Ok",
        routes: [
          {
            duration: 420,
            distance: 1800,
            geometry: {
              coordinates: [
                [151.1855, -33.8795],
                [151.2, -33.88],
              ],
            },
          },
        ],
      },
    }),
  );
  await guest(page);
  await page.getByLabel("To · your destination").fill("Sydney Test Library");
  await page.getByRole("button", { name: /Sydney Test Library/ }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Plan Route", exact: true }).click();
  await page.getByRole("button", { name: "Get real road reference" }).click();
  await expect(
    page.getByText(
      "Real road estimate: 7 min driving · 1.8 km. No live traffic.",
    ),
  ).toBeVisible();
});

test("API failures keep curated search and demo routes usable", async ({
  page,
}) => {
  await page.route("https://photon.komoot.io/**", (r) => r.abort());
  await page.route("https://router.project-osrm.org/**", (r) => r.abort());
  await guest(page);
  await page.getByLabel("To · your destination").fill("UTS");
  await expect(
    page.getByText(
      "Online search unavailable. Curated Sydney places are still available.",
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /University of Technology Sydney/ })
    .click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Plan Route", exact: true }).click();
  await page.getByRole("button", { name: "Get real road reference" }).click();
  await expect(
    page.getByText(
      "OSRM is unavailable. The three demo journey options remain usable.",
    ),
  ).toBeVisible();
  await expect(page.locator(".route-card")).toHaveCount(3);
});
