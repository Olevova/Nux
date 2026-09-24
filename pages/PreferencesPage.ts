import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TIMEOUTS, InterfaceLanguage } from "../utils/config";

export class PreferencesPage extends BasePage {
  private userProfileTab: Locator;
  private languageFieldContainer: Locator;
  private languageCombobox: Locator;
  private languageSelect: Locator;
  private saveButton: Locator;
  private saveNotification: Locator;
  private preferencesMenuLink: Locator;

  constructor(page: Page) {
    super(page);
    this.userProfileTab = page.getByRole("tab", { name: /user profile|особові дані/i });
    this.languageFieldContainer = page.locator(".mw-htmlform-field-HTMLSelectLanguageField");
    this.languageCombobox = this.languageFieldContainer.getByRole("combobox");
    this.languageSelect = page.locator("#mw-input-wplanguage");
    this.saveButton = page.getByRole("button", { name: /save|зберегти/i });
    this.saveNotification = page.locator(".mw-notification-content");
    this.preferencesMenuLink = page.locator("#pt-preferences a");
  }

  async open(): Promise<void> {
    await this.openUserMenu(this.preferencesMenuLink);
    await this.preferencesMenuLink.click();
    await expect(this.userProfileTab, "Preferences page must load").toBeVisible({ timeout: TIMEOUTS.long });
  }

  async openUserProfileTab(): Promise<void> {
    await this.userProfileTab.click();
    await expect(this.languageFieldContainer, "Internationalisation language field must be visible").toBeVisible({
      timeout: TIMEOUTS.middle,
    });
  }

  async getCurrentLanguageCode(): Promise<string> {
    return this.languageSelect.inputValue();
  }

  async selectInterfaceLanguage(language: InterfaceLanguage): Promise<void> {
    await this.languageCombobox.click();
    await this.languageCombobox.fill(language.searchTerm);

    const option = this.page.getByRole("option", { name: language.optionPattern });
    await expect(option, `Language suggestion matching ${language.optionPattern} must appear`).toBeVisible({
      timeout: TIMEOUTS.middle,
    });
    await option.click();
  }

  async save(): Promise<void> {
    await expect(this.saveButton, "Save button must be enabled after changing a preference").toBeEnabled();
    await this.saveButton.click();
    await this.page.waitForLoadState("networkidle");
    await expect(this.saveNotification, "Settings-saved confirmation must appear").toBeVisible({
      timeout: TIMEOUTS.long,
    });
  }

  async expectInterfaceLanguage(language: InterfaceLanguage): Promise<void> {
    await expect(this.page.locator("html"), `Interface language must be "${language.code}"`).toHaveAttribute(
      "lang",
      language.code,
    );
  }
}
