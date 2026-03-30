"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import { login } from "@/lib/actions";

const PRODUCTS = [
  { id: "code",    label: "samba code",    logo: "/imgs/code-logo2.svg" },
  { id: "edvance", label: "samba edvance", logo: "/imgs/edvance-logo2.svg" },
  { id: "flourish",label: "samba flourish",logo: "/imgs/flourish-logo2.svg" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      whileHover={!pending ? { scale: 1.015 } : {}}
      whileTap={!pending ? { scale: 0.985 } : {}}
      disabled={pending}
      type="submit"
      className="w-full h-12 bg-[#0053d4] text-white rounded-xl font-semibold transition-colors hover:bg-[#0047b8] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
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

      {/* ── Mesh gradient ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] bg-[#0053d4]/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 right-[5%] w-[600px] h-[600px] bg-[#002fa0]/20 rounded-full blur-[120px]" />
        <div className="absolute top-[35%] -right-24 w-[380px] h-[380px] bg-[#0060ff]/8 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Left panel ────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative z-10 px-16 py-14">

        {/* Logo */}
        <Image
          src="/imgs/innvtns-logotipo2.svg"
          alt="Samba Innovations"
          width={200}
          height={32}
          className="h-7 w-auto"
          priority
        />

        {/* Center */}
        <div>
          {/* Icon with blue glow */}
          <div className="relative inline-flex mb-10">
            <div className="absolute inset-0 scale-125 bg-[#0053d4]/30 rounded-3xl blur-2xl" />
            <Image
              src="/imgs/invtns-logo1.png"
              alt="Samba Innovations"
              width={84}
              height={84}
              className="relative rounded-[20px]"
            />
          </div>

          <h1 className="text-[60px] font-black text-white leading-[0.97] tracking-tight mb-5">
            Acesso<br />
            <span className="text-[#4d9fff]">Unificado.</span>
          </h1>

          <p className="text-white/35 text-[15px] leading-relaxed max-w-[300px] mb-12">
            Portal de entrada único para todos os sistemas educacionais da Escola Cabral.
          </p>

          {/* Product chips */}
          <div className="flex flex-wrap gap-2.5">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]"
              >
                <Image
                  src={p.logo}
                  alt={p.label}
                  width={18}
                  height={18}
                  className="shrink-0"
                />
                <span className="text-white/45 text-[11px] font-medium tracking-wide">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/15 text-xs tracking-wide">
          Escola Cabral · {new Date().getFullYear()}
        </p>
      </div>

      {/* ── Right: form ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image
              src="/imgs/invtns-logo1.png"
              alt="in."
              width={36}
              height={36}
              className="rounded-xl"
            />
            <Image
              src="/imgs/innvtns-logotipo2.svg"
              alt="Samba Innovations"
              width={150}
              height={24}
              className="h-5 w-auto"
            />
          </div>

          {/* Glass card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-2xl">

            <div className="mb-7">
              <h2 className="text-[22px] font-bold text-white tracking-tight">
                Bem-vindo de volta
              </h2>
              <p className="text-white/40 text-sm mt-1">
                Entre com suas credenciais institucionais
              </p>
            </div>

            <form action={action} className="space-y-4">
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
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-[#0053d4] focus:ring-2 focus:ring-[#0053d4]/20 outline-none transition-all placeholder:text-white/20 text-white text-sm"
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
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.06] border border-white/[0.1] focus:border-[#0053d4] focus:ring-2 focus:ring-[#0053d4]/20 outline-none transition-all placeholder:text-white/20 text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-1">
                <SubmitButton />
              </div>
            </form>
          </div>

          <p className="mt-5 text-center text-[11px] text-white/15">
            Conexão protegida · Samba Innovations
          </p>
        </motion.div>
      </div>
    </div>
  );
}
