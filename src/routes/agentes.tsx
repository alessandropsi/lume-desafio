import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { formatBRL, useBusiness } from "@/lib/business-context";

export const Route = createFileRoute("/agentes")({
  head: () => ({
    meta: [
      { title: "Mais Agentes · Lume" },
      { name: "description", content: "Agente Fiscal, Precificação, Negociação e Compliance Trabalhista — demonstração." },
    ],
  }),
  component: Agentes,
});

type Aba = "fiscal" | "precificacao" | "negociacao" | "compliance";

function Agentes() {
  const [aba, setAba] = useState<Aba>("fiscal");

  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        <div className="eyebrow">Demonstração</div>
        <h1 className="font-display mt-3 text-3xl text-foreground md:text-4xl">
          Mais agentes do Lume.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Exemplos demonstrativos baseados nos dados da sua empresa.
        </p>

        <div className="mt-10 flex flex-wrap gap-1 border-b border-divider">
          {[
            ["fiscal", "Fiscal"],
            ["precificacao", "Precificação"],
            ["negociacao", "Negociação"],
            ["compliance", "Compliance Trabalhista"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setAba(k as Aba)}
              className={
                "px-4 py-3 text-sm transition " +
                (aba === k
                  ? "border-b-2 border-positive text-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {l}
            </button>
          ))}
        </div>

        <div className="py-10">
          {aba === "fiscal" && <Fiscal />}
          {aba === "precificacao" && <Precificacao />}
          {aba === "negociacao" && <Negociacao />}
          {aba === "compliance" && <Compliance />}
        </div>
      </main>
    </div>
  );
}

function useProcessando(ms: number, key: unknown) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDone(false);
    const t = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(t);
  }, [ms, key]);
  return done;
}

function Processando({ texto }: { texto: string }) {
  return (
    <div className="border-l-2 border-positive bg-surface/40 px-4 py-6">
      <div className="text-sm text-muted-foreground">{texto}</div>
      <div className="mt-3 h-1 w-full overflow-hidden bg-divider">
        <div className="h-full animate-[scale-in_0.6s_ease-out] bg-positive" style={{ animation: "loading 2s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes loading { 0% { width: 10%; margin-left: 0% } 50% { width: 60%; margin-left: 40% } 100% { width: 10%; margin-left: 90% } }`}</style>
    </div>
  );
}

// ---------- FISCAL ----------
function Fiscal() {
  const { data } = useBusiness();
  const done = useProcessando(1500, data.regime);

  if (!done) return <Processando texto="Analisando obrigações fiscais..." />;

  const hoje = new Date();
  const inDays = (d: number) => {
    const x = new Date(hoje);
    x.setDate(x.getDate() + d);
    return x.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const obrigacoes =
    data.regime === "Simples Nacional"
      ? [
          { nome: "DAS — Documento de Arrecadação do Simples", dia: inDays(8), dias: 8 },
          { nome: "PGDAS-D — Declaração mensal", dia: inDays(22), dias: 22 },
          { nome: "DEFIS — Declaração Anual", dia: inDays(75), dias: 75 },
        ]
      : [
          { nome: "DARF IRPJ/CSLL trimestral", dia: inDays(12), dias: 12 },
          { nome: "PIS/Cofins mensal", dia: inDays(5), dias: 5 },
          { nome: "DCTF mensal", dia: inDays(32), dias: 32 },
        ];

  return (
    <div className="space-y-3">
      <div className="eyebrow">Calendário fiscal · próximos 90 dias · {data.regime}</div>
      <ul className="mt-4 border-t border-divider">
        {obrigacoes.map((o) => {
          const cor = o.dias <= 7 ? "var(--risk)" : o.dias <= 30 ? "var(--gold)" : "var(--positive)";
          return (
            <li key={o.nome} className="flex items-center justify-between border-b border-divider py-5">
              <div>
                <div className="text-base text-foreground">{o.nome}</div>
                <div className="mt-1 text-xs text-muted-foreground">Vence em {o.dia} · em {o.dias} dias</div>
              </div>
              <span className="rounded-sm border px-2 py-1 text-[11px]" style={{ color: cor, borderColor: cor }}>
                {o.dias <= 7 ? "Urgente" : o.dias <= 30 ? "Atenção" : "Em dia"}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 border-l-2 px-4 py-4" style={{ borderColor: "var(--gold)" }}>
        <p className="text-sm text-foreground">
          Com CBS e IBS em vigor em 2026, sua próxima revisão de enquadramento tributário deve ocorrer até setembro/2026. O Lume monitorará as mudanças automaticamente.
        </p>
      </div>
    </div>
  );
}

// ---------- PRECIFICAÇÃO ----------
function Precificacao() {
  const { data } = useBusiness();
  const ticket = data.faturamento / 30;
  const [custo, setCusto] = useState(Math.round(ticket * 0.4));
  const [margem, setMargem] = useState(35);
  const [pressao, setPressao] = useState(50);
  const [calc, setCalc] = useState(false);
  const done = useProcessando(2000, calc);

  const m = margem / 100;
  const p = pressao / 100;
  const precoMin = custo / (1 - m * 0.7);
  const precoIdeal = (custo / (1 - m)) * (1 + p * 0.2);
  const precoPremium = precoIdeal * 1.25;
  const idealReforma = precoIdeal * 1.021;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <NumInput label="Custo direto (R$)" value={custo} onChange={setCusto} />
        <NumInput label="Margem desejada (%)" value={margem} onChange={setMargem} />
        <div>
          <div className="eyebrow">Pressão de mercado</div>
          <div className="tabular mt-2 text-xl text-foreground">{pressao}%</div>
          <input type="range" min={0} max={100} value={pressao} onChange={(e) => setPressao(Number(e.target.value))} className="mt-3 w-full accent-[var(--positive)]" />
        </div>
      </div>

      <button
        onClick={() => setCalc((v) => !v)}
        className="rounded-md bg-positive px-6 py-3 text-sm font-medium text-background"
      >
        Calcular preço ideal →
      </button>

      {calc && !done && <Processando texto="Analisando mercado e custos..." />}

      {calc && done && (
        <>
          <div className="grid grid-cols-3 gap-4 border-t border-divider pt-8">
            <PrecoCol label="Preço mínimo" valor={precoMin} />
            <PrecoCol label="Preço ideal" valor={precoIdeal} destaque />
            <PrecoCol label="Preço premium" valor={precoPremium} />
          </div>
          <div className="relative mt-2 h-1 w-full bg-divider">
            <div className="absolute inset-y-0 left-1/3 w-1/3" style={{ background: "var(--positive)" }} />
          </div>
          <div className="mt-8 border-l-2 px-4 py-4" style={{ borderColor: "var(--risk)" }}>
            <p className="text-sm text-foreground">
              Com a Reforma Tributária, seu custo efetivo aumentará +2,1% a partir de out/2026. O preço ideal subirá para <strong className="tabular">{formatBRL(idealReforma)}</strong>. O Lume atualizará automaticamente.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function NumInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="tabular mt-2 w-full border-b border-divider bg-transparent py-2 text-xl text-foreground outline-none focus:border-positive"
      />
    </div>
  );
}

function PrecoCol({ label, valor, destaque }: { label: string; valor: number; destaque?: boolean }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div
        className={"font-display tabular mt-2 " + (destaque ? "text-4xl" : "text-2xl text-muted-foreground")}
        style={destaque ? { color: "var(--positive)" } : undefined}
      >
        {formatBRL(valor)}
      </div>
    </div>
  );
}

// ---------- NEGOCIAÇÃO ----------
const FORNECEDORES: Record<string, { nome: string; valor: number; prazo: number }[]> = {
  "Comércio/Varejo": [
    { nome: "Distribuidora Alpha", valor: 8200, prazo: 30 },
    { nome: "Logística Beta", valor: 3400, prazo: 15 },
    { nome: "Embalagens Gama", valor: 1800, prazo: 7 },
  ],
  Serviços: [
    { nome: "Produtos Delta", valor: 4100, prazo: 30 },
    { nome: "Equipamentos Ômega", valor: 2900, prazo: 15 },
    { nome: "Materiais Sigma", valor: 1200, prazo: 7 },
  ],
};

function Negociacao() {
  const { data } = useBusiness();
  // Ferragens Lopes usa "Comércio Físico"
  const lista =
    data.empresa === "Ferragens Lopes"
      ? [
          { nome: "Atacado Central", valor: 18000, prazo: 21 },
          { nome: "Ferramentas Pro", valor: 6500, prazo: 30 },
          { nome: "Transporte Rápido", valor: 2800, prazo: 7 },
        ]
      : FORNECEDORES[data.setor] ?? FORNECEDORES["Comércio/Varejo"];

  const [analisados, setAnalisados] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<string | null>(null);

  function analisar(nome: string) {
    setLoading(nome);
    setTimeout(() => {
      setAnalisados((a) => ({ ...a, [nome]: true }));
      setLoading(null);
    }, 1500);
  }

  const todosFeitos = lista.every((f) => analisados[f.nome]);
  const somaMelhoria = lista.reduce((acc, f) => acc + f.valor * 0.08, 0);

  return (
    <div className="space-y-4">
      <ul className="border-t border-divider">
        {lista.map((f) => {
          const potencial = f.valor > 5000 ? "Alto" : f.valor >= 2000 ? "Médio" : "Baixo";
          const cor = potencial === "Alto" ? "var(--positive)" : potencial === "Médio" ? "var(--gold)" : "var(--muted-foreground)";
          const sugestao =
            potencial === "Alto"
              ? `Negocie prazo de ${f.prazo + 15} dias ou desconto de 4% no volume.`
              : potencial === "Médio"
              ? `Solicite ${f.prazo + 7} dias de prazo ou 2% de desconto.`
              : `Consolide pedidos para ganhar escala antes de negociar.`;
          return (
            <li key={f.nome} className="border-b border-divider py-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-base text-foreground">{f.nome}</div>
                  <div className="tabular mt-1 text-xs text-muted-foreground">
                    {formatBRL(f.valor)} / mês · prazo atual {f.prazo} dias
                  </div>
                </div>
                {!analisados[f.nome] && loading !== f.nome && (
                  <button
                    onClick={() => analisar(f.nome)}
                    className="rounded-md border border-divider px-4 py-2 text-xs text-foreground hover:border-positive"
                  >
                    Analisar potencial →
                  </button>
                )}
              </div>
              {loading === f.nome && (
                <div className="mt-4">
                  <Processando texto="Analisando histórico e condições..." />
                </div>
              )}
              {analisados[f.nome] && (
                <div className="mt-4 border-l-2 px-4 py-3" style={{ borderColor: cor }}>
                  <div className="text-xs uppercase tracking-wider" style={{ color: cor }}>
                    Potencial: {potencial}
                  </div>
                  <p className="mt-1 text-sm text-foreground">{sugestao}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {todosFeitos && (
        <div className="border-l-2 px-4 py-4" style={{ borderColor: "var(--positive)" }}>
          <p className="text-sm text-foreground">
            Negociando essas condições, seu caixa melhora{" "}
            <strong className="tabular">{formatBRL(somaMelhoria)}</strong> nos próximos 30 dias.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------- COMPLIANCE ----------
function Compliance() {
  const { data } = useBusiness();
  const done = useProcessando(2500, data.empresa);

  const scoreFinal =
    data.empresa === "Loja Estação Norte" ? 74 : data.empresa === "Espaço Bela Vista" ? 81 : 68;

  const [score, setScore] = useState(0);
  useEffect(() => {
    if (!done) return;
    let v = 0;
    const i = setInterval(() => {
      v += 2;
      if (v >= scoreFinal) {
        v = scoreFinal;
        clearInterval(i);
      }
      setScore(v);
    }, 20);
    return () => clearInterval(i);
  }, [done, scoreFinal]);

  if (!done) return <Processando texto="Verificando conformidade trabalhista..." />;

  const cor = scoreFinal > 75 ? "var(--positive)" : scoreFinal >= 50 ? "var(--gold)" : "var(--risk)";
  const risco =
    data.empresa === "Espaço Bela Vista"
      ? "Avaliar enquadramento de colaboradores freelance — risco de vínculo empregatício."
      : "Verificar aplicação de dissídio coletivo — possível defasagem salarial acima de 12 meses.";

  return (
    <div className="space-y-8">
      <div className="flex items-end gap-6 border-b border-divider pb-8">
        <div>
          <div className="eyebrow">Score de Compliance</div>
          <div className="font-display tabular mt-2 text-7xl" style={{ color: cor }}>{score}</div>
        </div>
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden bg-divider">
            <div className="h-full transition-all duration-500" style={{ width: `${score}%`, background: cor }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {scoreFinal > 75 ? "Boa conformidade" : scoreFinal >= 50 ? "Atenção em alguns pontos" : "Risco trabalhista relevante"}
          </div>
        </div>
      </div>

      <div>
        <div className="eyebrow">Riscos identificados</div>
        <div className="mt-3 flex items-start gap-3">
          <AlertTriangle size={18} style={{ color: "var(--risk)" }} className="mt-0.5 shrink-0" />
          <p className="text-sm text-foreground">{risco}</p>
        </div>
      </div>

      <div>
        <div className="eyebrow">Pontos em conformidade</div>
        <ul className="mt-3 space-y-2">
          {["FGTS recolhido regularmente", "Jornada de trabalho dentro do limite legal", "Férias sem acúmulo crítico"].map((t) => (
            <li key={t} className="flex items-start gap-3 text-sm text-foreground">
              <CheckCircle size={18} style={{ color: "var(--positive)" }} className="mt-0.5 shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-l-2 px-4 py-4" style={{ borderColor: "var(--gold)" }}>
        <p className="text-sm text-foreground">
          Agende uma revisão com seu contador nos próximos 30 dias para regularizar os pontos identificados. O Lume monitorará novos riscos automaticamente.
        </p>
      </div>
    </div>
  );
}
