import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url' || !supabaseKey || supabaseKey === 'your_supabase_anon_key') {
    // If Supabase is not configured, allow all routes
    return response;
  }
  
  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Verificar si el usuario está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/prompts',
    '/dashboard/purchases',
    '/dashboard/settings',
  ];

  // Rutas de autenticación (redirigir a dashboard si ya está autenticado)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname === route);

    // Redirigir a login si intenta acceder a una ruta protegida sin estar autenticado
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirigir al dashboard si intenta acceder a rutas de autenticación estando ya autenticado
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
  } catch (error) {
    console.warn('Error in middleware:', error);
    // If there's an error, allow the request to continue
    return response;
  }
}

// Configurar las rutas en las que se ejecutará el middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};