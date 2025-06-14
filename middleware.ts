import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Vérifier que les variables d'environnement existent
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si les variables ne sont pas configurées, laisser passer sans authentification
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase environment variables not configured, skipping auth middleware')
    return response
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    })

    // Routes publiques qui ne nécessitent pas d'authentification
    const publicRoutes = ['/auth/login', '/auth/register', '/api/auth', '/', '/api']
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
    )

    // Pour les routes API, on laisse passer
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return response
    }

    // Rafraîchir la session si nécessaire
    const { data: { user } } = await supabase.auth.getUser()

    // Si pas d'utilisateur et route privée, rediriger vers login
    if (!user && !isPublicRoute) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Si utilisateur connecté et sur page de login, rediriger vers dashboard
    if (user && (request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/register')) {
      const userRole = user.user_metadata?.role || 'stagiaire'
      const dashboardRoute = userRole === 'admin' ? '/admin' : 
                           userRole === 'rh' ? '/rh' : 
                           userRole === 'tuteur' ? '/tuteur' : '/stagiaire'
      return NextResponse.redirect(new URL(dashboardRoute, request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|images).*)',
  ],
}
