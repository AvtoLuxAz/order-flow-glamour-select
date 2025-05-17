import { ENV_TYPES, I18N_CONSTANTS } from "./constants";

interface ValidationError {
  variable: string;
  message: string;
  severity: "error" | "warning";
}

/**
 * Validates environment variables and returns any validation errors
 */
export function validateEnvironment(): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required variables
  const requiredVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

  requiredVars.forEach((variable) => {
    if (!import.meta.env[variable]) {
      errors.push({
        variable,
        message: `Missing required environment variable: ${variable}`,
        severity: "error",
      });
    }
  });

  // Environment type validation
  const env = import.meta.env.VITE_APP_ENV?.toLowerCase();
  if (env && !Object.values(ENV_TYPES).includes(env as any)) {
    errors.push({
      variable: "VITE_APP_ENV",
      message: `Invalid environment type. Must be one of: ${Object.values(
        ENV_TYPES
      ).join(", ")}`,
      severity: "error",
    });
  }

  // Language validation
  const language = import.meta.env.VITE_DEFAULT_LANGUAGE;
  if (
    language &&
    !I18N_CONSTANTS.SUPPORTED_LANGUAGES.includes(language as any)
  ) {
    errors.push({
      variable: "VITE_DEFAULT_LANGUAGE",
      message: `Invalid language. Must be one of: ${I18N_CONSTANTS.SUPPORTED_LANGUAGES.join(
        ", "
      )}`,
      severity: "error",
    });
  }

  // URL validation
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && !isValidUrl(apiUrl)) {
    errors.push({
      variable: "VITE_API_URL",
      message: "Invalid API URL format",
      severity: "error",
    });
  }

  // Numeric validation
  const timeout = Number(import.meta.env.VITE_API_TIMEOUT);
  if (import.meta.env.VITE_API_TIMEOUT && (isNaN(timeout) || timeout <= 0)) {
    errors.push({
      variable: "VITE_API_TIMEOUT",
      message: "API timeout must be a positive number",
      severity: "error",
    });
  }

  // Boolean validation
  const booleanVars = [
    "VITE_USE_MOCK_DATA",
    "VITE_ENABLE_ANALYTICS",
    "VITE_SHOW_DEBUG_INFO",
    "VITE_ENABLE_DARK_MODE",
  ];

  booleanVars.forEach((variable) => {
    const value = import.meta.env[variable]?.toLowerCase();
    if (value && value !== "true" && value !== "false") {
      errors.push({
        variable,
        message: `${variable} must be 'true' or 'false'`,
        severity: "warning",
      });
    }
  });

  return errors;
}

/**
 * Validates a URL string
 */
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Logs environment validation errors
 */
export function logValidationErrors(errors: ValidationError[]): void {
  if (errors.length === 0) {
    console.log("✅ Environment validation passed");
    return;
  }

  console.group("❌ Environment validation failed");
  errors.forEach((error) => {
    const logMethod = error.severity === "error" ? console.error : console.warn;
    logMethod(`${error.severity.toUpperCase()}: ${error.message}`);
  });
  console.groupEnd();
}
