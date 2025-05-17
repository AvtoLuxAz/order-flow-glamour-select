import { UI_CONFIG } from "../constants";
import { performanceMonitor } from "./monitoring/performance-monitor";
export * from "./monitoring/performance-monitor";
export * from "./optimization/performance-utils";

// Re-export the singleton instance
export { performanceMonitor };

// Export performance configuration
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: UI_CONFIG.DEBOUNCE_DELAY || 300,
  THROTTLE_DELAY: UI_CONFIG.THROTTLE_DELAY || 300,
  PERFORMANCE_THRESHOLD: 100,
  SCROLL_THROTTLE_DELAY: 16,
  IMAGE_QUALITY: 0.8,
  LAZY_LOAD_MARGIN: "50px",
} as const;

// Export performance types
export type {
  PerformanceMetric,
  VirtualScrollConfig,
  VirtualScrollResult,
} from "./types";

type AnyFunction = (...args: unknown[]) => unknown;

// Debounce utility
export function debounce<T extends AnyFunction>(
  func: T,
  wait: number = UI_CONFIG.DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends AnyFunction>(
  func: T,
  limit: number = UI_CONFIG.THROTTLE_DELAY
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization utility
export function memoize<T extends AnyFunction>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    const result = func(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  };
}

// RAF (RequestAnimationFrame) utility
export function rafThrottle<T extends AnyFunction>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function (...args: Parameters<T>): void {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

// Lazy loading utility
export function lazyLoad(
  imageElement: HTMLImageElement,
  src: string,
  rootMargin: string = "50px"
): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imageElement.src = src;
          observer.unobserve(imageElement);
        }
      });
    },
    { rootMargin }
  );

  observer.observe(imageElement);
}

// Performance monitoring
export const PerformanceMonitor = {
  measureTime(label: string, func: () => void): void {
    console.time(label);
    func();
    console.timeEnd(label);
  },

  async measureAsyncTime(
    label: string,
    func: () => Promise<void>
  ): Promise<void> {
    console.time(label);
    await func();
    console.timeEnd(label);
  },

  getMetrics(): PerformanceEntryList {
    return performance.getEntriesByType("navigation");
  },

  clearMetrics(): void {
    performance.clearMarks();
    performance.clearMeasures();
  },
};

// Virtual scrolling helper
interface VirtualScrollerItem {
  id: string | number;
  content: string;
}

export class VirtualScroller {
  private container: HTMLElement;
  private items: VirtualScrollerItem[];
  private itemHeight: number;
  private visibleItems: number;
  private startIndex: number = 0;
  private endIndex: number = 0;

  constructor(
    container: HTMLElement,
    items: VirtualScrollerItem[],
    itemHeight: number,
    visibleItems: number
  ) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleItems = visibleItems;
    this.init();
  }

  private init(): void {
    this.container.style.height = `${this.items.length * this.itemHeight}px`;
    this.container.style.position = "relative";
    this.updateVisibleItems();

    this.container.addEventListener(
      "scroll",
      throttle(() => this.updateVisibleItems(), 16)
    );
  }

  private updateVisibleItems(): void {
    const scrollTop = this.container.scrollTop;
    this.startIndex = Math.floor(scrollTop / this.itemHeight);
    this.endIndex = Math.min(
      this.startIndex + this.visibleItems,
      this.items.length
    );

    // Update DOM
    this.render();
  }

  private render(): void {
    const fragment = document.createDocumentFragment();
    for (let i = this.startIndex; i < this.endIndex; i++) {
      const item = this.items[i];
      const element = document.createElement("div");
      element.style.position = "absolute";
      element.style.top = `${i * this.itemHeight}px`;
      element.style.height = `${this.itemHeight}px`;
      element.textContent = item.content;
      element.setAttribute("data-id", String(item.id));
      fragment.appendChild(element);
    }

    this.container.innerHTML = "";
    this.container.appendChild(fragment);
  }
}
