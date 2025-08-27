import { createServerSupabaseClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  
  // Cerrar la sesión del usuario
  await supabase.auth.signOut();
  
  // Redirigir a la página de inicio
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}