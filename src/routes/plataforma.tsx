import { createFileRoute } from "@tanstack/react-router";
import { AppNav } from "@/components/app-nav";

export const Route = createFileRoute("/plataforma")({
  head: () => ({
    meta: [
      { title: "Plataforma Lume · Próximos agentes" },
      { name: "description", content: "A visão de plataforma do Lume: cinco agentes financeiros e operacionais para a sua PME." },
    ],
  }),
  component: Plataforma,
});

const AGENTES = [
  { nome: "Agente de Caixa Preditivo", descricao: "Veja o futuro do seu caixa antes que ele aconteça.", status: "Disponível agora", on: true },
  { nome: "Agente Fiscal", descricao: "Alertas antecipados sobre obrigações e mudanças tributárias.", status: "Demonstração", on: false },
  { nome: "Agente de Precificação", descricao: "Preço ideal calculado a partir do seu custo real e do mercado.", status: "Demonstração", on: false },
  { nome: "Agente de Negociação", descricao: "Melhores condições de pagamento, negociadas com dados.", status: "Demonstração", on: false },
  { nome: "Agente de Compliance Trabalhista", descricao: "Evite passivos trabalhistas antes que eles aconteçam.", status: "Demonstração", on: false },
];

function Plataforma() {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
        <div className="eyebrow">Plataforma Lume</div>
        <h1 className="font-display mt-4 text-4xl leading-[1.1] text-foreground md:text-5xl">
          O Lume está construindo o copiloto financeiro completo para PMEs brasileiras.
        </h1>

        <ul className="mt-16 border-t border-divider">
          {AGENTES.map((a, i) => (
            <li
              key={a.nome}
              className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 border-b border-divider py-8 md:gap-10"
            >
              <span className="eyebrow w-12">{String(i + 1).padStart(3, "0")}</span>
              <div>
                <div className="font-sans text-lg font-medium text-foreground md:text-xl">{a.nome}</div>
                <p className="mt-1 text-sm text-muted-foreground">{a.descricao}</p>
              </div>
              <span
                className="whitespace-nowrap rounded-sm border px-2 py-1 text-[11px]"
                style={{
                  color: a.on ? "var(--positive)" : "var(--gold)",
                  borderColor: a.on ? "var(--positive)" : "var(--gold)",
                }}
              >
                {a.status}
              </span>
            </li>
          ))}
        </ul>

        <p className="font-display mt-12 text-lg italic leading-relaxed text-muted-foreground md:text-xl">
          Todos os agentes compartilham a mesma base de dados da sua empresa — quanto mais você usa o Lume, mais inteligente ele fica.
        </p>
      </main>
    </div>
  );
}
