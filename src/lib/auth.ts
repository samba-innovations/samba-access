import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'samba_token'
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export interface SessionUser {
  id: number
  name: string
  email: string
  role: string
  mustChangePassword: boolean
  isAdmin: boolean
  projects: string[]   // ex: ['code', 'edvance', 'flourish']
  // avatarUrl e bio NÃO ficam no JWT (cookie tem limite de 4KB)
  avatarUrl?: string | null
  bio?: string | null
}

// Payload que realmente vai no token — sem dados grandes
interface TokenPayload {
  id: number
  name: string
  email: string
  role: string
  mustChangePassword: boolean
  isAdmin: boolean
  projects: string[]
  bio?: string | null
}

export async function createToken(user: SessionUser): Promise<string> {
  const payload: TokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    isAdmin: user.isAdmin,
    projects: user.projects,
    bio: user.bio ?? null,
  }
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export function cookieOptions(maxAge = 8 * 60 * 60) {
  const opts: Record<string, unknown> = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
  if (process.env.COOKIE_DOMAIN) opts.domain = process.env.COOKIE_DOMAIN
  return opts
}
