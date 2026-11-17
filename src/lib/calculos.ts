import type { CategoriaSaida, Lancamento } from "./dados/tipos";
import { somarMeses, type ChaveMes } from "./formato";

export function doMes(lancamentos: Lancamento[], mes: ChaveMes): Lancamento[] {
  return lancamentos.filter((l) => l.data.startsWith(mes));
}

/** Mais recentes primeiro; no mesmo dia, o último registrado primeiro. */
export function ordenarPorData(lancamentos: Lancamento[]): Lancamento[] {
  return lancamentos
    .map((l, indice) => ({ l, indice }))
    .sort((a, b) => b.l.data.localeCompare(a.l.data) || b.indice - a.indice)
    .map(({ l }) => l);
}

export interface Resumo {
  entradas: number;
  saidas: number;
  saldo: number;
  qtdEntradas: number;
  qtdSaidas: number;
}

export function resumir(lancamentos: Lancamento[]): Resumo {
  const r: Resumo = { entradas: 0, saidas: 0, saldo: 0, qtdEntradas: 0, qtdSaidas: 0 };
  for (const l of lancamentos) {
    if (l.tipo === "entrada") {
      r.entradas += l.valor;
      r.qtdEntradas++;
    } else {
      r.saidas += l.valor;
      r.qtdSaidas++;
    }
  }
  r.saldo = r.entradas - r.saidas;
  return r;
}

function totalPorCategoria(lancamentos: Lancamento[]): Map<CategoriaSaida, number> {
  const totais = new Map<CategoriaSaida, number>();
  for (const l of lancamentos) {
    if (l.tipo !== "saida") continue;
    const categoria = l.categoria as CategoriaSaida;
    totais.set(categoria, (totais.get(categoria) ?? 0) + l.valor);
  }
  return totais;
}

export interface FatiaDeGasto {
  categoria: CategoriaSaida;
  total: number;
  /** Fração das saídas do mês (0 a 1). */
  parcela: number;
  /** Total da mesma categoria no mês anterior. */
  anterior: number;
}

/** Gastos do mês por categoria, do maior para o menor; "Outros" sempre por último. */
export function gastosPorCategoria(doMesAtual: Lancamento[], doMesAnterior: Lancamento[]): FatiaDeGasto[] {
  const totais = totalPorCategoria(doMesAtual);
  const anteriores = totalPorCategoria(doMesAnterior);
  const soma = [...totais.values()].reduce((a, b) => a + b, 0);
  return [...totais.entries()]
    .map(([categoria, total]) => ({
      categoria,
      total,
      parcela: soma ? total / soma : 0,
      anterior: anteriores.get(categoria) ?? 0,
    }))
    .sort((a, b) => Number(a.categoria === "outros") - Number(b.categoria === "outros") || b.total - a.total);
}

export interface PontoMensal {
  mes: ChaveMes;
  entradas: number;
  saidas: number;
}

export function serieMensal(lancamentos: Lancamento[], ultimo: ChaveMes, quantidade = 6): PontoMensal[] {
  const pontos = Array.from({ length: quantidade }, (_, i) => ({
    mes: somarMeses(ultimo, i - quantidade + 1),
    entradas: 0,
    saidas: 0,
  }));
  const porMes = new Map(pontos.map((p) => [p.mes as string, p]));
  for (const l of lancamentos) {
    const ponto = porMes.get(l.data.slice(0, 7));
    if (!ponto) continue;
    if (l.tipo === "entrada") ponto.entradas += l.valor;
    else ponto.saidas += l.valor;
  }
  return pontos;
}

/** Um teto "redondo" para eixos: 1, 2, 2,5 ou 5 × 10ⁿ acima do valor. */
export function tetoRedondo(valor: number): number {
  if (valor <= 0) return 1;
  const potencia = 10 ** Math.floor(Math.log10(valor));
  for (const passo of [1, 2, 2.5, 5, 10]) {
    if (passo * potencia >= valor) return passo * potencia;
  }
  return 10 * potencia;
}
