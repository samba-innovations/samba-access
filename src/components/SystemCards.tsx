"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ClipboardList, BarChart3, Sprout, FileText } from "lucide-react";
import Image from "next/image";

const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  code: <ClipboardList className="w-4 h-4" strokeWidth={1.5} />,
  edvance: <BarChart3 className="w-4 h-4" strokeWidth={1.5} />,
  flourish: <Sprout className="w-4 h-4" strokeWidth={1.5} />,
  paper: <FileText className="w-4 h-4" strokeWidth={1.5} />,
};

interface System {
  key: string;
  name: string;
  description: string;
  url: string;
  gradient: string;
  accent: string;
  logo: string;
  logoAspect: "square" | "wide";
  badge: string;
  token: string;
}

export function SystemCards({ systems }: { systems: System[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {systems.map((sys, i) => {
        const href = `${sys.url}/auth/sso?token=${sys.token}`;
        const Icon = SYSTEM_ICONS[sys.key];

        return (
          <motion.a
            key={sys.key}
            href={href}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.09, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.18 } }}
            className="group relative bg-card rounded-3xl overflow-hidden flex flex-col cursor-pointer card-glow hover:card-glow-hover transition-all duration-200 border border-border/60"
          >
            {/* ── Header area with gradient ── */}
            <div
              className="relative h-[120px] flex items-center justify-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${sys.accent}18, ${sys.accent}08)` }}
            >
              {/* Decorative glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 50% 50%, ${sys.accent}20, transparent 70%)` }}
              />

              {/* Gradient top border */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, ${sys.accent}, ${sys.accent}88)` }}
              />

              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <Image
                  src={sys.logo}
                  alt={sys.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain drop-shadow-sm"
                />
              </motion.div>

              {/* Arrow icon top-right */}
              <div
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0"
                style={{ backgroundColor: `${sys.accent}20` }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" style={{ color: sys.accent }} />
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-col flex-1 p-5 gap-3">
              {/* Name + badge */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-foreground text-[15px] leading-tight">{sys.name}</h3>
                <span
                  className="shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full mt-0.5"
                  style={{ backgroundColor: `${sys.accent}15`, color: sys.accent }}
                >
                  {Icon}
                  {sys.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-xs leading-relaxed flex-1">
                {sys.description}
              </p>

              {/* CTA */}
              <div
                className="mt-1 w-full h-10 rounded-xl flex items-center justify-center gap-2 text-[12px] font-semibold transition-all duration-200 border"
                style={{
                  backgroundColor: `${sys.accent}10`,
                  borderColor: `${sys.accent}25`,
                  color: sys.accent,
                }}
              >
                Acessar sistema
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}
