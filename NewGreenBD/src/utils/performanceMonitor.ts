/**
 * Performance Monitoring Utility
 * Track and measure app performance metrics
 */

import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface AggregatedMetrics {
  count: number;
  total: number;
  average: number;
  min: number;
  max: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private activeTimers: Map<string, number> = new Map();
  private enabled = __DEV__;

  /**
   * Start timing an operation
   */
  startTimer(name: string, metadata?: Record<string, any>): () => void {
    if (!this.enabled) return () => {};

    const startTime = Date.now();
    const timerId = `${name}_${startTime}`;
    
    this.activeTimers.set(timerId, startTime);

    // Return a function to stop the timer
    return () => this.stopTimer(name, timerId, metadata);
  }

  /**
   * Stop timing an operation
   */
  private stopTimer(name: string, timerId: string, metadata?: Record<string, any>) {
    const startTime = this.activeTimers.get(timerId);
    if (!startTime) {
      logger.warn(`Timer ${name} was not started`);
      return;
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    const metric: PerformanceMetric = {
      name,
      startTime,
      endTime,
      duration,
      metadata,
    };

    // Store metric
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    // Clean up
    this.activeTimers.delete(timerId);

    // Log if duration is significant
    if (duration > 1000) {
      logger.warn(`Slow operation: ${name} took ${duration}ms`, metadata);
    } else {
      logger.debug(`Performance: ${name} took ${duration}ms`, metadata);
    }
  }

  /**
   * Measure a function execution time
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T,
    metadata?: Record<string, any>
  ): Promise<T> {
    const stop = this.startTimer(name, metadata);
    try {
      const result = await fn();
      stop();
      return result;
    } catch (error) {
      stop();
      throw error;
    }
  }

  /**
   * Get metrics for a specific operation
   */
  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get aggregated metrics for an operation
   */
  getAggregatedMetrics(name: string): AggregatedMetrics | null {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return null;

    const durations = metrics
      .map((m) => m.duration)
      .filter((d): d is number => d !== undefined);

    if (durations.length === 0) return null;

    return {
      count: durations.length,
      total: durations.reduce((sum, d) => sum + d, 0),
      average: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
    };
  }

  /**
   * Get all aggregated metrics
   */
  getAllAggregatedMetrics(): Record<string, AggregatedMetrics> {
    const result: Record<string, AggregatedMetrics> = {};
    
    for (const [name] of this.metrics) {
      const aggregated = this.getAggregatedMetrics(name);
      if (aggregated) {
        result[name] = aggregated;
      }
    }

    return result;
  }

  /**
   * Clear metrics for a specific operation
   */
  clearMetrics(name: string) {
    this.metrics.delete(name);
  }

  /**
   * Clear all metrics
   */
  clearAllMetrics() {
    this.metrics.clear();
    this.activeTimers.clear();
  }

  /**
   * Get performance report
   */
  getReport(): string {
    const aggregated = this.getAllAggregatedMetrics();
    const lines: string[] = ['Performance Report', '=================', ''];

    for (const [name, metrics] of Object.entries(aggregated)) {
      lines.push(`${name}:`);
      lines.push(`  Count: ${metrics.count}`);
      lines.push(`  Average: ${metrics.average.toFixed(2)}ms`);
      lines.push(`  Min: ${metrics.min}ms`);
      lines.push(`  Max: ${metrics.max}ms`);
      lines.push(`  Total: ${metrics.total}ms`);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Log performance report
   */
  logReport() {
    logger.info('Performance Report', this.getAllAggregatedMetrics());
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Check if monitoring is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const measureAsync = <T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  return performanceMonitor.measure(name, fn, metadata);
};

export const measureSync = <T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, any>
): T => {
  const stop = performanceMonitor.startTimer(name, metadata);
  try {
    return fn();
  } finally {
    stop();
  }
};

// React hook for measuring component render time
export const useMeasureRender = (componentName: string) => {
  if (__DEV__) {
    const renderStart = Date.now();
    
    return () => {
      const renderTime = Date.now() - renderStart;
      if (renderTime > 16) { // More than one frame (60fps)
        logger.warn(`Slow render: ${componentName} took ${renderTime}ms`);
      }
    };
  }
  
  return () => {};
};

// Measure API calls
export const measureApiCall = async <T>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> => {
  return measureAsync(`API: ${endpoint}`, fn);
};

// Measure screen load time
export const measureScreenLoad = (screenName: string) => {
  return performanceMonitor.startTimer(`Screen: ${screenName}`);
};

// Measure database operations
export const measureDbOperation = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  return measureAsync(`DB: ${operation}`, fn);
};

export default performanceMonitor;
