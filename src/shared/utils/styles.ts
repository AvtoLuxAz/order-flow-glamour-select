import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * Useful for combining Tailwind classes with dynamic classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a color hex value to RGB values
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Generates CSS variables for theme colors with opacity support
 */
export function generateThemeVars(colors: Record<string, string>) {
  const vars: Record<string, string> = {};

  Object.entries(colors).forEach(([key, value]) => {
    const rgb = hexToRgb(value);
    if (rgb) {
      vars[`--color-${key}`] = `${rgb.r} ${rgb.g} ${rgb.b}`;
    }
  });

  return vars;
}
