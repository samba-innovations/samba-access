"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Check, Loader2, Lock, Save, User, X } from "lucide-react";
import Link from "next/link";
import { updateProfile, updateAvatar, updatePassword } from "@/lib/actions";
import { NavLogo } from "@/components/NavLogo";
import type { SessionUser } from "@/lib/auth";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TEACHER: "Professor",
  COORDINATOR: "Coordenador",
  PRINCIPAL: "Diretor",
  VICE_PRINCIPAL: "Vice-Diretor",
  SECRETARY: "Secretário",
};

interface Props {
  session: SessionUser;
}

// ─── Avatar ────────────────────────────────────────────────────────────────
function AvatarUpload({ session }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarState, avatarAction] = useActionState(updateAvatar, null);
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        setPreview(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const currentAvatar = preview ?? session.avatarUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative group cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {currentAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentAvatar}
            alt={session.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold ring-4 ring-primary/20">
            {session.name[0].toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" strokeWidth={1.5} />
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <p className="text-[11px] text-muted-foreground text-center leading-tight">
        Clique ou arraste · JPG, PNG, WEBP · redimensionado automaticamente
      </p>

      {preview && (
        <form action={avatarAction} className="flex gap-2">
          <input type="hidden" name="avatarUrl" value={preview} />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted/60 transition-colors border border-border"
          >
            <X className="w-3 h-3" /> Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-[#0047b8] transition-colors"
          >
            <Check className="w-3 h-3" /> Salvar
          </button>
        </form>
      )}

      {avatarState?.success && (
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <Check className="w-3 h-3" /> {avatarState.success}
        </p>
      )}
      {avatarState?.error && (
        <p className="text-[11px] text-destructive font-semibold">{avatarState.error}</p>
      )}
    </div>
  );
}

// ─── Profile form ──────────────────────────────────────────────────────────
function ProfileForm({ session }: Props) {
  const [state, action, pending] = useActionState(updateProfile, null);

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Nome completo
        </label>
        <input
          name="name"
          defaultValue={session.name}
          required
          className="w-full h-9 px-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          E-mail
        </label>
        <input
          value={session.email}
          disabled
          className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border text-sm text-muted-foreground cursor-not-allowed"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Cargo
        </label>
        <input
          value={ROLE_LABELS[session.role] ?? session.role}
          disabled
          className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border text-sm text-muted-foreground cursor-not-allowed"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Bio <span className="normal-case text-muted-foreground/60">(opcional)</span>
        </label>
        <textarea
          name="bio"
          defaultValue={session.bio ?? ""}
          rows={2}
          maxLength={200}
          placeholder="Conte um pouco sobre você…"
          className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground resize-none placeholder:text-muted-foreground/40"
        />
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
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#0047b8] transition-colors disabled:opacity-60 shadow-md shadow-primary/20"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Salvar alterações
      </button>
    </form>
  );
}

// ─── Password form ─────────────────────────────────────────────────────────
function PasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, null);

  return (
    <form action={action} className="space-y-3">
      {[
        { name: "current", label: "Senha atual" },
        { name: "next", label: "Nova senha" },
        { name: "confirm", label: "Confirmar nova senha" },
      ].map((field) => (
        <div key={field.name} className="space-y-1">
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {field.label}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
            <input
              name={field.name}
              type="password"
              required
              placeholder="••••••••"
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
      ))}

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
        className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 shadow-md"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        Alterar senha
      </button>
    </form>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export function ProfileClient({ session }: Props) {
  const [tab, setTab] = useState<"info" | "senha">("info");

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 dot-grid opacity-40 dark:opacity-20 z-0" />
      <div className="pointer-events-none fixed -top-[10%] -left-[5%] w-[50%] h-[50%] bg-primary/8 rounded-[50%] blur-[140px] z-0" />

      {/* Navbar */}
      <header className="relative z-50 border-b border-border/50 bg-card/50 backdrop-blur-xl flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 h-[60px] flex items-center justify-between">
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

      {/* Content */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-6 flex flex-col gap-5 min-h-0">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Meu perfil</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Gerencie suas informações pessoais e segurança.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">

          {/* Esquerda: avatar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-card border border-border rounded-3xl p-5 card-glow flex flex-col items-center gap-1 text-center"
          >
            <AvatarUpload session={session} />

            <div className="mt-3 w-full border-t border-border/60 pt-3 space-y-0.5">
              <p className="font-bold text-foreground text-sm">{session.name}</p>
              <p className="text-xs text-muted-foreground">{session.email}</p>
              <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                {ROLE_LABELS[session.role] ?? session.role}
              </div>
              {session.bio && (
                <p className="text-[11px] text-muted-foreground/70 italic pt-1 line-clamp-2">
                  &ldquo;{session.bio}&rdquo;
                </p>
              )}
            </div>
          </motion.div>

          {/* Direita: abas */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="lg:col-span-2 bg-card border border-border rounded-3xl card-glow flex flex-col min-h-0"
          >
            {/* Tab bar */}
            <div className="flex border-b border-border/60 px-5 pt-4 gap-1 flex-shrink-0">
              <button
                onClick={() => setTab("info")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-semibold transition-colors ${
                  tab === "info"
                    ? "text-primary border-b-2 border-primary -mb-px"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Informações
              </button>
              <button
                onClick={() => setTab("senha")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-semibold transition-colors ${
                  tab === "senha"
                    ? "text-primary border-b-2 border-primary -mb-px"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Segurança
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                {tab === "info" ? (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ProfileForm session={session} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="senha"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <PasswordForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
