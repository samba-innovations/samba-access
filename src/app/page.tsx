import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createSsoToken, getAvatarUrl } from "@/lib/actions";

export const metadata: Metadata = { title: { absolute: "samba access" } };
import { SystemCards } from "@/components/SystemCards";
import { ShieldCheck, Sprout, Lock } from "lucide-react";
import { NavLogo } from "@/components/NavLogo";
import { NavUserMenu } from "@/components/NavUserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export const dynamic = "force-dynamic";

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
    {
      key: "paper",
      name: "samba paper",
      description: "Gerador de documentos pedagógicos: planos de aula, guias, PEI, eletivas, EMA, projetos e PDI.",
      url: process.env.URL_PAPER!,
      gradient: "from-[#FCE31D] to-[#b64c96]",
      accent: "#b64c96",
      logo: "/imgs/paper-logo2.svg",
      logoAspect: "square" as const,
      badge: "Documentos",
    },
    {
      key: "pombo",
      name: "pombo news",
      description: "Jornal estudantil da Escola Christino Cabral. Publique matérias, gerencie editorias e acompanhe o jornal.",
      url: process.env.URL_POMBO!,
      gradient: "from-[#1a1209] to-[#c0392b]",
      accent: "#c0392b",
      logo: "/imgs/pombo-logo1.svg",
      logoAspect: "square" as const,
      logoDarkInvert: true,
      badge: "Jornal",
    },
    {
      key: "control",
      name: "samba control",
      description: "Gestão centralizada do banco mestre: professores, alunos, turmas e disciplinas.",
      url: process.env.URL_CONTROL!,
      gradient: "from-[#4b0000] to-[#e30613]",
      accent: "#e30613",
      logo: "/imgs/control-logotipo2.svg",
      logoAspect: "square" as const,
      badge: "Gestão Escolar",
    },
  ];

  // Filtra sistemas que o usuário tem acesso e gera tokens SSO
  // control: apenas admins ou com acesso explícito
  const accessibleSystems = SYSTEMS.filter(s => {
    if (s.key === "control") return session.isAdmin || session.projects?.includes("control");
    return session.projects?.includes(s.key) ?? !["flourish"].includes(s.key);
  });

  const adminUrl = process.env.URL_ADMIN ?? null;

  let systemsWithTokens: Array<(typeof accessibleSystems)[number] & { token: string }> = [];
  let avatarUrl: string | null = null;
  let adminToken: string | null = null;

  try {
    [systemsWithTokens, avatarUrl, adminToken] = await Promise.all([
      Promise.all(
        accessibleSystems.map(async (sys) => {
          const token = await createSsoToken(session.id, sys.key);
          return { ...sys, token: token ?? "" };
        })
      ),
      getAvatarUrl(session.id),
      session.isAdmin && adminUrl ? createSsoToken(session.id, "admin") : Promise.resolve(null),
    ]);
  } catch {
    // JWT com user_id que não existe mais no banco — delega limpeza de cookie ao route handler
    redirect("/api/clear-session");
  }

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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavUserMenu
            session={{ ...session, avatarUrl }}
            adminUrl={adminUrl ?? undefined}
            adminToken={adminToken}
            />
          </div>
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

          {/* Coming soon — só mostra se o usuário ainda não tem acesso ao flourish */}
          {!session.projects?.includes("flourish") && (
          <div className="mt-8">
            <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-4">Em breve</p>
            <div className="relative bg-card rounded-3xl border border-dashed border-border/60 overflow-hidden flex flex-col sm:flex-row items-center gap-5 p-6 opacity-70">
              <div className="h-[3px] absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500/60 to-emerald-400/30 rounded-t-3xl" />
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(149,193,31,0.12)" }}
              >
                <Image src="/imgs/flourish-logo2.svg" alt="samba flourish" width={40} height={40} className="object-contain" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="font-bold text-foreground text-[15px]">samba flourish</span>
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Sprout size={9} />
                    Monitoramento IoT
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Central de monitoramento de hortas com sensores Arduino em tempo real. Em desenvolvimento.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 border border-border text-muted-foreground/50 text-xs font-semibold shrink-0">
                <Lock size={12} />
                Em breve
              </div>
            </div>
          </div>
          )}
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
