'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { createToken, cookieOptions, getSession, SessionUser } from './auth'

const COOKIE_NAME = 'samba_token'

// Projetos liberados por padrão para todos os usuários
const DEFAULT_PROJECTS = ['code', 'edvance', 'paper']

// Projetos liberados automaticamente para admins (sem linha em user_project_access)
const ADMIN_PROJECTS = ['flourish', 'radio']

// ─── Helpers ───────────────────────────────────────────────────────────────

async function buildSession(user: {
  id: number; name: string; email: string; must_change_password: boolean;
  is_admin: boolean; bio: string | null; role_name: string | null;
}): Promise<SessionUser> {
  // Busca projetos com acesso explícito (ex: flourish)
  const accessRows = await prisma.$queryRaw<Array<{ project: string }>>`
    SELECT project FROM samba_school.user_project_access WHERE user_id = ${user.id}
  `
  const extraProjects = accessRows.map(r => r.project).filter(p => !DEFAULT_PROJECTS.includes(p))
  const adminProjects = user.is_admin ? ADMIN_PROJECTS.filter(p => !extraProjects.includes(p)) : []
  const projects = [...DEFAULT_PROJECTS, ...extraProjects, ...adminProjects]

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role_name ?? 'TEACHER',
    mustChangePassword: user.must_change_password,
    isAdmin: user.is_admin,
    projects,
    bio: user.bio ?? null,
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function login(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Preencha todos os campos.' }

  const rows = await prisma.$queryRaw<Array<{
    id: number; name: string; email: string; password_hash: string;
    is_active: boolean; must_change_password: boolean; is_admin: boolean;
    avatar_url: string | null; bio: string | null; role_name: string | null;
  }>>`
    SELECT u.id, u.name, u.email, u.password_hash, u.is_active,
           u.must_change_password, u.is_admin, u.avatar_url, u.bio,
           r.name AS role_name
    FROM samba_school.users u
    LEFT JOIN samba_school.user_roles ur ON ur.user_id = u.id
    LEFT JOIN samba_school.roles r ON r.id = ur.role_id
    WHERE u.email = ${email}
  `
  const user = rows[0]

  if (!user || !user.is_active) return { error: 'Credenciais inválidas.' }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return { error: 'Credenciais inválidas.' }

  const session = await buildSession(user)
  const token = await createToken(session)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, cookieOptions())
  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', { ...cookieOptions(0), maxAge: 0 })
  redirect('/login')
}

// ─── SSO ───────────────────────────────────────────────────────────────────

export async function createSsoToken(userId: number, target: string): Promise<string | null> {
  // admin: requer is_admin = true
  if (target === 'admin') {
    const rows = await prisma.$queryRaw<Array<{ is_admin: boolean }>>`
      SELECT is_admin FROM samba_school.users WHERE id = ${userId}
    `
    if (!rows[0]?.is_admin) return null
  }
  // projetos não-padrão: admins passam direto, outros precisam de acesso explícito
  else if (!DEFAULT_PROJECTS.includes(target)) {
    const userRow = await prisma.$queryRaw<Array<{ is_admin: boolean }>>`
      SELECT is_admin FROM samba_school.users WHERE id = ${userId}
    `
    if (!userRow[0]?.is_admin) {
      const access = await prisma.$queryRaw<Array<{ user_id: number }>>`
        SELECT user_id FROM samba_school.user_project_access
        WHERE user_id = ${userId} AND project = ${target}
      `
      if (access.length === 0) return null
    }
  }

  const expiresAt = new Date(Date.now() + 30 * 1000)
  const ssoToken = await prisma.ssoToken.create({ data: { userId, target, expiresAt } })
  return ssoToken.id
}

// ─── Profile ───────────────────────────────────────────────────────────────

export async function updateProfile(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  const name = (formData.get('name') as string)?.trim()
  const bio = (formData.get('bio') as string)?.trim() ?? ''

  if (!name || name.length < 2) return { error: 'Nome muito curto.' }
  if (name.length > 100) return { error: 'Nome muito longo (máx. 100 caracteres).' }

  await prisma.$executeRaw`
    UPDATE samba_school.users
    SET name = ${name}, bio = ${bio.slice(0, 200)}
    WHERE id = ${session.id}
  `

  const rows = await prisma.$queryRaw<Array<{
    id: number; name: string; email: string; must_change_password: boolean;
    is_admin: boolean; bio: string | null; role_name: string | null;
  }>>`
    SELECT u.id, u.name, u.email, u.must_change_password, u.is_admin, u.bio, r.name AS role_name
    FROM samba_school.users u
    LEFT JOIN samba_school.user_roles ur ON ur.user_id = u.id
    LEFT JOIN samba_school.roles r ON r.id = ur.role_id
    WHERE u.id = ${session.id}
  `
  const updated = rows[0]
  const newSession = await buildSession(updated)
  const token = await createToken(newSession)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, cookieOptions())

  return { success: 'Perfil atualizado com sucesso.' }
}

export async function getAvatarUrl(userId: number): Promise<string | null> {
  const rows = await prisma.$queryRaw<Array<{ avatar_url: string | null }>>`
    SELECT avatar_url FROM samba_school.users WHERE id = ${userId}
  `
  return rows[0]?.avatar_url ?? null
}

export async function updateAvatar(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  const avatarUrl = formData.get('avatarUrl') as string
  if (!avatarUrl) return { error: 'Nenhuma imagem enviada.' }

  const isBase64 = avatarUrl.startsWith('data:image/')
  const isHttps = avatarUrl.startsWith('https://')
  if (!isBase64 && !isHttps) return { error: 'Formato de imagem inválido.' }

  if (isBase64 && avatarUrl.length > 2_800_000) return { error: 'Imagem muito grande. Máx. 2MB.' }

  try {
    await prisma.$executeRaw`
      UPDATE samba_school.users
      SET avatar_url = ${avatarUrl}
      WHERE id = ${session.id}
    `
  } catch (e: any) {
    return { error: `Erro ao salvar: ${e?.message ?? e}` }
  }

  return { success: 'Foto atualizada.' }
}

export async function updatePassword(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  const current = formData.get('current') as string
  const next = formData.get('next') as string
  const confirm = formData.get('confirm') as string

  if (!current || !next || !confirm) return { error: 'Preencha todos os campos.' }
  if (next.length < 8) return { error: 'A nova senha deve ter no mínimo 8 caracteres.' }
  if (next !== confirm) return { error: 'As senhas não coincidem.' }

  const rows = await prisma.$queryRaw<Array<{ password_hash: string }>>`
    SELECT password_hash FROM samba_school.users WHERE id = ${session.id}
  `
  if (!rows[0]) return { error: 'Usuário não encontrado.' }

  const valid = await bcrypt.compare(current, rows[0].password_hash)
  if (!valid) return { error: 'Senha atual incorreta.' }

  const hash = await bcrypt.hash(next, 12)
  await prisma.$executeRaw`
    UPDATE samba_school.users
    SET password_hash = ${hash}, must_change_password = false
    WHERE id = ${session.id}
  `

  return { success: 'Senha alterada com sucesso.' }
}

// ─── Força troca de senha (primeiro acesso) ─────────────────────────────────

export async function forceChangePassword(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  const next = formData.get('next') as string
  const confirm = formData.get('confirm') as string

  if (!next || !confirm) return { error: 'Preencha todos os campos.' }
  if (next.length < 8) return { error: 'A senha deve ter no mínimo 8 caracteres.' }
  if (next !== confirm) return { error: 'As senhas não coincidem.' }

  const hash = await bcrypt.hash(next, 12)
  await prisma.$executeRaw`
    UPDATE samba_school.users
    SET password_hash = ${hash}, must_change_password = false
    WHERE id = ${session.id}
  `

  // Refresh JWT sem o flag mustChangePassword
  const rows = await prisma.$queryRaw<Array<{
    id: number; name: string; email: string; must_change_password: boolean;
    is_admin: boolean; bio: string | null; role_name: string | null;
  }>>`
    SELECT u.id, u.name, u.email, u.must_change_password, u.is_admin, u.bio, r.name AS role_name
    FROM samba_school.users u
    LEFT JOIN samba_school.user_roles ur ON ur.user_id = u.id
    LEFT JOIN samba_school.roles r ON r.id = ur.role_id
    WHERE u.id = ${session.id}
  `
  const updated = rows[0]
  const newSession = await buildSession(updated)
  const token = await createToken(newSession)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, cookieOptions())
  redirect('/')
}

// ─── User Management (Admin only) ──────────────────────────────────────────

function requireAdmin(session: SessionUser | null) {
  if (!session?.isAdmin) throw new Error('Sem permissão.')
}

export async function getUsers() {
  const session = await getSession()
  if (!session?.isAdmin) return []

  return prisma.$queryRaw<Array<{
    id: number; name: string; email: string; is_active: boolean;
    must_change_password: boolean; is_admin: boolean;
    avatar_url: string | null; created_at: Date; role_name: string | null;
  }>>`
    SELECT u.id, u.name, u.email, u.is_active, u.must_change_password, u.is_admin,
           u.avatar_url, u.created_at, r.name AS role_name
    FROM samba_school.users u
    LEFT JOIN samba_school.user_roles ur ON ur.user_id = u.id
    LEFT JOIN samba_school.roles r ON r.id = ur.role_id
    ORDER BY u.name ASC
  `
}

export async function getRoles() {
  const session = await getSession()
  if (!session?.isAdmin) return []
  return prisma.$queryRaw<Array<{ id: number; name: string }>>`
    SELECT id, name FROM samba_school.roles ORDER BY name
  `
}

export async function getUserById(id: number) {
  const session = await getSession()
  if (!session?.isAdmin) return null

  const rows = await prisma.$queryRaw<Array<{
    id: number; name: string; email: string; is_active: boolean;
    must_change_password: boolean; is_admin: boolean;
    avatar_url: string | null; bio: string | null; created_at: Date;
    role_id: number | null; role_name: string | null;
  }>>`
    SELECT u.id, u.name, u.email, u.is_active, u.must_change_password, u.is_admin,
           u.avatar_url, u.bio, u.created_at,
           r.id AS role_id, r.name AS role_name
    FROM samba_school.users u
    LEFT JOIN samba_school.user_roles ur ON ur.user_id = u.id
    LEFT JOIN samba_school.roles r ON r.id = ur.role_id
    WHERE u.id = ${id}
  `
  return rows[0] ?? null
}

export async function adminUpdateUser(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Sem permissão.' }

  const id = parseInt(formData.get('id') as string, 10)
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const roleId = parseInt(formData.get('roleId') as string, 10)
  const isActive = formData.get('isActive') === 'true'
  const mustChangePassword = formData.get('mustChangePassword') === 'true'

  if (!name || name.length < 2) return { error: 'Nome muito curto.' }
  if (!email || !email.includes('@')) return { error: 'E-mail inválido.' }
  if (isNaN(id) || isNaN(roleId)) return { error: 'Dados inválidos.' }

  await prisma.$executeRaw`
    UPDATE samba_school.users
    SET name = ${name}, email = ${email},
        is_active = ${isActive}, must_change_password = ${mustChangePassword}
    WHERE id = ${id}
  `
  await prisma.$executeRaw`DELETE FROM samba_school.user_roles WHERE user_id = ${id}`
  await prisma.$executeRaw`INSERT INTO samba_school.user_roles (user_id, role_id) VALUES (${id}, ${roleId})`

  return { success: 'Usuário atualizado com sucesso.' }
}

export async function adminResetPassword(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Sem permissão.' }

  const id = parseInt(formData.get('id') as string, 10)
  const newPassword = formData.get('newPassword') as string

  if (isNaN(id)) return { error: 'ID inválido.' }
  if (!newPassword || newPassword.length < 8)
    return { error: 'A senha deve ter no mínimo 8 caracteres.' }

  const hash = await bcrypt.hash(newPassword, 12)
  await prisma.$executeRaw`
    UPDATE samba_school.users
    SET password_hash = ${hash}, must_change_password = true
    WHERE id = ${id}
  `

  return { success: 'Senha redefinida. O usuário deverá alterá-la no próximo acesso.' }
}

export async function adminCreateUser(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Sem permissão.' }

  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const roleId = parseInt(formData.get('roleId') as string, 10)
  const password = formData.get('password') as string

  if (!name || name.length < 2) return { error: 'Nome muito curto.' }
  if (!email || !email.includes('@')) return { error: 'E-mail inválido.' }
  if (isNaN(roleId)) return { error: 'Selecione um cargo.' }
  if (!password || password.length < 8)
    return { error: 'A senha deve ter no mínimo 8 caracteres.' }

  const existing = await prisma.$queryRaw<Array<{ id: number }>>`
    SELECT id FROM samba_school.users WHERE email = ${email}
  `
  if (existing.length > 0) return { error: 'E-mail já cadastrado.' }

  const hash = await bcrypt.hash(password, 12)
  const created = await prisma.$queryRaw<Array<{ id: number }>>`
    INSERT INTO samba_school.users (name, email, password_hash, must_change_password)
    VALUES (${name}, ${email}, ${hash}, true)
    RETURNING id
  `
  const userId = created[0].id
  await prisma.$executeRaw`
    INSERT INTO samba_school.user_roles (user_id, role_id) VALUES (${userId}, ${roleId})
  `

  return { success: `Usuário ${name} criado com sucesso.` }
}

// ─── Admin: Controle de acesso por projeto ─────────────────────────────────

export async function adminGetUsersWithAccess() {
  const session = await getSession()
  if (!session?.isAdmin) return []

  const users = await prisma.$queryRaw<Array<{
    id: number; name: string; email: string; is_active: boolean;
    is_admin: boolean; must_change_password: boolean;
    created_at: Date; role_name: string | null;
  }>>`
    SELECT u.id, u.name, u.email, u.is_active, u.is_admin, u.must_change_password,
           u.created_at, r.name AS role_name
    FROM samba_school.users u
    LEFT JOIN samba_school.user_roles ur ON ur.user_id = u.id
    LEFT JOIN samba_school.roles r ON r.id = ur.role_id
    ORDER BY u.name ASC
  `

  const access = await prisma.$queryRaw<Array<{ user_id: number; project: string }>>`
    SELECT user_id, project FROM samba_school.user_project_access
  `

  const accessMap: Record<number, string[]> = {}
  for (const a of access) {
    if (!accessMap[a.user_id]) accessMap[a.user_id] = []
    accessMap[a.user_id].push(a.project)
  }

  return users.map(u => ({
    ...u,
    projects: [...DEFAULT_PROJECTS, ...(accessMap[u.id] ?? [])],
  }))
}

export async function adminGrantProjectAccess(userId: number, project: string) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Sem permissão.' }

  await prisma.$executeRaw`
    INSERT INTO samba_school.user_project_access (user_id, project, granted_by)
    VALUES (${userId}, ${project}, ${session.id})
    ON CONFLICT DO NOTHING
  `
  return { success: true }
}

export async function adminRevokeProjectAccess(userId: number, project: string) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Sem permissão.' }

  await prisma.$executeRaw`
    DELETE FROM samba_school.user_project_access
    WHERE user_id = ${userId} AND project = ${project}
  `
  return { success: true }
}

export async function adminToggleAdmin(userId: number, isAdmin: boolean) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Sem permissão.' }
  if (userId === session.id) return { error: 'Não é possível alterar seu próprio perfil de admin.' }

  await prisma.$executeRaw`
    UPDATE samba_school.users SET is_admin = ${isAdmin} WHERE id = ${userId}
  `
  return { success: true }
}

export async function adminToggleActive(userId: number, isActive: boolean) {
  const session = await getSession()
  if (!session?.isAdmin) return { error: 'Sem permissão.' }
  if (userId === session.id) return { error: 'Não é possível desativar sua própria conta.' }

  await prisma.$executeRaw`
    UPDATE samba_school.users SET is_active = ${isActive} WHERE id = ${userId}
  `
  return { success: true }
}
