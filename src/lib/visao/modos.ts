// Modos de visão de cores: constantes e regras puras, usadas no servidor e no navegador.

export type ModoVisao = "padrao" | "protanopia" | "deuteranopia" | "tritanopia";
export type PreferenciaTexturas = "auto" | "sempre" | "nunca";
export type Simulacao = "nenhuma" | "protan" | "deutan" | "tritan" | "acromatopsia";

export interface PreferenciasVisao {
  modo: ModoVisao;
  texturas: PreferenciaTexturas;
  /** A pessoa já escolheu um modo ou dispensou o convite da primeira visita. */
  respondeu: boolean;
}

export const MODOS: { id: ModoVisao; nome: string; descricao: string }[] = [
  { id: "padrao", nome: "Padrão", descricao: "Para visão de cores típica." },
  {
    id: "protanopia",
    nome: "Protanopia",
    descricao: "Pouca ou nenhuma percepção do vermelho. Vermelhos parecem escuros e se confundem com verdes.",
  },
  {
    id: "deuteranopia",
    nome: "Deuteranopia",
    descricao: "Pouca ou nenhuma percepção do verde. Verdes, amarelos e vermelhos se confundem. É a forma mais comum.",
  },
  {
    id: "tritanopia",
    nome: "Tritanopia",
    descricao: "Pouca ou nenhuma percepção do azul. Azul se confunde com verde, e amarelo com rosa. É a forma mais rara.",
  },
];

export const SIMULACOES: { id: Simulacao; nome: string }[] = [
  { id: "nenhuma", nome: "Desligada" },
  { id: "protan", nome: "Protanopia" },
  { id: "deutan", nome: "Deuteranopia" },
  { id: "tritan", nome: "Tritanopia" },
  { id: "acromatopsia", nome: "Sem cores (acromatopsia)" },
];

export const CHAVE_VISAO = "nitido:visao";
export const IDS_MODOS = MODOS.map((m) => m.id);
export const PREFERENCIAS_INICIAIS: PreferenciasVisao = { modo: "padrao", texturas: "auto", respondeu: false };

export function nomeDoModo(modo: ModoVisao): string {
  return MODOS.find((m) => m.id === modo)?.nome ?? "Padrão";
}

/** No automático, as texturas ligam em qualquer modo de daltonismo. */
export function texturasAtivas(p: PreferenciasVisao): boolean {
  return p.texturas === "sempre" || (p.texturas === "auto" && p.modo !== "padrao");
}

/**
 * Roda no <head>, antes da primeira pintura, para a página já nascer com a paleta
 * certa. Repete a regra de texturasAtivas; mantenha as duas iguais.
 */
export const SCRIPT_VISAO = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(CHAVE_VISAO)})||"null");if(!p)return;var m=${JSON.stringify(IDS_MODOS)}.indexOf(p.modo)>=0?p.modo:"padrao";var t=p.texturas==="sempre"||(p.texturas!=="nunca"&&m!=="padrao");var h=document.documentElement;h.setAttribute("data-visao",m);h.setAttribute("data-texturas",t?"sim":"nao")}catch(e){}})()`;
