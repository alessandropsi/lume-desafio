import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { useBusiness } from "@/lib/business-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lume — Agentes de IA prontos para o seu negócio" },
      {
        name: "description",
        content:
          "Use Lume para acessar agentes prontos para o seu negócio. Projeção de caixa, alertas fiscais, precificação e mais.",
      },
    ],
  }),
  component: Landing,
});

const SEQ = [28400, 27800, 28950, 27200];
const SPARK_BASE = [28100, 28400, 27800, 28950, 27200, 28600, 27500, 28200];

function Landing() {
  const { aplicarPerfilPorNome } = useBusiness();
  const navigate = useNavigate();
  const [nome, setNomeLocal] = useState("");
  const [guia, setGuia] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const podeEntrar = nome.trim().length >= 2;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!podeEntrar) return;
    aplicarPerfilPorNome(nome.trim());
    navigate({ to: "/dashboard" });
  }

  function scrollToCta() {
    ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-divider bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <a href="#top" className="font-display text-2xl text-foreground">
            Lume
          </a>
          <div className="flex items-center gap-6">
            <a href="#como" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">
              Como funciona
            </a>
            <a href="#agentes" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">
              Agentes
            </a>
            <button
              onClick={scrollToCta}
              className="rounded-md border border-positive bg-transparent px-4 py-2 text-sm font-medium text-positive transition hover:bg-positive/10"
            >
              Começar agora
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="border-b border-divider">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[55fr_45fr] md:gap-16 md:px-10 md:py-28">
          <div>
            <div className="eyebrow text-gold" style={{ color: "var(--gold)" }}>
              MARKETPLACE DE AGENTES DE IA PARA PMES
            </div>
            <h1 className="font-display mt-6 text-foreground" style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.05 }}>
              Use Lume para acessar<br />agentes prontos<br />para o seu negócio.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Projeção de caixa, alertas fiscais, precificação e mais — agentes de IA prontos, sem precisar configurar nada.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToCta}
                className="rounded-md bg-positive px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                Acessar agora →
              </button>
              <a
                href="#como"
                className="rounded-md border border-divider px-6 py-3 text-sm text-muted-foreground transition hover:text-foreground"
              >
                Ver como funciona
              </a>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Sem cadastro. Sem cartão de crédito. Só o seu nome.
            </p>
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="border-b border-divider bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-divider px-6 py-16 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-10">
          <Metric big="+1 milhão" small="de PMEs abertas no Brasil em jan-fev/2026 (Sebrae)" />
          <Metric big="60%" small="fecham antes de completar 5 anos por falha na gestão financeira" />
          <Metric big="R$ 0" small="custo para acessar o Lume nesta fase" />
        </div>
      </section>

      {/* COMO ERA / COMO É */}
      <section id="como" className="border-b border-divider">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <h2 className="font-display text-3xl text-foreground md:text-5xl">
            A gestão financeira da PME mudou.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Por anos, o dono do negócio olhava para o passado. O Lume olha para o futuro.
          </p>

          <div className="mt-16 grid gap-12 md:grid-cols-2 md:divide-x md:divide-divider md:gap-0">
            <div className="md:pr-12">
              <div className="eyebrow" style={{ color: "var(--risk)" }}>COMO SEMPRE FOI</div>
              <ul className="mt-6 space-y-5">
                {[
                  "Você descobre que o caixa está no vermelho quando já é tarde.",
                  "Reforma tributária chega como surpresa no bolso.",
                  "Precificação feita no achismo, sem dados reais de custo.",
                ].map((t) => (
                  <li key={t} className="flex gap-4 text-base text-foreground">
                    <span className="mt-1 text-risk" style={{ color: "var(--risk)" }}>✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:pl-12">
              <div className="eyebrow" style={{ color: "var(--positive)" }}>COM O LUME</div>
              <ul className="mt-6 space-y-5">
                {[
                  "Você vê o risco de caixa com 30, 60 ou 90 dias de antecedência.",
                  "CBS e IBS simulados no seu fluxo, antes de entrar em vigor.",
                  "Preço ideal calculado com base no seu custo real e margem desejada.",
                ].map((t) => (
                  <li key={t} className="flex gap-4 text-base text-foreground">
                    <span className="mt-1 text-positive" style={{ color: "var(--positive)" }}>✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AGENTES DISPONÍVEIS */}
      <section id="agentes" className="border-b border-divider bg-surface">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:px-10 md:py-28">
          <div className="eyebrow">AGENTES DISPONÍVEIS NA PLATAFORMA</div>
          <h2 className="font-display mt-4 text-3xl text-foreground md:text-5xl">
            Um agente para cada dor do seu negócio.
          </h2>

          <ul className="mt-16 border-t border-divider text-left">
            {AGENTES_LANDING.map((a, i) => (
              <li key={a.nome} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 border-b border-divider py-7">
                <span className="eyebrow w-12">{String(i + 1).padStart(3, "0")}</span>
                <div>
                  <div className="text-lg font-medium text-foreground">{a.nome}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.descricao}</p>
                </div>
                <span
                  className="whitespace-nowrap rounded-sm border px-2 py-1 text-[11px]"
                  style={{
                    color: a.disponivel ? "var(--positive)" : "var(--gold)",
                    borderColor: a.disponivel ? "var(--positive)" : "var(--gold)",
                  }}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CREDENCIAIS */}
      <section className="border-b border-divider">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-divider px-6 py-16 md:grid-cols-4 md:divide-x md:divide-y-0 md:px-10">
          <Credencial icon="🔒" title="Dados fictícios nesta versão" body="Nenhum dado real é coletado ou armazenado neste MVP" />
          <Credencial icon="📋" title="LGPD" body="Desenvolvido com conformidade à Lei Geral de Proteção de Dados" />
          <Credencial icon="🇧🇷" title="Feito para o Brasil" body="Regras tributárias e trabalhistas brasileiras aplicadas" />
          <Credencial icon="⚡" title="Sem cadastro" body="Apenas seu nome para começar" />
        </div>
      </section>

      {/* CTA FINAL */}
      <section ref={ctaRef} className="border-b border-divider bg-surface">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center md:px-10 md:py-32">
          <h2 className="font-display text-3xl text-foreground md:text-5xl">
            Pronto para ver o futuro do seu negócio?
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Digite seu nome e acesse os agentes agora. Sem cadastro, sem cartão.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-[400px] text-left">
            <label className="block text-sm text-muted-foreground">Como você se chama?</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNomeLocal(e.target.value)}
              placeholder="seu nome"
              className="mt-3 w-full border-b border-divider bg-transparent py-3 font-display text-2xl text-foreground outline-none transition-colors focus:border-positive"
            />
            <button
              type="submit"
              disabled={!podeEntrar}
              className="mt-8 w-full rounded-md bg-positive px-6 py-3 text-sm font-medium text-background transition disabled:cursor-not-allowed disabled:opacity-30"
            >
              Acessar o Lume →
            </button>
          </form>

          <button
            type="button"
            onClick={() => setGuia(true)}
            className="mt-10 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Está avaliando este projeto? Veja como explorar →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[2fr_3fr] md:px-10">
          <div>
            <div className="font-display text-2xl text-foreground">Lume</div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Use Lume para acessar agentes prontos para o seu negócio.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <div className="eyebrow mb-3">Produto</div>
              <ul className="space-y-2">
                <li><a href="#agentes" className="hover:text-foreground">Agentes</a></li>
                <li><a href="#como" className="hover:text-foreground">Como funciona</a></li>
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-3">Empresa</div>
              <ul className="space-y-2">
                <li><span>Sobre</span></li>
                <li><span>Contato</span></li>
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-3">Legal</div>
              <ul className="space-y-2">
                <li><span>Privacidade</span></li>
                <li><span>Termos</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-divider">
          <div className="mx-auto max-w-6xl px-6 py-5 text-[11px] text-muted-foreground md:px-10">
            © 2026 Lume. MVP desenvolvido para o Desafio TRAE + AI Brasil.
          </div>
        </div>
      </footer>

      {guia && <GuiaModal onClose={() => setGuia(false)} />}
    </div>
  );
}

const AGENTES_LANDING = [
  { nome: "Agente de Caixa Preditivo", descricao: "Projeção de 90 dias, alertas de risco e simulação da Reforma Tributária.", status: "Disponível agora", disponivel: true },
  { nome: "Agente Fiscal", descricao: "Calendário de obrigações fiscais com alertas de vencimento.", status: "Demonstração", disponivel: false },
  { nome: "Agente de Precificação", descricao: "Preço ideal calculado a partir do custo real e da margem desejada.", status: "Demonstração", disponivel: false },
  { nome: "Agente de Negociação", descricao: "Análise de fornecedores e potencial de negociação com dados.", status: "Demonstração", disponivel: false },
  { nome: "Agente de Compliance Trabalhista", descricao: "Score de conformidade e alertas de risco trabalhista.", status: "Demonstração", disponivel: false },
];

function HeroMockup() {
  const [idx, setIdx] = useState(0);
  const [alertIdx, setAlertIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SEQ.length), 2000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setAlertIdx((i) => (i + 1) % 2), 4000);
    return () => clearInterval(t);
  }, []);

  const valor = SEQ[idx];
  const prev = SEQ[(idx - 1 + SEQ.length) % SEQ.length];
  const subindo = valor > prev;

  const sparkData = SPARK_BASE.slice(idx, idx + 6).concat(SPARK_BASE.slice(0, Math.max(0, 6 - (SPARK_BASE.length - idx)))).map((v, i) => ({ i, v }));

  const alerts = [
    { texto: "⚠ Risco de caixa negativo em 18/ago", cor: "var(--risk)" },
    { texto: "✓ Atrasar fornecedor 6 dias resolve", cor: "var(--positive)" },
  ];
  const alerta = alerts[alertIdx];

  return (
    <div className="rounded-lg border border-divider bg-surface p-6">
      <div className="eyebrow">SALDO PROJETADO — SEMANA 4</div>
      <div className="mt-4 flex items-end gap-3">
        <div
          key={valor}
          className="font-display tabular text-5xl text-foreground transition-opacity duration-500 md:text-6xl"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          R$ {valor.toLocaleString("pt-BR")}
        </div>
        <div className="pb-2 text-sm" style={{ color: subindo ? "var(--positive)" : "var(--risk)" }}>
          {subindo ? "↑" : "↓"}
        </div>
      </div>

      <div className="mt-6 h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={subindo ? "var(--positive)" : "var(--risk)"}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        key={alertIdx}
        className="mt-6 animate-[fade-in_0.4s_ease-out] border-l-2 bg-background/40 px-3 py-2 text-xs text-foreground"
        style={{ borderColor: alerta.cor }}
      >
        {alerta.texto}
      </div>

      <div className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
        Dados fictícios — Demonstração
      </div>
    </div>
  );
}

function Metric({ big, small }: { big: string; small: string }) {
  return (
    <div className="px-6 py-8 md:px-10">
      <div className="font-display text-4xl md:text-5xl" style={{ color: "var(--positive)" }}>{big}</div>
      <p className="mt-3 text-sm text-muted-foreground">{small}</p>
    </div>
  );
}

function Credencial({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="px-6 py-6 md:px-8">
      <div className="text-xl">{icon}</div>
      <div className="mt-3 text-sm font-medium text-foreground">{title}</div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function GuiaModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg border border-divider bg-surface px-8 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
        <div className="eyebrow">Guia rápido</div>
        <h2 className="font-display mt-3 text-2xl text-foreground">Como explorar o Lume</h2>
        <ol className="mt-6 space-y-4 text-sm leading-relaxed text-foreground">
          {[
            "Na tela inicial, veja o painel animado de demonstração.",
            "Explore os agentes pelos botões antes de preencher qualquer dado da empresa.",
            "No Agente de Caixa, ative o toggle de Reforma Tributária e veja a curva mudar.",
            "Use os sliders de cenário — o gráfico responde em tempo real.",
            "Acesse o Modo WhatsApp para ver o agente respondendo como no WhatsApp real.",
          ].map((t, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
              <span className="eyebrow pt-1">{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <button
          onClick={onClose}
          className="mt-8 border border-divider px-4 py-2 text-sm text-foreground hover:bg-background"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
