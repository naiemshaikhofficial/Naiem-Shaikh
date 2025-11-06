// Local storage caching utilities
const CACHE_PREFIX = "naiem_"
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export interface CacheEntry<T> {
  data: T
  timestamp: number
}

export const cache = {
  set: <T,>(key: string, data: T) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
    } catch (e) {
      console.error("Cache set error:", e)
    }
  },

  get: <T,>(key: string): T | null => {
    try {
      const item = localStorage.getItem(CACHE_PREFIX + key)
      if (!item) return null

      const entry: CacheEntry<T> = JSON.parse(item)
      const isExpired = Date.now() - entry.timestamp > CACHE_DURATION

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

  remove: (key: string) => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key)
    } catch (e) {
      console.error("Cache remove error:", e)
    }
  },

  clear: () => {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX))
      keys.forEach((key) => localStorage.removeItem(key))
    } catch (e) {
      console.error("Cache clear error:", e)
    }
  },
}
