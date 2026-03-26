"use client";

import { useState, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Pencil,
  X,
  Loader2,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavLogo } from "@/components/NavLogo";
import { adminCreateUser } from "@/lib/actions";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TEACHER: "Professor",
  COORDINATOR: "Coordenador",
  PRINCIPAL: "Diretor",
  VICE_PRINCIPAL: "Vice-Diretor",
  SECRETARY: "Secretário",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-primary/10 text-primary",
  TEACHER: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  COORDINATOR: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  PRINCIPAL: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
  VICE_PRINCIPAL: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
  SECRETARY: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

interface UserRow {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  must_change_password: boolean;
  avatar_url: string | null;
  created_at: Date;
  role_name: string | null;
}

interface Role {
  id: number;
  name: string;
}

interface Props {
  users: UserRow[];
  roles: Role[];
}

function UserAvatar({ user, size = "md" }: { user: UserRow; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  if (user.avatar_url) {
    return (
      <Image
        src={user.avatar_url}
        alt={user.name}
        width={40}
        height={40}
        className={`${cls} rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${cls} rounded-full bg-primary flex items-center justify-center text-white font-bold ring-2 ring-primary/20 flex-shrink-0`}
    >
      {user.name[0].toUpperCase()}
    </div>
  );
}

function NewUserModal({
  roles,
  onClose,
}: {
  roles: Role[];
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(adminCreateUser, null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-foreground">Novo usuário</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-muted/60 flex items-center justify-center text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nome completo
            </label>
            <input
              name="name"
              required
              placeholder="Ex: João Silva"
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="joao@escola.com"
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cargo
            </label>
            <select
              name="roleId"
              required
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground"
            >
              <option value="">Selecione…</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {ROLE_LABELS[r.name] ?? r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Senha provisória
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Mínimo 8 caracteres"
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/40"
            />
            <p className="text-[11px] text-muted-foreground">
              O usuário será obrigado a alterar a senha no primeiro acesso.
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

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-[#0047b8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Criar usuário
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function UsersClient({ users, roles }: Props) {
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col">
      <div className="pointer-events-none fixed inset-0 dot-grid opacity-40 dark:opacity-20 z-0" />
      <div className="pointer-events-none fixed -top-[10%] -left-[5%] w-[50%] h-[50%] bg-primary/8 rounded-[50%] blur-[140px] z-0" />

      {/* Navbar */}
      <header className="relative z-50 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <NavLogo />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Usuários
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {users.length} usuário{users.length !== 1 ? "s" : ""} cadastrado
              {users.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#0047b8] transition-colors shadow-md shadow-primary/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Novo usuário
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail…"
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-3xl overflow-hidden card-glow"
        >
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_48px] gap-4 px-5 py-3 border-b border-border/60 bg-muted/20">
            {["Usuário", "E-mail", "Cargo", "Status", ""].map((h) => (
              <span
                key={h}
                className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
              >
                {h}
              </span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {filtered.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_48px] gap-3 md:gap-4 px-5 py-4 hover:bg-muted/20 transition-colors items-center"
                >
                  {/* Name + avatar */}
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </p>
                      {user.must_change_password && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          Deve alterar senha
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <p className="text-sm text-muted-foreground truncate hidden md:block">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground md:hidden">
                    {user.email}
                  </p>

                  {/* Role */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ROLE_COLORS[user.role_name ?? ""] ??
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.role_name === "ADMIN" && (
                        <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                      )}
                      {ROLE_LABELS[user.role_name ?? ""] ?? user.role_name ?? "—"}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <UserCheck className="w-3.5 h-3.5" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                        <UserX className="w-3.5 h-3.5" />
                        Inativo
                      </span>
                    )}
                  </div>

                  {/* Edit */}
                  <div className="flex justify-end">
                    <Link
                      href={`/usuarios/${user.id}`}
                      className="w-8 h-8 rounded-xl bg-muted/40 hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-5">
        <div className="max-w-6xl mx-auto px-6 flex justify-center">
          <span className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Samba Innovations
          </span>
        </div>
      </footer>

      {/* New user modal */}
      <AnimatePresence>
        {showNew && (
          <NewUserModal roles={roles} onClose={() => setShowNew(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
