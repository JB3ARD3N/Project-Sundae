import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Project {
  id: string
  name: string
  status: string
  files: string[]
  created_at: string
  user_id?: string
}

export interface Capture {
  id: string
  transcript: string
  tags: string[]
  status: string
  created_at: string
  user_id?: string
}

export interface QueueItem {
  id: string
  transcript?: string
  name?: string
  status: string
  tags: string[]
  complexity?: number
  created_at: string
  cost?: number
  deploy_url?: string
}
