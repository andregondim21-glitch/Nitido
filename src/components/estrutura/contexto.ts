"use client";

import { createContext, useContext } from "react";
import type { Lancamento } from "@/lib/dados/tipos";
import type { ChaveMes } from "@/lib/formato";
import type { Simulacao } from "@/lib/visao/modos";

export interface AvisoRapido {
  texto: string;
  acao?: { rotulo: string; fazer: () => void };
}

export interface ContextoApp {
  /** Mês em exibição em todas as páginas. */
  mes: ChaveMes;
  mesAtual: ChaveMes;
  irParaMes: (mes: ChaveMes) => void;
  novoLancamento: () => void;
  editarLancamento: (lancamento: Lancamento) => void;
  abrirVisaoDeCores: () => void;
  avisar: (aviso: AvisoRapido) => void;
  simulacao: Simulacao;
  simular: (simulacao: Simulacao) => void;
}

export const Contexto = createContext<ContextoApp | null>(null);

export function useApp(): ContextoApp {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useApp precisa estar dentro de <Estrutura>.");
  return valor;
}
