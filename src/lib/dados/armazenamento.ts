import { useSyncExternalStore } from "react";
import { dataValida } from "../formato";
import { categoriaExiste } from "./categorias";
import { criarDadosDeExemplo } from "./exemplo";
import type { Dados, Lancamento, NovoLancamento } from "./tipos";

// Os dados moram só no navegador (localStorage). Este módulo é a única porta de
// entrada: lê uma vez, guarda em memória e avisa quem estiver ouvindo a cada mudança.

const CHAVE = "nitido:dados:v1";

let atual: Dados | null = null;
const ouvintes = new Set<() => void>();

function ehLancamento(valor: unknown): valor is Lancamento {
  if (!valor || typeof valor !== "object") return false;
  const l = valor as Lancamento;
  return (
    typeof l.id === "string" &&
    (l.tipo === "entrada" || l.tipo === "saida") &&
    typeof l.descricao === "string" &&
    Number.isInteger(l.valor) &&
    l.valor > 0 &&
    typeof l.data === "string" &&
    dataValida(l.data) &&
    categoriaExiste(l.categoria, l.tipo)
  );
}

function normalizar(bruto: unknown): Dados | null {
  if (!bruto || typeof bruto !== "object") return null;
  const b = bruto as Partial<Dados>;
  if (b.versao !== 1 || !Array.isArray(b.lancamentos)) return null;
  return { versao: 1, lancamentos: b.lancamentos.filter(ehLancamento) };
}

function gravar(dados: Dados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // Sem espaço ou armazenamento bloqueado: o app segue funcionando só em memória.
  }
}

function carregar(): Dados {
  let bruto: string | null = null;
  try {
    bruto = localStorage.getItem(CHAVE);
  } catch {
    // Armazenamento bloqueado: começa com os dados de exemplo.
  }
  if (bruto) {
    try {
      const dados = normalizar(JSON.parse(bruto));
      if (dados) return dados;
    } catch {
      // JSON inválido: cai no bloco abaixo.
    }
    // Guarda a cópia ilegível antes de recomeçar, para nada se perder em silêncio.
    try {
      localStorage.setItem(`${CHAVE}:ilegivel`, bruto);
    } catch {}
  }
  const exemplo = criarDadosDeExemplo(new Date());
  gravar(exemplo);
  return exemplo;
}

function obter(): Dados {
  return (atual ??= carregar());
}

function avisarTodos() {
  ouvintes.forEach((avisar) => avisar());
}

function aoMudarEmOutraAba(evento: StorageEvent) {
  if (evento.key !== CHAVE) return;
  atual = null;
  avisarTodos();
}

function assinar(avisar: () => void) {
  if (ouvintes.size === 0) window.addEventListener("storage", aoMudarEmOutraAba);
  ouvintes.add(avisar);
  return () => {
    ouvintes.delete(avisar);
    if (ouvintes.size === 0) window.removeEventListener("storage", aoMudarEmOutraAba);
  };
}

function atualizar(mudar: (dados: Dados) => Dados) {
  atual = mudar(obter());
  gravar(atual);
  avisarTodos();
}

/** No servidor e durante a hidratação o valor é null: os dados só existem no navegador. */
export function useDados(): Dados | null {
  return useSyncExternalStore(assinar, obter, () => null);
}

function novoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const financas = {
  adicionar(novo: NovoLancamento): Lancamento {
    const lancamento = { ...novo, id: novoId() };
    atualizar((d) => ({ ...d, lancamentos: [...d.lancamentos, lancamento] }));
    return lancamento;
  },

  editar(lancamento: Lancamento) {
    atualizar((d) => ({
      ...d,
      lancamentos: d.lancamentos.map((l) => (l.id === lancamento.id ? lancamento : l)),
    }));
  },

  remover(id: string) {
    atualizar((d) => ({ ...d, lancamentos: d.lancamentos.filter((l) => l.id !== id) }));
  },

  /** Desfaz uma exclusão. */
  devolver(lancamento: Lancamento) {
    atualizar((d) =>
      d.lancamentos.some((l) => l.id === lancamento.id) ? d : { ...d, lancamentos: [...d.lancamentos, lancamento] },
    );
  },

  usarExemplo() {
    atualizar(() => criarDadosDeExemplo(new Date()));
  },

  /** Apaga tudo e devolve o que havia, para permitir desfazer. */
  apagarTudo(): Dados {
    const anterior = obter();
    atualizar(() => ({ versao: 1, lancamentos: [] }));
    return anterior;
  },

  substituir(dados: Dados) {
    atualizar(() => dados);
  },
};
