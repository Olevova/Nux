import { test, expect } from "../fixtures/testFixture";
import { getWikiCredentials, INTERFACE_LANGUAGES, InterfaceLanguage } from "../utils/config";

const { username, password } = getWikiCredentials();

test.describe("Interface language switch @regression", () => {
  test.beforeEach(async ({ loginPage }) => {
    await test.step("Given an authorized user", async () => {
      await loginPage.openPortal();
      await loginPage.selectPortalLanguage(INTERFACE_LANGUAGES.ukrainian);
      await loginPage.openLoginForm();
      await loginPage.login(username, password);
      await loginPage.expectLoggedInAs(username);
    });
  });

  test("Authorized user successfully switches the Wikipedia interface language", async ({
    preferencesPage,
    basePage,
  }) => {
    let targetLanguage: InterfaceLanguage;

    await test.step('When the user opens Preferences > "User profile" > Internationalisation and picks another language', async () => {
      await preferencesPage.open();
      await preferencesPage.openUserProfileTab();

      const currentCode = await preferencesPage.getCurrentLanguageCode();
      targetLanguage =
        currentCode === INTERFACE_LANGUAGES.ukrainian.code ? INTERFACE_LANGUAGES.english : INTERFACE_LANGUAGES.ukrainian;

      await preferencesPage.selectInterfaceLanguage(targetLanguage);
      await preferencesPage.save();
    });

    await test.step("Then the interface is rendered in the newly selected language", async () => {
      await preferencesPage.expectInterfaceLanguage(targetLanguage);
    });

  });
});
