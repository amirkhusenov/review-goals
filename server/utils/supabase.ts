import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  if (!config.supabaseUrl) {
    throw createError({
      statusCode: 500,
      message: 'SUPABASE_URL is not configured. Please add it to your .env file.'
    })
  }
  
  if (!config.supabaseKey) {
    throw createError({
      statusCode: 500,
      message: 'SUPABASE_SERVICE_KEY is not configured. Please add it to your .env file.'
    })
  }
  
  return createClient(
    config.supabaseUrl,
    config.supabaseKey
  )
}
