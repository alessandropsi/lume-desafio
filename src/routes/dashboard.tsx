import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TrendingDown, MessageCircle, Layers, Grid } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { mascaraCNPJ, useBusiness, validarCNPJ } from "@/lib/business-context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Lume" },
      { name: "description", content: "Acesse os agentes do Lume e configure os dados do seu negócio." },
    ],
  }),
  component: Dashboard,
});

const SEQ = [28400, 27800, 28950, 27200];

function Dashboard() {
  const { nome, data, setData } = useBusiness();
  const navigate = useNavigate();

  const [valIdx, setValIdx] = useState(0);
  const [alertIdx, setAlertIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setValIdx((i) => (i + 1) % SEQ.length), 2000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setAlertIdx((i) => (i + 1) % 2), 4000);
    return () => clearInterval(t);
  }, []);

  const valor = SEQ[valIdx];
  const prev = SEQ[(valIdx - 1 + SEQ.length) % SEQ.length];
  const subindo = valor > prev;

  const alerts = [
    { texto: "⚠ Risco de caixa negativo em 18/ago — R$ -3.200 projetado", cor: "var(--risk)" },
    { texto: "✓ Atrasar fornecedor 6 dias resolve o problema", cor: "var(--positive)" },
  ];
  const alerta = alerts[alertIdx];

  const cnpjValido = validarCNPJ(data.cnpj);

  return (
    <div className="min-h-screen">
      <AppNav />

      {/* Hero split */}
      <section className="border-b border-divider">
        <div className="mx-auto grid max-w-6xl gap-0 px-6 py-16 md:grid-cols-[55fr_45fr] md:gap-0 md:divide-x md:divide-divider md:px-10">
          <div className="md:pr-10">
            <div className="eyebrow">BEM-VINDO, {nome ? nome.toUpperCase() : "EMPREENDEDOR"}</div>
            <h1 className="font-display mt-4 text-5xl text-foreground md:text-6xl">Lume</h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground">
              O Lume analisa os dados financeiros da sua empresa e mostra, com antecedência,
              quando o seu caixa vai entrar em risco — antes que o problema aconteça. Veja o
              futuro do seu dinheiro, receba uma recomendação de ação, e simule como a
              Reforma Tributária impacta sua margem nos próximos meses.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-foreground">
              <li><span className="mr-3" style={{ color: "var(--gold)" }}>✦</span>Projeção de caixa para os próximos 90 dias</li>
              <li><span className="mr-3" style={{ color: "var(--gold)" }}>✦</span>Alerta antecipado de risco financeiro</li>
              <li><span className="mr-3" style={{ color: "var(--gold)" }}>✦</span>Simulação do impacto da Reforma Tributária (CBS/IBS)</li>
            </ul>
          </div>

          <div className="mt-10 bg-surface p-8 md:ml-10 md:mt-0">
            <div className="eyebrow">DEMONSTRAÇÃO AO VIVO — DADOS FICTÍCIOS</div>
            <div className="eyebrow mt-1">SALDO PROJETADO — SEMANA 4</div>
            <div className="mt-5 flex items-end gap-3">
              <div
                key={valor}
                className="font-display tabular text-5xl text-foreground transition-opacity duration-500"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                R$ {valor.toLocaleString("pt-BR")}
              </div>
            </div>
            <div className="mt-2 text-xs" style={{ color: subindo ? "var(--positive)" : "var(--risk)" }}>
              {subindo ? "↑ tendência de alta" : "↓ tendência de queda"}
            </div>

            <div
              key={alertIdx}
              className="mt-8 animate-[fade-in_0.4s_ease-out] bg-background/40 px-4 py-3 text-sm text-foreground"
              style={{ borderLeft: `3px solid ${alerta.cor}` }}
            >
              {alerta.texto}
            </div>
          </div>
        </div>
      </section>

      {/* Botões agentes */}
      <section className="border-b border-divider">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="eyebrow">ACESSE OS AGENTES</div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <AgentButton to="/painel" Icon={TrendingDown} title="Agente de Caixa" desc="Projeção de 90 dias do seu caixa" />
            <AgentButton to="/whatsapp" Icon={MessageCircle} title="Modo WhatsApp" desc="Converse com o Lume pelo WhatsApp" />
            <AgentButton to="/agentes" Icon={Layers} title="Mais Agentes" desc="Fiscal, Precificação, Negociação, Compliance" />
            <AgentButton to="/plataforma" Icon={Grid} title="Plataforma Lume" desc="Conheça a visão completa do produto" />
          </div>
        </div>
      </section>

      {/* Form empresa */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">
          <div className="eyebrow">DADOS DA SUA EMPRESA</div>
          <p className="mt-3 text-sm text-muted-foreground">
            Confira ou ajuste os dados pré-preenchidos para personalizar sua projeção.
          </p>

          <form
            className="mt-10 border-t border-divider"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/painel" });
            }}
          >
            <div className="grid gap-0 md:grid-cols-2 md:gap-x-12">
              <Field label="Nome da empresa">
                <input
                  type="text"
                  value={data.empresa}
                  onChange={(e) => setData({ ...data, empresa: e.target.value })}
                  className="w-full bg-transparent text-lg text-foreground outline-none"
                />
              </Field>

              <Field label="CNPJ">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={data.cnpj}
                    onChange={(e) => setData({ ...data, cnpj: mascaraCNPJ(e.target.value) })}
                    placeholder="00.000.000/0000-00"
                    className="tabular w-full bg-transparent text-lg text-foreground outline-none"
                  />
                  {data.cnpj && (
                    cnpjValido ? (
                      <span className="whitespace-nowrap text-xs text-positive">✓ CNPJ válido</span>
                    ) : (
                      <span className="whitespace-nowrap text-xs text-muted-foreground">CNPJ inválido</span>
                    )
                  )}
                </div>
              </Field>

              <Field label="Setor">
                <select
                  value={data.setor}
                  onChange={(e) => setData({ ...data, setor: e.target.value })}
                  className="w-full bg-transparent text-lg text-foreground outline-none"
                >
                  <option className="bg-surface">Comércio/Varejo</option>
                  <option className="bg-surface">Serviços</option>
                  <option className="bg-surface">Indústria</option>
                </select>
              </Field>

              <Field label="Regime tributário">
                <select
                  value={data.regime}
                  onChange={(e) => setData({ ...data, regime: e.target.value })}
                  className="w-full bg-transparent text-lg text-foreground outline-none"
                >
                  <option className="bg-surface">Simples Nacional</option>
                  <option className="bg-surface">Lucro Presumido</option>
                </select>
              </Field>

              <NumField label="Faturamento médio mensal (R$)" value={data.faturamento} onChange={(v) => setData({ ...data, faturamento: v })} />
              <NumField label="Contas a pagar recorrentes (R$/mês)" value={data.contas} onChange={(v) => setData({ ...data, contas: v })} />
              <NumField label="Saldo em caixa atual (R$)" value={data.saldo} onChange={(v) => setData({ ...data, saldo: v })} />
            </div>

            <div className="mt-10 flex items-center justify-end border-t border-divider py-8">
              <button
                type="submit"
                className="rounded-md bg-positive px-8 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                Ver minha projeção →
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function AgentButton({
  to, Icon, title, desc,
}: { to: "/painel" | "/whatsapp" | "/agentes" | "/plataforma"; Icon: React.ComponentType<{ size?: number; className?: string }>; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group rounded-md border border-divider bg-surface px-6 py-7 transition hover:border-positive"
    >
      <Icon size={22} className="text-muted-foreground transition group-hover:text-positive" />
      <div className="mt-4 text-base font-medium text-foreground">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </Link>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid grid-cols-1 gap-2 border-b border-divider py-6">
      <span className="eyebrow">{label}</span>
      {children}
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="tabular w-full bg-transparent text-lg text-foreground outline-none"
      />
    </Field>
  );
}
