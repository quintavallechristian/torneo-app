'use server';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from './utils/supabase/server';
export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const protectedRoutes = ['/matches/new', '/matches/*/edit'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.match(route),
  );

  // Se l'utente è loggato e cerca di accedere a una pagina di login o signup, lo reindirizziamo
  if (
    data.user &&
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/signup')
  ) {
    return NextResponse.redirect(new URL('/matches', request.url));
  }

  // Se l'utente non è loggato e cerca di accedere a una pagina protetta, lo reindirizziamo
  if (!data.user && isProtectedRoute) {
    return await updateSession(request);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/matches/new', '/matches/:path*/edit', '/login', '/signup'],
};
