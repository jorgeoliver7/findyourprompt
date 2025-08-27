import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

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

  return res;
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