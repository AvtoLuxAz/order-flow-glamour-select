import { logger } from "../../../shared/utils";
import { PERFORMANCE_CONFIG } from "..";
import type {
  PerformanceMetric,
  ResourceTiming,
  PerformanceMonitorOptions,
  LargestContentfulPaint,
  LayoutShift,
} from "../types";

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private readonly threshold: number;
  private readonly maxHistorySize: number;
  private readonly enableDebugLogs: boolean;

  private constructor(options: PerformanceMonitorOptions = {}) {
    this.threshold =
      options.threshold ?? PERFORMANCE_CONFIG.PERFORMANCE_THRESHOLD;
    this.maxHistorySize = options.maxHistorySize ?? 1000;
    this.enableDebugLogs =
      options.enableDebugLogs ?? process.env.NODE_ENV !== "production";

    // Initialize performance observer
    if (typeof window !== "undefined") {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.logPerformanceEntry(entry);
        });
      });

      observer.observe({
        entryTypes: [
          "resource",
          "navigation",
          "paint",
          "largest-contentful-paint",
          "layout-shift",
        ],
      });
    }
  }

  public static getInstance(
    options?: PerformanceMonitorOptions
  ): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(options);
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string, metadata?: Record<string, unknown>): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });
  }

  endMeasure(name: string): void {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`No performance metric found for: ${name}`);
      return;
    }

    const duration = performance.now() - metric.startTime;
    metric.duration = duration;

    if (duration > this.threshold) {
      logger.warn(`Performance threshold exceeded for ${name}:`, {
        duration,
        metadata: metric.metadata,
      });
    } else if (this.enableDebugLogs) {
      logger.debug(`Performance measurement for ${name}:`, {
        duration,
        metadata: metric.metadata,
      });
    }

    this.metrics.delete(name);
  }

  private logPerformanceEntry(entry: PerformanceEntry): void {
    if (
      entry.entryType === "resource" &&
      entry instanceof PerformanceResourceTiming
    ) {
      const timing: ResourceTiming = {
        name: entry.name,
        duration: entry.duration,
        startTime: entry.startTime,
        initiatorType: entry.initiatorType,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize,
      };

      if (entry.duration > this.threshold) {
        logger.warn("Slow resource load detected:", timing);
      } else if (this.enableDebugLogs) {
        logger.debug("Resource timing:", timing);
      }
    } else if (entry.entryType === "largest-contentful-paint") {
      const lcp = entry as LargestContentfulPaint;
      logger.info("Largest Contentful Paint:", {
        time: lcp.startTime,
        element: lcp.element?.tagName,
        size: lcp.size,
        url: lcp.url,
      });
    } else if (entry.entryType === "layout-shift") {
      const cls = entry as LayoutShift;
      logger.info("Cumulative Layout Shift:", {
        value: cls.value,
        hadRecentInput: cls.hadRecentInput,
        sources: cls.sources.map((source) => ({
          currentRect: source.currentRect,
          previousRect: source.previousRect,
        })),
      });
    }
  }

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    this.startMeasure(name, metadata);
    return fn().finally(() => this.endMeasure(name));
  }

  measure<T>(name: string, fn: () => T, metadata?: Record<string, unknown>): T {
    this.startMeasure(name, metadata);
    try {
      return fn();
    } finally {
      this.endMeasure(name);
    }
  }
}

// Export singleton instance with default configuration
export const performanceMonitor = PerformanceMonitor.getInstance();
