"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { login } from "@/lib/actions";

const PRODUCTS = [
  { id: "code",     label: "samba code",    logo: "/imgs/code-logo2.svg" },
  { id: "edvance",  label: "samba edvance", logo: "/imgs/edvance-logo2.svg" },
  { id: "flourish", label: "samba flourish",logo: "/imgs/flourish-logo2.svg" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      whileHover={!pending ? { scale: 1.015 } : {}}
      whileTap={!pending ? { scale: 0.985 } : {}}
      disabled={pending}
      type="submit"
      className="w-full h-[52px] bg-[#0053d4] text-white rounded-xl font-semibold transition-colors hover:bg-[#0047b8] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
    >
      {pending ? (
        <><Loader2 className="w-4 h-4 animate-spin" />Autenticando…</>
      ) : (
        <>Entrar<ArrowRight className="w-4 h-4" /></>
      )}
    </motion.button>
  );
}

export default function LoginPage() {
  const [state, action] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-[#07090f] flex relative overflow-hidden">

      {/* ── Mesh gradient (full bleed) ────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-48 -left-32 w-[680px] h-[680px] bg-[#0053d4]/14 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-[10%] w-[580px] h-[580px] bg-[#002fa0]/18 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[40%] w-[340px] h-[340px] bg-[#0060ff]/7 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          LEFT PANEL — brand + ecosystem
      ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative z-10 border-r border-white/[0.05] px-12 py-16">
        <div className="flex flex-col items-center text-center max-w-[420px]">

          {/* Icon with blue glow */}
          <div className="relative inline-flex mb-10">
            <div className="absolute inset-0 scale-[1.4] bg-[#0053d4]/28 rounded-3xl blur-2xl" />
            <Image
              src="/imgs/invtns-logo1.png"
              alt="Samba Innovations"
              width={88}
              height={88}
              className="relative rounded-[22px]"
              priority
            />
          </div>

          {/* Headline */}
          <h1 className="text-[62px] font-black text-white leading-[0.96] tracking-tight mb-6">
            Acesso<br />
            <span className="text-[#4d9fff]">Unificado.</span>
          </h1>

          {/* Tagline */}
          <p className="text-white/35 text-[15px] leading-relaxed mb-12">
            Portal de entrada único para todos os sistemas educacionais da Escola Cabral.
          </p>

          {/* Product chips — 25% maiores, centralizados */}
          <div className="flex flex-wrap gap-3 justify-center">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-[10px] px-[18px] py-[10px] rounded-2xl bg-white/[0.06] border border-white/[0.09]"
              >
                <Image
                  src={p.logo}
                  alt={p.label}
                  width={22}
                  height={22}
                  className="shrink-0"
                />
                <span className="text-white/50 text-[12.5px] font-medium tracking-wide">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT PANEL — logotype + login card + footer
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-between relative z-10 px-10 py-14">

        {/* Spacer top */}
        <div />

        {/* Center block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[440px] flex flex-col items-center"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/imgs/invtns-logo1.png" alt="in." width={36} height={36} className="rounded-xl" />
            <Image src="/imgs/innvtns-logotipo2.svg" alt="Samba Innovations" width={150} height={24} className="h-5 w-auto" />
          </div>

          {/* Logotype — título de marca acima do card */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <Image
              src="/imgs/innvtns-logotipo2.svg"
              alt="Samba Innovations"
              width={280}
              height={44}
              className="h-10 w-auto"
            />
            <div className="h-px w-16 bg-white/[0.12]" />
          </div>

          {/* Glass card — 10% maior */}
          <div className="w-full bg-white/[0.04] border border-white/[0.08] rounded-3xl p-9 backdrop-blur-2xl">

            <div className="mb-7">
              <h2 className="text-[22px] font-bold text-white tracking-tight text-center">
                Bem-vindo de volta
              </h2>
              <p className="text-white/40 text-sm mt-1.5 text-center">
                Entre com suas credenciais institucionais
              </p>
            </div>

            <form action={action} className="space-y-5">
              {state?.error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm"
                >
                  {state.error}
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold text-white/40 mb-2 uppercase tracking-widest"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="seu@escolacabral.com.br"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-[#0053d4] focus:ring-2 focus:ring-[#0053d4]/20 outline-none transition-all placeholder:text-white/20 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-semibold text-white/40 mb-2 uppercase tracking-widest"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-[#0053d4] focus:ring-2 focus:ring-[#0053d4]/20 outline-none transition-all placeholder:text-white/20 text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-1">
                <SubmitButton />
              </div>
            </form>
          </div>
        </motion.div>

        {/* Footer institucional */}
        <footer className="w-full max-w-[440px] mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-white/20">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="text-[11px] tracking-wide">Conexão criptografada e protegida</span>
          </div>
          <div className="h-px w-full bg-white/[0.06]" />
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-white/20 text-center">
            <span>Escola Cabral</span>
            <span className="text-white/10">·</span>
            <span>Sistema de Gestão Educacional</span>
            <span className="text-white/10">·</span>
            <span>Powered by Samba Innovations</span>
            <span className="text-white/10">·</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
