import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected routes that require authentication
  const dashboardPaths = ['/dashboard', '/admin']
  const portalPaths = ['/portal']

  const isDashboardPath = dashboardPaths.some(path => pathname.startsWith(path))
  const isPortalPath = portalPaths.some(path => pathname.startsWith(path))
  const isProtectedPath = isDashboardPath || isPortalPath

  // If accessing protected route without authentication, redirect to login
  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control
  if (user && isProtectedPath) {
    // Get user role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Debug logging
    console.log('[Middleware] User ID:', user.id)
    console.log('[Middleware] Profile data:', profile)
    console.log('[Middleware] Profile error:', profileError)

    // Determine role with fallback to user metadata
    let userRole = 'client' // Default
    if (profile?.role) {
      userRole = profile.role
    } else if (user.user_metadata?.role) {
      userRole = user.user_metadata.role
    }

    console.log('[Middleware] Detected role:', userRole)

    // Check if user is staff (not a client)
    const isStaff = ['super_admin', 'management', 'editor', 'support'].includes(userRole)
    console.log('[Middleware] Is staff:', isStaff)

    // Portal is only for clients
    if (isPortalPath && isStaff) {
      // Redirect staff to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Dashboard is for staff and management (not clients)
    if (isDashboardPath && !isStaff) {
      // Redirect clients to portal
      return NextResponse.redirect(new URL('/portal', request.url))
    }
  }

  // If authenticated user tries to access login/signup, redirect appropriately
  if (user && (pathname === '/login' || pathname === '/signup')) {
    // Get user role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Determine role with fallback
    let userRole = 'client'
    if (profile?.role) {
      userRole = profile.role
    } else if (user.user_metadata?.role) {
      userRole = user.user_metadata.role
    }

    // Check if staff role
    const isStaff = ['super_admin', 'management', 'editor', 'support'].includes(userRole)

    // Redirect based on role
    if (isStaff) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/portal', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     * - api routes (API endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
