import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  image_url: string
  is_new: boolean
  created_at: string
  updated_at: string
}

export type PortfolioItem = {
  id: string
  title: string
  description: string
  image_url: string | null
  youtube_url: string | null
  created_at: string
  updated_at: string
}

export type Contact = {
  name: string
  email: string
  message: string
}
