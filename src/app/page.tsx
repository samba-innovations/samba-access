import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createSsoToken, getAvatarUrl } from "@/lib/actions";
import { SystemCards } from "@/components/SystemCards";
import { ShieldCheck } from "lucide-react";
import { NavLogo } from "@/components/NavLogo";
import { NavUserMenu } from "@/components/NavUserMenu";
import Image from "next/image";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const SYSTEMS = [
    {
      key: "code",
      name: "samba code",
      description: "Registro e gestão de ocorrências escolares com histórico completo por aluno.",
      url: process.env.URL_CODE!,
      gradient: "from-[#5e2c9c] to-[#ffc845]",
      accent: "#5e2c9c",
      logo: "/imgs/code-logo2.svg",
      logoAspect: "square" as const,
      badge: "Ocorrências",
    },
    {
      key: "edvance",
      name: "samba edvance",
      description: "Registro e gestão de simulados padronizados.",
      url: process.env.URL_EDVANCE!,
      gradient: "from-[#00577a] to-[#f57c00]",
      accent: "#00577a",
      logo: "/imgs/edvance-logo2.svg",
      logoAspect: "square" as const,
      badge: "Simulados",
    },
    {
      key: "flourish",
      name: "samba flourish",
      description: "Gerenciamento de hortas IoT com monitoramento em tempo real e histórico de dados ambientais.",
      url: process.env.URL_FLOURISH!,
      gradient: "from-[#95c11f] to-[#c5e84a]",
      accent: "#95c11f",
      logo: "/imgs/flourish-logo2.svg",
      logoAspect: "square" as const,
      badge: "Hortas IoT",
    },
  ];

  // Filtra sistemas que o usuário tem acesso e gera tokens SSO
  const accessibleSystems = SYSTEMS.filter(s => session.projects?.includes(s.key) ?? s.key !== "flourish");

  const adminUrl = process.env.URL_ADMIN ?? null;

  const [systemsWithTokens, avatarUrl, adminToken] = await Promise.all([
    Promise.all(
      accessibleSystems.map(async (sys) => {
        const token = await createSsoToken(session.id, sys.key);
        return { ...sys, token: token ?? "" };
      })
    ),
    getAvatarUrl(session.id),
    session.isAdmin && adminUrl ? createSsoToken(session.id, "admin") : Promise.resolve(null),
  ]);

  const firstName = session.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Boa madrugada" : hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 dot-grid opacity-50 dark:opacity-30 z-0" />
      <div className="pointer-events-none fixed -top-[10%] -left-[5%] w-[50%] h-[60%] bg-primary/10 dark:bg-primary/8 rounded-[50%] blur-[140px] z-0" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-5%] w-[45%] h-[55%] bg-primary/8 dark:bg-primary/6 rounded-[50%] blur-[130px] z-0" />

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="relative z-50 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <NavLogo />

          <NavUserMenu
            session={{ ...session, avatarUrl }}
            adminUrl={adminUrl ?? undefined}
            adminToken={adminToken}
          />
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 py-12 flex flex-col gap-12">

        {/* Welcome hero */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-[13px] font-semibold text-primary/80 uppercase tracking-widest mb-2">
              {greeting}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-none">
              {firstName}<span className="text-primary">.</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-sm max-w-sm leading-relaxed">
              Selecione o sistema que deseja acessar. O login será feito automaticamente.
            </p>
          </div>

          {/* Session info pill */}
          <div className="flex items-center gap-2.5 bg-card border border-border rounded-2xl px-4 py-3 card-glow self-start sm:self-auto shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold text-foreground">Sessão ativa</span>
              <span className="text-[10px] text-muted-foreground">Expira em 8 horas</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-primary/60 ml-1" strokeWidth={1.5} />
          </div>
        </div>

        {/* Systems */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Sistemas disponíveis
          </p>
          <SystemCards systems={systemsWithTokens} />
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-border/40 py-5">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} samba innovations · Todos os direitos reservados
          </span>
          <Image
            src="/imgs/innvtns-logotipo.svg"
            alt="Samba Innovations"
            width={90}
            height={14}
            className="h-3.5 w-auto opacity-20 dark:hidden"
          />
          <Image
            src="/imgs/innvtns-logotipo2.svg"
            alt="Samba Innovations"
            width={90}
            height={14}
            className="h-3.5 w-auto opacity-15 hidden dark:block"
          />
        </div>
      </footer>
    </div>
  );
}
