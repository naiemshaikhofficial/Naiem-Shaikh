// utils/cache.ts
const CACHE_PREFIX = "naiem_"
const DEFAULT_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export interface CacheEntry<T> {
  data: T
  timestamp: number
}

export const cache = {
  set<T>(key: string, data: T, duration: number = DEFAULT_CACHE_DURATION) {
    if (typeof window === "undefined") return // SSR safety

    try {
      const entry: CacheEntry<T> & { duration: number } = {
        data,
        timestamp: Date.now(),
        duration,
      }
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
    } catch (e) {
      console.error("Cache set error:", e)
    }
  },

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null // SSR safety

    try {
      const item = localStorage.getItem(CACHE_PREFIX + key)
      if (!item) return null

      const entry = JSON.parse(item) as CacheEntry<T> & { duration?: number }
      const duration = entry.duration ?? DEFAULT_CACHE_DURATION
      const isExpired = Date.now() - entry.timestamp > duration

      if (isExpired) {
        localStorage.removeItem(CACHE_PREFIX + key)
        return null
      }

      return entry.data
    } catch (e) {
      console.error("Cache get error:", e)
      return null
    }
  },

  remove(key: string) {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(CACHE_PREFIX + key)
    } catch (e) {
      console.error("Cache remove error:", e)
    }
  },

  clear() {
    if (typeof window === "undefined") return
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) localStorage.removeItem(key)
      })
    } catch (e) {
      console.error("Cache clear error:", e)
    }
  },
}
