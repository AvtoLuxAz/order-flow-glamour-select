import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Language,
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE,
  LOCAL_STORAGE_LANGUAGE_KEY,
} from "@/config/languages";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoadingTranslations: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

// Consider wrapping development-specific console.logs with
// if (process.env.NODE_ENV === 'development') { /* ... */ } for cleaner production builds.

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLang = localStorage.getItem(
      LOCAL_STORAGE_LANGUAGE_KEY
    ) as Language | null;
    return storedLang && AVAILABLE_LANGUAGES.includes(storedLang)
      ? storedLang
      : DEFAULT_LANGUAGE;
  });

  const [currentTranslations, setCurrentTranslations] = useState<
    Record<string, string>
  >({});
  const [isLoadingTranslations, setIsLoadingTranslations] =
    useState<boolean>(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoadingTranslations(true);
      // console.log(`LanguageContext: Loading translations for: ${language}`); // Dev log
      try {
        const langModule = await import(`../locales/${language}.json`);
        setCurrentTranslations(langModule.default || langModule);
        // console.log(`LanguageContext: Translations loaded successfully for ${language}`); // Dev log
      } catch (e) {
        const error = e as Error; // Type assertion for error object
        console.error(
          `LanguageContext: Could not load translations for language "${language}". Error: ${error.message}`
        ); // Dev error
        setCurrentTranslations({}); // Fallback to empty translations
        // Optionally, implement a more robust fallback to the default language:
        // if (language !== DEFAULT_LANGUAGE) {
        //   try {
        //     const defaultLangModule = await import(`../locales/${DEFAULT_LANGUAGE}.json`);
        //     setCurrentTranslations(defaultLangModule.default || defaultLangModule);
        //     // Consider a toast notification to inform the user about the fallback
        //     // toast.error(`Failed to load ${language} translations. Switched to default language.`);
        //   } catch (defaultLoadError) {
        //     console.error(`LanguageContext: Failed to load default translations as well. Error: ${(defaultLoadError as Error).message}`);
        //     // toast.error(`Failed to load any translations.`);
        //   }
        // }
      } finally {
        setIsLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [language]); // Reload translations when the language state changes

  const setLanguage = (newLanguage: Language) => {
    if (AVAILABLE_LANGUAGES.includes(newLanguage)) {
      setLanguageState(newLanguage);
      localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, newLanguage);
      // console.log(`LanguageContext: Language changed to: ${newLanguage}`); // Dev log
    } else {
      console.warn(
        `LanguageContext: Attempted to set unsupported language: ${newLanguage}`
      ); // Dev warning
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Fallback to the key itself if translation is not found
    let translation = currentTranslations[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(
          new RegExp(`{${paramKey}}`, "g"),
          String(paramValue)
        );
      });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, isLoadingTranslations }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Developer instruction logs (Manual Testing Steps) have been removed from the file content.
// Debug logs are commented out by default; uncomment or use conditional logging for development.
