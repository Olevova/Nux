import { Page, Locator } from "@playwright/test";

export class BasePage {

  protected userMenuToggle: Locator;

  constructor(protected page: Page) {
    this.userMenuToggle = page.locator("#vector-user-links-dropdown-label");
  }

  async openPage(path: string = "/"): Promise<void> {
    await this.page.goto(path);
  }

  async getInterfaceLanguage(): Promise<string | null> {
    return this.page.locator("html").getAttribute("lang");
  }

  async openUserMenu(target: Locator): Promise<void> {
    if (await target.isVisible()) {
      return;
    }
    if (await this.userMenuToggle.count()) {
      await this.userMenuToggle.first().click();
    }
  }
}
