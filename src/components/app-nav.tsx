import { Link, useRouterState } from "@tanstack/react-router";
import { useBusiness } from "@/lib/business-context";

export function AppNav() {
  const { data, nome } = useBusiness();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/painel", label: "Agente de Caixa" },
    { to: "/whatsapp", label: "Modo WhatsApp" },
    { to: "/agentes", label: "Mais Agentes" },
    { to: "/plataforma", label: "Plataforma Lume" },
  ] as const;

  return (
    <header className="border-b border-divider">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-10">
        <Link to="/dashboard" className="flex items-baseline gap-3">
          <span className="font-display text-2xl text-foreground">Lume</span>
          <span className="hidden text-xs text-muted-foreground md:inline">/ {data.empresa}</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={
                  "px-3 py-2 transition " +
                  (active
                    ? "text-foreground border-b border-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {l.label}
              </Link>
            );
          })}
          {nome && (
            <span className="ml-3 hidden text-xs text-muted-foreground md:inline">
              Olá, {nome}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
