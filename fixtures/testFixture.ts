import { test as base } from "@playwright/test";
import { BasePage } from "../pages/BasePage";
import { LoginPage } from "../pages/LoginPage";
import { PreferencesPage } from "../pages/PreferencesPage";

export type testFixture = {
  basePage: BasePage;
  loginPage: LoginPage;
  preferencesPage: PreferencesPage;
  restoreDefaultLanguage: void;
};

export const test = base.extend<testFixture>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  preferencesPage: async ({ page }, use) => {
    await use(new PreferencesPage(page));
  }
});

export { expect } from "@playwright/test";
