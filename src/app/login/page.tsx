"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, ShieldCheck, Fingerprint, Globe } from "lucide-react";
import Image from "next/image";
import { login } from "@/lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      whileHover={!pending ? { scale: 1.015 } : {}}
      whileTap={!pending ? { scale: 0.985 } : {}}
      disabled={pending}
      type="submit"
      className="w-full h-[52px] bg-primary text-white rounded-2xl font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-[#0047b8] mt-1 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed text-[13px] tracking-wide"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Autenticando…
        </>
      ) : (
        <>
          <Lock className="w-3.5 h-3.5" />
          Entrar com segurança
        </>
      )}
    </motion.button>
  );
}

export default function LoginPage() {
  const [state, action] = useActionState(login, null);

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left brand panel ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[54%] relative overflow-hidden flex-col">
        {/* Deep gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a5c] via-[#0040b8] to-[#0053d4]" />

        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-30" />

        {/* Glow orbs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#4d9fff]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#0028a0]/60 rounded-full blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 py-12">
          {/* Logo */}
          <Image
            src="/imgs/innvtns-logotipo2.svg"
            alt="Samba Innovations"
            width={280}
            height={44}
            className="h-10 w-auto"
            priority
          />

          {/* Center text */}
          <div className="flex-1 flex flex-col justify-center gap-6 max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                Acesso<br />Unificado
              </h1>
              <p className="text-white/60 mt-3 text-sm leading-relaxed">
                Portal de entrada único para todos os sistemas educacionais da Escola Cabral.
              </p>
            </div>

            {/* Feature list */}
            <div className="flex flex-col gap-3 mt-2">
              {[
                { icon: ShieldCheck, text: "Autenticação segura com JWT" },
                { icon: Fingerprint, text: "SSO entre todos os sistemas" },
                { icon: Globe, text: "Acesso centralizado e rastreável" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-white/80" strokeWidth={1.5} />
                  </div>
                  <span className="text-white/70 text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 dot-grid opacity-40 dark:opacity-20" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/8 dark:bg-primary/12 rounded-full blur-[140px]" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Mobile logo */}
          <div className="lg:hidden px-8 pt-8 pb-4">
            <Image
              src="/imgs/innvtns-logotipo.svg"
              alt="Samba Innovations"
              width={120}
              height={20}
              className="h-5 w-auto dark:hidden"
            />
            <Image
              src="/imgs/innvtns-logotipo2.svg"
              alt="Samba Innovations"
              width={120}
              height={20}
              className="h-5 w-auto hidden dark:block"
            />
          </div>

          {/* Form centered */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-[400px]"
            >
              {/* Header */}
              <div className="mb-9">
                <h2 className="text-[26px] font-extrabold text-foreground tracking-tight">Bem-vindo de volta</h2>
                <p className="text-muted-foreground text-sm mt-1.5">
                  Entre com suas credenciais institucionais.
                </p>
              </div>

              {/* Form */}
              <form action={action} className="space-y-4">
                {state?.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 bg-red-500/8 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium"
                  >
                    {state.error}
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider px-0.5">
                    E-mail institucional
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="seu@escolacabral.com.br"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all placeholder:text-muted-foreground/40 text-foreground text-sm card-glow"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider px-0.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all placeholder:text-muted-foreground/40 text-foreground text-sm card-glow"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <SubmitButton />
                </div>
              </form>

              {/* Divider + security note */}
              <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary/50" strokeWidth={1.5} />
                <span>Conexão protegida · Samba Innovations</span>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="relative z-10 pb-6 flex justify-center">
            <Image
              src="/imgs/innvtns-logotipo.svg"
              alt="Samba Innovations"
              width={100}
              height={16}
              className="h-4 w-auto opacity-20 dark:hidden"
            />
            <Image
              src="/imgs/innvtns-logotipo2.svg"
              alt="Samba Innovations"
              width={100}
              height={16}
              className="h-4 w-auto opacity-15 hidden dark:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
