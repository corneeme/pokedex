// Simple cache for PokeAPI responses
export interface IStorage {
  getCache(key: string): any | undefined;
  setCache(key: string, value: any): void;
}

export class MemStorage implements IStorage {
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly cacheDuration = 1000 * 60 * 60; // 1 hour

  constructor() {
    this.cache = new Map();
  }

  getCache(key: string): any | undefined {
    const cached = this.cache.get(key);
    if (!cached) return undefined;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data;
  }

  setCache(key: string, value: any): void {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }
}

export const storage = new MemStorage();
