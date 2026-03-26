import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('samba_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const session = await verifyToken(token)
  if (!session) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('samba_token')
    return response
  }

  const { pathname } = request.nextUrl

  // Usuário precisa trocar a senha antes de fazer qualquer outra coisa
  if (session.mustChangePassword && pathname !== '/trocar-senha') {
    return NextResponse.redirect(new URL('/trocar-senha', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|_next|api|favicon.ico|imgs).*)'],
}
