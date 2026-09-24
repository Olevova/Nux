import dotenv from "dotenv";
dotenv.config({ quiet: true });

/** Fixed entry point for the language portal; not affected by BASE_URL / baseURL. */
export const WIKIPEDIA_PORTAL_URL = "https://www.wikipedia.org/";

/** Browser locale for the whole run, so the portal's personalised "Top languages"
 *  list contains Ukrainian in every environment (local, CI, Docker), not just on
 *  a machine whose OS/browser locale happens to be Ukrainian. */
export const BROWSER_LOCALE = "uk-UA";

export function getBaseUrl(): string {
  return process.env.BASE_URL || "https://uk.wikipedia.org";
}

export function getWikiCredentials(): { username: string; password: string } {
  return {
    username: process.env.WIKI_USERNAME || "",
    password: process.env.WIKI_PASSWORD || "",
  };
}

export const TIMEOUTS = {
  low: 3000,
  middle: 5000,
  long: 10000,
};

export type InterfaceLanguage = {
  code: string;
  portalLinkId: string;
  loginLinkText: string;
  searchTerm: string;
  optionPattern: RegExp;
};

export const INTERFACE_LANGUAGES: Record<string, InterfaceLanguage> = {
  english: {
    code: "en",
    portalLinkId: "js-link-box-en",
    loginLinkText: "Log in",
    searchTerm: "English",
    optionPattern: /^en\s*·\s*/i,
  },
  ukrainian: {
    code: "uk",
    portalLinkId: "js-link-box-uk",
    loginLinkText: "Увійти",
    searchTerm: "ukrain",
    optionPattern: /^uk\s*·\s*/i,
  },
};
