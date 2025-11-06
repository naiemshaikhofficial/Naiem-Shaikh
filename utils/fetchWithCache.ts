// utils/fetchWithCache.ts
import { cache } from "./cache"
import { supabase } from "@/lib/supabase"

/**
 * Fetch data from Supabase with caching in localStorage.
 * @param key Cache key name
 * @param table Supabase table name
 * @param filter Optional filter object (like { slug: "rap-india" })
 * @param duration Cache duration in ms (default 24h)
 */
export async function fetchWithCache<T>(
  key: string,
  table: string,
  filter?: Record<string, any>,
  duration = 24 * 60 * 60 * 1000
): Promise<T | null> {
  // 1️⃣ Check cache first
  const cached = cache.get<T>(key)
  if (cached) {
    console.log("🟢 Using cached:", key)
    return cached
  }

  // 2️⃣ Otherwise fetch from Supabase
  console.log("🔵 Fetching fresh data for:", key)

  let query = supabase.from(table).select("*")
  if (filter) {
    for (const [col, val] of Object.entries(filter)) {
      query = query.eq(col, val)
    }
  }

  const { data, error } = await query.single()
  if (error) {
    console.error("Supabase fetch error:", error)
    return null
  }

  // 3️⃣ Save in cache
  cache.set(key, data, duration)

  return data
}
