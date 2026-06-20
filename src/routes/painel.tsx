import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
  Dot,
} from "recharts";
import { AppNav } from "@/components/app-nav";
import { calcularProjecao, formatBRL, useBusiness } from "@/lib/business-context";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Agente de Caixa · Lume" },
      {
        name: "description",
        content:
          "Projeção de saldo de caixa para os próximos 90 dias, simulação da Reforma Tributária e cenários em tempo real.",
      },
    ],
  }),
  component: Painel,
});

function Painel() {
  const { data, nome } = useBusiness();
  const [reforma, setReforma] = useState(false);
  const [reducao, setReducao] = useState(0);
  const [atraso, setAtraso] = useState(0);

  const projecao = useMemo(
    () =>
      calcularProjecao(data, {
        reducaoFaturamento: reducao / 100,
        atrasoFornecedor: atraso,
        comReforma: reforma,
      }),
    [data, reducao, atraso, reforma],
  );

  const primeiroNegativo = projecao.find((p) => p.saldo < 0);
  const saldoFinal = projecao[projecao.length - 1].saldo;
  const variacao = saldoFinal - data.saldo;

  const diffSemanal = data.faturamento / 4.3 - data.contas / 4.3;
  const recomendacao = (() => {
    if (!primeiroNegativo) {
      return {
        tom: "positive" as const,
        texto: "Seu caixa está saudável para os próximos 90 dias. Continue monitorando.",
      };
    }
    const pctDiff = diffSemanal / (data.contas / 4.3);
    if (pctDiff < 0.15) {
      return {
        tom: "risk" as const,
        texto: `Negocie um prazo adicional de 5 a 7 dias com seus principais fornecedores para aliviar o caixa em ${primeiroNegativo.data}.`,
      };
    }
    return {
      tom: "risk" as const,
      texto: `Considere antecipar recebíveis ou acessar uma linha de capital de giro antes de ${primeiroNegativo.data} para evitar o descoberto.`,
    };
  })();

  const minY = Math.min(0, ...projecao.map((p) => Math.min(p.saldo, p.saldoReforma ?? p.saldo)));
  const maxY = Math.max(...projecao.map((p) => Math.max(p.saldo, p.saldoReforma ?? p.saldo)));

  return (
    <div className="min-h-screen">
      <AppNav />

      {/* Hatched pattern for risk area */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern id="riskHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#E8694A" strokeWidth="1" strokeOpacity="0.35" />
          </pattern>
        </defs>
      </svg>

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        {/* Header */}
        <section className="flex flex-col gap-6 border-b border-divider pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            {nome && <div className="eyebrow mb-2">Olá, {nome}</div>}
            <div className="eyebrow">{data.setor} · {data.regime}</div>
            <h1 className="font-display mt-3 text-3xl text-foreground md:text-4xl">{data.empresa}</h1>
          </div>
          <div>
            <div className="eyebrow">Saldo em caixa atual</div>
            <div className="font-display tabular mt-2 text-5xl text-foreground md:text-6xl">
              {formatBRL(data.saldo)}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
              Atualizado agora · {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </section>

        {/* Projection numbers */}
        <section className="grid grid-cols-2 gap-8 border-b border-divider py-8 md:grid-cols-4">
          <Metric label="Saldo projetado em 90d" value={formatBRL(saldoFinal)} />
          <Metric
            label="Variação no período"
            value={`${variacao >= 0 ? "+" : ""}${formatBRL(variacao)}`}
            tone={variacao >= 0 ? "positive" : "risk"}
          />
          <Metric
            label="Ponto de risco"
            value={primeiroNegativo ? primeiroNegativo.data : "Nenhum"}
            tone={primeiroNegativo ? "risk" : "positive"}
          />
          <Metric label="Entrada semanal estimada" value={formatBRL(data.faturamento / 4.3)} />
        </section>

        {/* Chart */}
        <section className="py-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="eyebrow">Projeção · Próximas 12 semanas</div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Legend color="var(--foreground)" label="Saldo projetado" />
              {reforma && <Legend color="var(--gold)" label="Com Reforma Tributária" dashed />}
              {primeiroNegativo && <Legend color="var(--risk)" label="Zona de risco" />}
            </div>
          </div>

          <div className="h-[360px] w-full md:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projecao} margin={{ top: 20, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="#243530" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="data"
                  stroke="#8FA39B"
                  tick={{ fontSize: 11, fill: "#8FA39B" }}
                  tickLine={false}
                  axisLine={{ stroke: "#243530" }}
                />
                <YAxis
                  stroke="#8FA39B"
                  tick={{ fontSize: 11, fill: "#8FA39B" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `R$${Math.round(v / 1000)}k`}
                  domain={[Math.min(minY * 1.1, minY - 2000), Math.max(maxY * 1.1, maxY + 2000)]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#131F1B",
                    border: "1px solid #243530",
                    borderRadius: 2,
                    fontSize: 12,
                    color: "#EDF2EF",
                  }}
                  labelStyle={{ color: "#8FA39B", marginBottom: 4 }}
                  formatter={(v, name) => [formatBRL(Number(v)), name === "saldo" ? "Saldo" : "Com Reforma"]}
                />
                <ReferenceLine y={0} stroke="#E8694A" strokeWidth={1} strokeDasharray="3 3" />
                {/* Risk area: below zero */}
                <Area
                  type="monotone"
                  dataKey={(d: { saldo: number }) => (d.saldo < 0 ? d.saldo : 0)}
                  stroke="none"
                  fill="url(#riskHatch)"
                  isAnimationActive={false}
                />
                {reforma && (
                  <Line
                    type="monotone"
                    dataKey="saldoReforma"
                    stroke="#C9A961"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    isAnimationActive
                    animationDuration={500}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#EDF2EF"
                  strokeWidth={2}
                  dot={(props: { cx?: number; cy?: number; payload?: { saldo: number }; index?: number }) => {
                    const { cx, cy, payload, index } = props;
                    if (cx == null || cy == null || !payload) return <g key={index} />;
                    const isNeg = payload.saldo < 0;
                    return (
                      <Dot
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={isNeg ? 4 : 0}
                        fill={isNeg ? "#E8694A" : "#EDF2EF"}
                        stroke={isNeg ? "#E8694A" : "none"}
                      />
                    );
                  }}
                  isAnimationActive
                  animationDuration={500}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Alert */}
          {primeiroNegativo && (
            <div className="mt-2 border-l-2 border-risk bg-surface/40 px-4 py-3 text-sm text-foreground">
              <span className="text-risk">⎯⎯</span>{" "}
              Risco de caixa negativo em <strong>{primeiroNegativo.data}</strong> — saldo projetado:{" "}
              <span className="tabular">{formatBRL(primeiroNegativo.saldo)}</span>
            </div>
          )}
        </section>

        {/* Recommendation */}
        <section className="border-t border-divider py-8">
          <div className="eyebrow mb-3">Ação recomendada</div>
          <p
            className={
              "font-display text-2xl leading-snug md:text-3xl " +
              (recomendacao.tom === "risk" ? "text-risk" : "text-positive")
            }
          >
            {recomendacao.texto}
          </p>
        </section>

        {/* Reforma toggle */}
        <section className="border-t border-divider py-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="eyebrow">Cenário tributário</div>
              <div className="mt-2 font-display text-xl text-foreground">
                Simular Reforma Tributária (CBS/IBS)
              </div>
              <p className="mt-2 max-w-xl text-xs text-muted-foreground">
                Baseado no cronograma de transição da CBS e IBS (Lei Complementar 214/2025), com
                alíquotas de teste crescentes em 2026.
              </p>
            </div>
            <button
              role="switch"
              aria-checked={reforma}
              onClick={() => setReforma(!reforma)}
              className={
                "relative h-7 w-12 shrink-0 border transition " +
                (reforma ? "border-gold bg-gold/20" : "border-divider bg-surface")
              }
            >
              <span
                className={
                  "absolute top-1/2 block h-4 w-4 -translate-y-1/2 transition-all " +
                  (reforma ? "left-[26px] bg-gold" : "left-1 bg-muted-foreground")
                }
              />
            </button>
          </div>
        </section>

        {/* Scenario sliders */}
        <section className="border-t border-divider py-8">
          <div className="eyebrow mb-6">Simular cenário</div>
          <div className="grid gap-8 md:grid-cols-2">
            <Slider
              label="E se eu perder um cliente importante?"
              value={reducao}
              setValue={setReducao}
              min={0}
              max={30}
              suffix="% redução no faturamento"
            />
            <Slider
              label="E se eu atrasar um pagamento a fornecedor?"
              value={atraso}
              setValue={setAtraso}
              min={0}
              max={15}
              suffix=" dias de atraso"
            />
          </div>
        </section>

        <section className="border-t border-divider py-8 text-sm text-muted-foreground">
          <Link to="/whatsapp" className="hover:text-foreground">
            → Veja como o Lume responde direto no seu WhatsApp
          </Link>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "positive" | "risk" }) {
  const color = tone === "risk" ? "text-risk" : tone === "positive" ? "text-positive" : "text-foreground";
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className={`font-display tabular mt-2 text-2xl md:text-3xl ${color}`}>{value}</div>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-[2px] w-6"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)`
            : color,
        }}
      />
      {label}
    </span>
  );
}

function Slider({
  label,
  value,
  setValue,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground">{label}</label>
      <div className="font-display tabular mt-2 text-2xl text-foreground">
        {value}
        <span className="ml-2 text-sm text-muted-foreground">{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--risk)]"
      />
    </div>
  );
}
