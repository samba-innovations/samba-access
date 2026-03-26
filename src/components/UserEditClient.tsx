"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Loader2,
  Lock,
  Save,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavLogo } from "@/components/NavLogo";
import { adminUpdateUser, adminResetPassword } from "@/lib/actions";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TEACHER: "Professor",
  COORDINATOR: "Coordenador",
  PRINCIPAL: "Diretor",
  VICE_PRINCIPAL: "Vice-Diretor",
  SECRETARY: "Secretário",
};

interface UserData {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  must_change_password: boolean;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  role_id: number | null;
  role_name: string | null;
}

interface Role {
  id: number;
  name: string;
}

interface Props {
  user: UserData;
  roles: Role[];
}

function UserInfoCard({ user }: { user: UserData }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={user.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold ring-4 ring-primary/20">
          {user.name[0].toUpperCase()}
        </div>
      )}

      <div>
        <p className="font-bold text-foreground text-sm">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        {user.bio && (
          <p className="text-xs text-muted-foreground/70 italic mt-1 line-clamp-2">
            &ldquo;{user.bio}&rdquo;
          </p>
        )}
      </div>

      <div className="w-full border-t border-border/60 pt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Cargo</span>
          <span className="font-semibold text-foreground">
            {ROLE_LABELS[user.role_name ?? ""] ?? user.role_name ?? "—"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Status</span>
          <span
            className={`flex items-center gap-1 font-semibold ${
              user.is_active
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {user.is_active ? (
              <UserCheck className="w-3.5 h-3.5" />
            ) : (
              <UserX className="w-3.5 h-3.5" />
            )}
            {user.is_active ? "Ativo" : "Inativo"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Cadastro</span>
          <span className="font-semibold text-foreground">
            {new Date(user.created_at).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  );
}

function EditForm({ user, roles }: { user: UserData; roles: Role[] }) {
  const [state, action, pending] = useActionState(adminUpdateUser, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={user.id} />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Nome completo
        </label>
        <input
          name="name"
          defaultValue={user.name}
          required
          className="w-full h-11 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          E-mail
        </label>
        <input
          name="email"
          type="email"
          defaultValue={user.email}
          required
          className="w-full h-11 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Cargo
        </label>
        <select
          name="roleId"
          defaultValue={user.role_id ?? ""}
          className="w-full h-11 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {ROLE_LABELS[r.name] ?? r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Conta ativa
          </label>
          <select
            name="isActive"
            defaultValue={user.is_active ? "true" : "false"}
            className="w-full h-11 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground"
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Alterar senha
          </label>
          <select
            name="mustChangePassword"
            defaultValue={user.must_change_password ? "true" : "false"}
            className="w-full h-11 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground"
          >
            <option value="false">Não</option>
            <option value="true">Sim (no próximo login)</option>
          </select>
        </div>
      </div>

      {state?.error && (
        <p className="text-xs text-destructive font-semibold">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#0047b8] transition-colors disabled:opacity-60 shadow-md shadow-primary/20"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Salvar alterações
      </button>
    </form>
  );
}

function ResetPasswordForm({ userId }: { userId: number }) {
  const [state, action, pending] = useActionState(adminResetPassword, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={userId} />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Nova senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
          <input
            name="newPassword"
            type="password"
            required
            placeholder="Mínimo 8 caracteres"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/40"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          O usuário será obrigado a alterar a senha no próximo acesso.
        </p>
      </div>

      {state?.error && (
        <p className="text-xs text-destructive font-semibold">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 shadow-md"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        Redefinir senha
      </button>
    </form>
  );
}

export function UserEditClient({ user, roles }: Props) {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col">
      <div className="pointer-events-none fixed inset-0 dot-grid opacity-40 dark:opacity-20 z-0" />
      <div className="pointer-events-none fixed -top-[10%] -left-[5%] w-[50%] h-[50%] bg-primary/8 rounded-[50%] blur-[140px] z-0" />

      {/* Navbar */}
      <header className="relative z-50 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-4xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <NavLogo />
          <Link
            href="/usuarios"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Usuários
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Editar usuário
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os dados e permissões de acesso.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: user info card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card border border-border rounded-3xl p-6 card-glow"
          >
            <UserInfoCard user={user} />
          </motion.div>

          {/* Right: edit forms */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Edit form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="bg-card border border-border rounded-3xl p-6 card-glow"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Informações do usuário
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Nome, e-mail, cargo e status
                  </p>
                </div>
              </div>
              <EditForm user={user} roles={roles} />
            </motion.div>

            {/* Reset password */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="bg-card border border-border rounded-3xl p-6 card-glow"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-foreground/8 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Redefinir senha
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Define uma nova senha provisória para o usuário
                  </p>
                </div>
              </div>
              <ResetPasswordForm userId={user.id} />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-5">
        <div className="max-w-4xl mx-auto px-6 flex justify-center">
          <span className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Samba Innovations
          </span>
        </div>
      </footer>
    </div>
  );
}
