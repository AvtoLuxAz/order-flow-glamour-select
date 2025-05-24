export type Language = "en" | "az" | "ru" | "uz";
export const AVAILABLE_LANGUAGES: ReadonlyArray<Language> = [
  "en",
  "az",
  "ru",
  "uz",
];
export const DEFAULT_LANGUAGE: Language = "en";
export const LOCAL_STORAGE_LANGUAGE_KEY = "appLanguage";
