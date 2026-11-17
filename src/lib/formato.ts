// Formatação em português do Brasil. Datas são tratadas como datas de calendário
// (AAAA-MM-DD), sem fuso: por isso toda formatação usa timeZone "UTC".

const numeroDuasCasas = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const porcentagem = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 });

/** "R$ 1.234,56" (ou "-R$ 1.234,56"). */
export function formatarMoeda(centavos: number): string {
  return moeda.format(centavos / 100);
}

/** Só o número, sem símbolo e sem sinal: "1.234,56". */
export function formatarNumero(centavos: number): string {
  return numeroDuasCasas.format(Math.abs(centavos) / 100);
}

/** Valor com sinal explícito para listas: "+ R$ 6.200,00" ou "− R$ 54,90". */
export function formatarComSinal(centavos: number, tipo: "entrada" | "saida"): string {
  // Espaços não separáveis: o sinal, o símbolo e o número nunca quebram de linha.
  return `${tipo === "entrada" ? "+" : "−"}\u00a0R$\u00a0${formatarNumero(centavos)}`;
}

export function formatarPorcentagem(fracao: number): string {
  return porcentagem.format(fracao);
}

/** Rótulo curto para eixos: "0", "2 mil", "12,5 mil". */
export function formatarCompacto(centavos: number): string {
  const reais = Math.abs(centavos) / 100;
  if (reais === 0) return "0";
  if (reais < 1000) return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(reais);
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(reais / 1000)} mil`;
}

/** Converte o que a pessoa digitou ("1.234,56", "1234.5", "R$ 80") em centavos. */
export function lerValor(texto: string): number | null {
  let limpo = texto.replace(/R\$|\s/g, "");
  if (!limpo) return null;
  if (limpo.includes(",")) {
    limpo = limpo.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
    // "1.234" sem vírgula é milhar, não decimal.
    limpo = limpo.replace(/\./g, "");
  }
  if (!/^\d+(\.\d{0,2})?$/.test(limpo)) return null;
  const centavos = Math.round(Number(limpo) * 100);
  return Number.isFinite(centavos) ? centavos : null;
}

// ---------------------------------------------------------------------------
// Meses e datas

/** Chave do mês: "2026-09". */
export type ChaveMes = `${number}-${string}`;

export function chaveDoMes(data: Date): ChaveMes {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}` as ChaveMes;
}

export function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function somarMeses(chave: ChaveMes, delta: number): ChaveMes {
  const [ano, mes] = chave.split("-").map(Number);
  const d = new Date(Date.UTC(ano, mes - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}` as ChaveMes;
}

function dataDoMes(chave: ChaveMes): Date {
  const [ano, mes] = chave.split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1, 1));
}

const fmtMesAno = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });
const fmtMes = new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" });
const fmtMesCurto = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" });
const fmtDia = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const fmtDiaCurto = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: "UTC" });

/** "setembro de 2026" */
export function nomeDoMes(chave: ChaveMes): string {
  return fmtMesAno.format(dataDoMes(chave));
}

/** "setembro" */
export function nomeDoMesSemAno(chave: ChaveMes): string {
  return fmtMes.format(dataDoMes(chave));
}

/** "set" */
export function mesAbreviado(chave: ChaveMes): string {
  return fmtMesCurto.format(dataDoMes(chave)).replace(".", "");
}

export function maiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function dataISO(iso: string): Date {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia));
}

/** "sábado, 27 de setembro" */
export function nomeDoDia(iso: string): string {
  return fmtDia.format(dataISO(iso));
}

/** "27 de set." */
export function diaCurto(iso: string): string {
  return fmtDiaCurto.format(dataISO(iso));
}

export function dataValida(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = dataISO(iso);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}
