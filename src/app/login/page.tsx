"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, ArrowRight } from "lucide-react";
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
      className="w-full h-[52px] bg-[#0053d4] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#0053d4]/20 hover:bg-[#0047b8] hover:shadow-[#0053d4]/35 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm tracking-wide"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Autenticando…
        </>
      ) : (
        <>
          Entrar
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </motion.button>
  );
}

export default function LoginPage() {
  const [state, action] = useActionState(login, null);

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col bg-[#0053d4]">
        {/* Subtle depth gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0060f0] via-[#0053d4] to-[#003ba0]" />

        {/* Diagonal line pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              white 0px,
              white 1px,
              transparent 1px,
              transparent 36px
            )`,
          }}
        />

        {/* Bottom-right glow */}
        <div className="absolute -bottom-24 -right-24 w-[360px] h-[360px] bg-white/5 rounded-full blur-[80px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 py-11">
          {/* Top: Logotype */}
          <Image
            src="/imgs/innvtns-logotipo2.svg"
            alt="Samba Innovations"
            width={220}
            height={34}
            className="h-8 w-auto"
            priority
          />

          {/* Center: Icon mark + headline */}
          <div className="flex-1 flex flex-col justify-center">
            {/* in. icon mark */}
            <div className="mb-9">
              <Image
                src="/imgs/invtns-logo1.png"
                alt="Samba Innovations"
                width={88}
                height={88}
                className="rounded-2xl"
              />
            </div>

            <h1 className="text-[46px] font-black text-white leading-[1.05] tracking-tight">
              Acesso<br />Unificado
            </h1>

            <p className="text-white/50 mt-5 text-[15px] leading-relaxed max-w-[280px]">
              Portal de entrada único para todos os sistemas da Escola Cabral.
            </p>
          </div>

          {/* Bottom label */}
          <span className="text-white/25 text-[11px] font-semibold tracking-widest uppercase">
            Escola Cabral
          </span>
        </div>
      </div>

      {/* ── Right form panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#07090f]">
        {/* Mobile logo */}
        <div className="lg:hidden px-8 pt-8 flex items-center gap-3">
          <Image
            src="/imgs/invtns-logo1.png"
            alt="Samba Innovations"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <Image
            src="/imgs/invtns-logotipo.png"
            alt="Samba Innovations"
            width={160}
            height={24}
            className="h-5 w-auto dark:hidden"
          />
          <Image
            src="/imgs/innvtns-logotipo2.svg"
            alt="Samba Innovations"
            width={160}
            height={24}
            className="h-5 w-auto hidden dark:block"
          />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-[380px]"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-[26px] font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                Bem-vindo de volta
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
                Entre com suas credenciais institucionais
              </p>
            </div>

            {/* Form */}
            <form action={action} className="space-y-5">
              {state?.error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-400 rounded-lg text-sm"
                >
                  {state.error}
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  E-mail institucional
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="seu@escolacabral.com.br"
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#0053d4] focus:ring-2 focus:ring-[#0053d4]/10 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#0053d4] focus:ring-2 focus:ring-[#0053d4]/10 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-1">
                <SubmitButton />
              </div>
            </form>

            {/* Bottom note */}
            <p className="mt-10 text-center text-xs text-gray-300 dark:text-gray-700">
              Conexão protegida · Samba Innovations
            </p>
          </motion.div>
        </div>

        {/* Footer logo */}
        <div className="pb-7 flex justify-center">
          <Image
            src="/imgs/invtns-logotipo.png"
            alt="Samba Innovations"
            width={110}
            height={16}
            className="h-4 w-auto opacity-20 dark:hidden"
          />
          <Image
            src="/imgs/innvtns-logotipo2.svg"
            alt="Samba Innovations"
            width={110}
            height={16}
            className="h-4 w-auto opacity-10 hidden dark:block"
          />
        </div>
      </div>
    </div>
  );
}
