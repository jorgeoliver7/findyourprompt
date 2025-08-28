import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/types';

// Crear un cliente de Supabase en el servidor
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Check if Supabase is configured
  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url' || !supabaseKey || supabaseKey === 'your_supabase_anon_key') {
    throw new Error('Supabase is not configured properly');
  }
  
  const cookieStore = cookies();
  
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { [key: string]: unknown } = {}) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: { [key: string]: unknown } = {}) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

// Obtener el usuario actual desde el servidor
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // Obtener los datos del perfil del usuario desde la tabla users
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return profile;
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    return null;
  }
}

// Middleware para proteger rutas que requieren autenticación
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}