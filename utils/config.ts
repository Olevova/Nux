import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const WIKIPEDIA_PORTAL_URL = "https://www.wikipedia.org/";

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
