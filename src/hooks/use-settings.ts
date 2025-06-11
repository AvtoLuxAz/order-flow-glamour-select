
import { useQuery } from "@tanstack/react-query";
import { settingsService, Setting } from "@/services/settings.service";
import { useLanguage } from "@/context";

export const useSettings = () => {
  const { language } = useLanguage();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getAllSettings(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log error for debugging
  if (error) {
    console.log("Settings query error:", error);
  }

  const getSetting = (key: string, lang?: string): Setting | null => {
    const targetLang = lang || language;
    return (
      settings?.find(
        (setting) => setting.key === key && setting.lang === targetLang
      ) || null
    );
  };

  const getLocalizedSetting = (key: string, fallbackKey?: string): string => {
    // Return empty string if settings is not available
    if (!settings || !Array.isArray(settings)) {
      return "";
    }

    // First try to get setting in current language
    const setting = getSetting(key);

    // If not found and language is not 'az', try with 'az'
    if (!setting && language !== "az") {
      const azSetting = getSetting(key, "az");
      if (azSetting) return azSetting.value;
    }

    // If still not found and fallbackKey is provided, try with fallbackKey
    if (!setting && fallbackKey) {
      const fallbackSetting = getSetting(fallbackKey);
      if (fallbackSetting) return fallbackSetting.value;

      // Try fallback key with 'az' language
      if (language !== "az") {
        const azFallbackSetting = getSetting(fallbackKey, "az");
        if (azFallbackSetting) return azFallbackSetting.value;
      }
    }

    return setting?.value || "";
  };

  return {
    settings: settings || [],
    isLoading,
    error,
    getSetting,
    getLocalizedSetting,
  };
};

export const useSettingByKey = (key: string) => {
  const { language } = useLanguage();

  const {
    data: setting,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["setting", key, language],
    queryFn: () => settingsService.getSettingByKey(key, language),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log error for debugging
  if (error) {
    console.log(`Setting ${key} query error:`, error);
  }

  return {
    setting,
    localizedValue: setting?.value || "",
    isLoading,
    error,
  };
};
