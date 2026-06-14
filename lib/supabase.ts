import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aijlvbipvqnvbywxhlbd.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpamx2YmlwdnFudmJ5d3hobGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTk2MjQsImV4cCI6MjA5Njg3NTYyNH0.ilXsLDDazyEiE3_KUnIAlG7_dDDtbAAwoJXoyeixIck'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const supabaseAdmin = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
)
