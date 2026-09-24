import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TIMEOUTS, WIKIPEDIA_PORTAL_URL, InterfaceLanguage } from "../utils/config";

export class LoginPage extends BasePage {

  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginSubmitButton: Locator;
  private selectedLanguage?: InterfaceLanguage;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator("#wpName1");
    this.passwordInput = page.locator("#wpPassword1");
    this.loginSubmitButton = page.locator("#wpLoginAttempt");
  }

  async openPortal(): Promise<void> {
    await this.page.goto(WIKIPEDIA_PORTAL_URL);
  }

  private getLoginLink(language: InterfaceLanguage): Locator {
    return this.page.getByRole("link", { name: language.loginLinkText, exact: true }).first();
  }

  async selectPortalLanguage(language: InterfaceLanguage): Promise<void> {
    this.selectedLanguage = language;
    await this.page.locator(`#${language.portalLinkId}`).click();
    await this.page.waitForLoadState("networkidle");
    await expect(
      this.getLoginLink(language),
      "Header must be loaded with a visible login entry point",
    ).toBeVisible({ timeout: TIMEOUTS.long });
  }

  async openLoginForm(): Promise<void> {
    if (!this.selectedLanguage) {
      throw new Error("selectPortalLanguage() must be called before openLoginForm()");
    }
    await this.getLoginLink(this.selectedLanguage).click();
    await expect(this.usernameInput, "Login form must be visible").toBeVisible({ timeout: TIMEOUTS.long });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginSubmitButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async expectLoggedInAs(username: string): Promise<void> {
    const userLink = this.page.getByRole("link", { name: username, exact: true });
    await this.openUserMenu(userLink);
    await expect(userLink, `User menu must show a link for username "${username}"`).toBeVisible({
      timeout: TIMEOUTS.long,
    });
  }
}
