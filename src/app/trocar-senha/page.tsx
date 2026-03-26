"use client";

import { useActionState } from "react";
import { forceChangePassword } from "@/lib/actions";
import { KeyRound, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function TrocarSenhaPage() {
  const [state, action, pending] = useActionState(forceChangePassword, null);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="pointer-events-none fixed -top-[10%] -left-[5%] w-[50%] h-[60%] bg-primary/10 dark:bg-primary/8 rounded-[50%] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-5%] w-[45%] h-[55%] bg-primary/8 dark:bg-primary/6 rounded-[50%] blur-[130px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/imgs/innvtns-logotipo.svg"
            alt="samba innovations"
            width={120}
            height={20}
            className="h-5 w-auto opacity-60 dark:hidden"
          />
          <Image
            src="/imgs/innvtns-logotipo2.svg"
            alt="samba innovations"
            width={120}
            height={20}
            className="h-5 w-auto opacity-40 hidden dark:block"
          />
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {/* Header */}
          <div className="flex items-start gap-4 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">Defina sua senha</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Por segurança, você precisa criar uma nova senha antes de continuar.
              </p>
            </div>
          </div>

          <form action={action} className="flex flex-col gap-4">
            {/* Nova senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Nova senha
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showNext ? "text" : "password"}
                  name="next"
                  placeholder="Mínimo 8 caracteres"
                  required
                  className="w-full bg-muted/40 border border-border rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNext(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Confirmar senha
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm"
                  placeholder="Repita a nova senha"
                  required
                  className="w-full bg-muted/40 border border-border rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Feedback */}
            {state && "error" in state && (
              <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
                {state.error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full bg-primary text-white font-bold py-3 rounded-xl text-sm hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/20"
            >
              {pending ? "Salvando..." : "Salvar e continuar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
