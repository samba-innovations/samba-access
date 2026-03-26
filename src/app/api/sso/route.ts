import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/sso — called by target systems to validate an SSO token
// Body: { token: string }
// Returns: { user: { id, name, email, role, mustChangePassword } }
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    if (!token) {
      return NextResponse.json({ error: 'Token ausente.' }, { status: 400 })
    }

    const ssoToken = await prisma.ssoToken.findUnique({
      where: { id: token },
      include: {
        user: {
          include: {
            userRoles: { include: { role: true } },
            projectAccess: true,
          },
        },
      },
    })

    if (!ssoToken) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })
    }

    if (ssoToken.used) {
      return NextResponse.json({ error: 'Token já utilizado.' }, { status: 401 })
    }

    if (ssoToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expirado.' }, { status: 401 })
    }

    // Mark token as used
    await prisma.ssoToken.update({
      where: { id: token },
      data: { used: true },
    })

    const user = ssoToken.user
    const role = user.userRoles[0]?.role.name ?? 'TEACHER'
    const DEFAULT_PROJECTS = ['code', 'edvance']
    const explicitProjects = user.projectAccess.map((a: { project: string }) => a.project)
    const projects = [...new Set([...DEFAULT_PROJECTS, ...explicitProjects])]

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        mustChangePassword: user.mustChangePassword,
        isAdmin: user.isAdmin,
        projects,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
