import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/'
    const type = requestUrl.searchParams.get('type')

    if (code) {
        const response = NextResponse.redirect(new URL(next, requestUrl.origin))

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error)
            return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
        }

        // Handle password recovery redirect
        if (type === 'recovery') {
            return NextResponse.redirect(new URL('/reset-password/update', requestUrl.origin))
        }

        // Get user role to determine redirect destination
        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()

            const isStaff = profile?.role && ['super_admin', 'management', 'editor', 'support'].includes(profile.role)

            if (isStaff) {
                return NextResponse.redirect(new URL('/dashboard?verified=true', requestUrl.origin))
            } else {
                return NextResponse.redirect(new URL('/portal?verified=true', requestUrl.origin))
            }
        }

        return response
    }

    // No code provided, redirect to login
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
