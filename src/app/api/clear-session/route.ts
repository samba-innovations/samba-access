import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const response = NextResponse.redirect(`${origin}/login`)
  response.cookies.delete('samba_token')
  return response
}
