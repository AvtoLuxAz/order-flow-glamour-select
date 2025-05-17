// Performance Monitoring Types
export interface PerformanceMetric {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

// Virtual Scrolling Types
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  totalItems: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  totalHeight: number;
}

// Performance Entry Types
export interface ResourceTiming {
  name: string;
  duration: number;
  startTime: number;
  initiatorType: string;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
}

// Web Performance API Types
export interface LargestContentfulPaint extends PerformanceEntry {
  element: Element | null;
  size: number;
  url: string;
  id: string;
  renderTime: number;
  loadTime: number;
}

export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources: LayoutShiftSource[];
}

export interface LayoutShiftSource {
  node?: Node;
  currentRect: DOMRectReadOnly;
  previousRect: DOMRectReadOnly;
}

// Image Optimization Types
export interface ImageOptimizationConfig {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
}

// Performance Monitor Options
export interface PerformanceMonitorOptions {
  threshold?: number;
  maxHistorySize?: number;
  enableDebugLogs?: boolean;
}
