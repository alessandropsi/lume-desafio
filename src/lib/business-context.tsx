import { createContext, useContext, useState, type ReactNode } from "react";

export type BusinessData = {
  empresa: string;
  cnpj: string;
  setor: string;
  regime: string;
  faturamento: number;
  contas: number;
  saldo: number;
};

export const PERFIS: BusinessData[] = [
  {
    empresa: "Loja Estação Norte",
    cnpj: "11.222.333/0001-81",
    setor: "Comércio/Varejo",
    regime: "Simples Nacional",
    faturamento: 45000,
    contas: 32000,
    saldo: 18000,
  },
  {
    empresa: "Espaço Bela Vista",
    cnpj: "22.333.444/0001-81",
    setor: "Serviços",
    regime: "Simples Nacional",
    faturamento: 28000,
    contas: 19000,
    saldo: 22000,
  },
  {
    empresa: "Ferragens Lopes",
    cnpj: "33.444.555/0001-81",
    setor: "Comércio/Varejo",
    regime: "Lucro Presumido",
    faturamento: 62000,
    contas: 48000,
    saldo: 12000,
  },
];

export function mascaraCNPJ(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function validarCNPJ(v: string): boolean {
  const d = v.replace(/\D/g, "");
  if (d.length !== 14) return false;
  if (/^(\d)\1+$/.test(d)) return false;
  const calc = (base: string, pesos: number[]) => {
    const s = base.split("").reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const p1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const p2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = calc(d.slice(0, 12), p1);
  const d2 = calc(d.slice(0, 12) + d1, p2);
  return d1 === Number(d[12]) && d2 === Number(d[13]);
}

export function perfilParaNome(nome: string): number {
  const limpo = nome.trim().toLowerCase();
  if (!limpo) return 0;
  let soma = 0;
  for (let i = 0; i < limpo.length; i++) soma += limpo.charCodeAt(i);
  return soma % 3;
}

type Ctx = {
  nome: string;
  setNome: (n: string) => void;
  data: BusinessData;
  setData: (d: BusinessData) => void;
  aplicarPerfilPorNome: (nome: string) => void;
};

const BusinessCtx = createContext<Ctx | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [nome, setNome] = useState<string>("");
  const [data, setData] = useState<BusinessData>(PERFIS[0]);

  const aplicarPerfilPorNome = (n: string) => {
    setNome(n);
    setData(PERFIS[perfilParaNome(n)]);
  };

  return (
    <BusinessCtx.Provider value={{ nome, setNome, data, setData, aplicarPerfilPorNome }}>
      {children}
    </BusinessCtx.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessCtx);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}

// Fixed sequence noise — deterministic, not Math.random
const RUIDO_FIXO = [
  1.04, 0.96, 1.07, 0.93, 1.02, 0.95, 1.06, 0.98,
  1.03, 0.94, 1.05, 0.97,
];

export type Projecao = {
  semana: number;
  data: string;
  saldo: number;
  saldoReforma?: number;
};

export type Cenario = {
  reducaoFaturamento: number;
  atrasoFornecedor: number;
  comReforma: boolean;
};

const REFORMA_PCT = [
  0.005, 0.005, 0.005, 0.005,
  0.012, 0.012, 0.012, 0.012,
  0.021, 0.021, 0.021, 0.021,
];

export function calcularProjecao(d: BusinessData, c: Cenario): Projecao[] {
  const entradaBase = d.faturamento / 4.3;
  const saidaBase = d.contas / 4.3;
  const fatorReducao = 1 - c.reducaoFaturamento;
  const semanaAtraso = Math.min(11, Math.floor(c.atrasoFornecedor / 7));
  const resultado: Projecao[] = [];
  let saldo = d.saldo;
  let saldoReforma = d.saldo;
  const hoje = new Date();

  for (let i = 0; i < 12; i++) {
    const ruido = RUIDO_FIXO[i];
    const entradaSemana = entradaBase * ruido * fatorReducao;

    let saidaSemana = saidaBase;
    if (c.atrasoFornecedor > 0) {
      if (i === semanaAtraso) saidaSemana = saidaBase * 0.6;
      else if (i === semanaAtraso + 1) saidaSemana = saidaBase * 1.4;
    }

    saldo = saldo + entradaSemana - saidaSemana;

    const reformaExtra = (d.faturamento / 4.3) * fatorReducao * REFORMA_PCT[i];
    saldoReforma = saldoReforma + entradaSemana - saidaSemana - reformaExtra;

    const dataSemana = new Date(hoje);
    dataSemana.setDate(hoje.getDate() + (i + 1) * 7);

    resultado.push({
      semana: i + 1,
      data: dataSemana.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      saldo: Math.round(saldo),
      saldoReforma: c.comReforma ? Math.round(saldoReforma) : undefined,
    });
  }
  return resultado;
}

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
