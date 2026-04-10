"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/actions";
import type { SessionUser } from "@/lib/auth";

interface Props {
  session: SessionUser;
  adminUrl?: string;
  adminToken?: string | null;
}

function Avatar({ session, size = "md" }: { session: SessionUser; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm", lg: "w-14 h-14 text-xl" };
  const cls = sizes[size];

  if (session.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={session.avatarUrl}
        alt={session.name}
        className={`${cls} rounded-full object-cover ring-2 ring-primary/20`}
      />
    );
  }

  return (
    <div className={`${cls} rounded-full bg-primary flex items-center justify-center text-white font-bold ring-2 ring-primary/20`}>
      {session.name[0].toUpperCase()}
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TEACHER: "Professor",
  COORDINATOR: "Coordenador",
  COORDINATOR_TEACHER: "Coord. Professor",
  PRINCIPAL: "Diretor",
  VICE_PRINCIPAL: "Vice-Diretor",
  SECRETARY: "Secretário",
};

export function NavUserMenu({ session, adminUrl, adminToken }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-xl hover:bg-muted/60 transition-colors group"
      >
        <Avatar session={session} size="sm" />
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-[13px] font-semibold text-foreground max-w-[140px] truncate">
            {session.name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {ROLE_LABELS[session.role] ?? session.role}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] w-[260px] bg-card border border-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="p-4 border-b border-border/60 flex items-center gap-3">
              <Avatar session={session} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{session.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{session.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3 text-primary/60" strokeWidth={1.5} />
                  <span className="text-[10px] text-primary/80 font-semibold">
                    {ROLE_LABELS[session.role] ?? session.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio if present */}
            {session.bio && (
              <div className="px-4 py-2.5 border-b border-border/60">
                <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-2">
                  "{session.bio}"
                </p>
              </div>
            )}

            {/* Menu items */}
            <div className="p-2">
              <Link
                href="/perfil"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                Meu perfil
              </Link>

              {session.isAdmin && adminUrl && (
                <a
                  href={`${adminUrl}/auth/sso?token=${adminToken}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  Painel admin
                </a>
              )}
            </div>

            {/* Logout */}
            <div className="p-2 pt-0 border-t border-border/60 mt-1">
              <form action={logout} className="w-full">
                <button
                  type="submit"
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <LogOut className="w-3.5 h-3.5 text-destructive" />
                  </div>
                  Sair da conta
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Avatar };
