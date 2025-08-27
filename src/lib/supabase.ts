import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

// Browser client for client-side operations
export const createSupabaseBrowserClient = () => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if properly configured
    if (!url || url === 'your_supabase_project_url' || !key || key === 'your_supabase_anon_key') {
      return null;
    }
    
    // Additional URL validation
    if (!url.startsWith('https://') || url.includes('your_supabase_project_url')) {
      return null;
    }
    
    return createBrowserClient<Database>(url, key);
  } catch (error) {
    return null;
  }
};

// Get Supabase client with proper error handling
export const getSupabaseClient = () => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if properly configured
    if (!url || url === 'your_supabase_project_url' || !key || key === 'your_supabase_anon_key') {
      return null;
    }
    
    // Additional URL validation
    if (!url.startsWith('https://') || url.includes('your_supabase_project_url')) {
      return null;
    }
    
    return createClient<Database>(
      url,
      key,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );
  } catch (error) {
    return null;
  }
};