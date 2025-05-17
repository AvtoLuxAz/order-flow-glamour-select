import { PERFORMANCE_CONFIG } from "..";
import type {
  VirtualScrollConfig,
  VirtualScrollResult,
  ImageOptimizationConfig,
} from "../types";

type AnyFunction = (...args: unknown[]) => unknown;

// Debounce utility
export function debounce<T extends AnyFunction>(
  func: T,
  wait: number = PERFORMANCE_CONFIG.DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility
export function throttle<T extends AnyFunction>(
  func: T,
  limit: number = PERFORMANCE_CONFIG.THROTTLE_DELAY
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// RAF (RequestAnimationFrame) utility
export function rafThrottle<T extends AnyFunction>(
  callback: T
): (...args: Parameters<T>) => void {
  let requestId: number | null = null;

  return (...args: Parameters<T>) => {
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        callback(...args);
        requestId = null;
      });
    }
  };
}

// Memoization helper
export function memoize<TArgs extends unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  resolver?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

// Virtual scrolling helper
export function calculateVirtualScroll(
  scrollTop: number,
  config: VirtualScrollConfig
): VirtualScrollResult {
  const { itemHeight, containerHeight, totalItems, overscan = 3 } = config;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return {
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
    totalHeight: totalItems * itemHeight,
  };
}

// Lazy loading helper
export function lazyLoad(
  element: HTMLElement,
  callback: () => void,
  options: IntersectionObserverInit = {
    rootMargin: PERFORMANCE_CONFIG.LAZY_LOAD_MARGIN,
  }
): () => void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    });
  }, options);

  observer.observe(element);
  return () => observer.disconnect();
}

// Image optimization helper
export async function optimizeImage(
  file: File,
  config: ImageOptimizationConfig
): Promise<Blob> {
  const {
    maxWidth,
    maxHeight,
    quality = PERFORMANCE_CONFIG.IMAGE_QUALITY,
    format = "jpeg",
  } = config;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
  });
}
