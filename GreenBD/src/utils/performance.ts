import { InteractionManager } from 'react-native';

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  startMeasure(label: string): void {
    this.metrics.set(label, Date.now());
  }

  endMeasure(label: string): number {
    const start = this.metrics.get(label);
    if (!start) return 0;
    
    const duration = Date.now() - start;
    this.metrics.delete(label);
    
    if (__DEV__) {
      console.log(`[Performance] ${label}: ${duration}ms`);
    }
    
    return duration;
  }

  async runAfterInteractions<T>(callback: () => T | Promise<T>): Promise<T> {
    return new Promise((resolve) => {
      InteractionManager.runAfterInteractions(async () => {
        const result = await callback();
        resolve(result);
      });
    });
  }

  measureAsync<T>(label: string, callback: () => Promise<T>): Promise<T> {
    this.startMeasure(label);
    return callback().finally(() => {
      this.endMeasure(label);
    });
  }
}

export const performance = new PerformanceMonitor();
