import { useSyncExternalStore } from "react";
import {
  CHAVE_VISAO,
  IDS_MODOS,
  PREFERENCIAS_INICIAIS,
  texturasAtivas,
  type ModoVisao,
  type PreferenciasVisao,
} from "./modos";

export function aplicarNoDocumento(p: PreferenciasVisao) {
  const raiz = document.documentElement;
  raiz.dataset.visao = p.modo;
  raiz.dataset.texturas = texturasAtivas(p) ? "sim" : "nao";
}

// --- armazenamento --------------------------------------------------------------

let atuais: PreferenciasVisao | null = null;
const ouvintes = new Set<() => void>();

function ler(): PreferenciasVisao {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE_VISAO) ?? "null") as Partial<PreferenciasVisao> | null;
    if (bruto && typeof bruto === "object") {
      return {
        modo: IDS_MODOS.includes(bruto.modo as ModoVisao) ? (bruto.modo as ModoVisao) : "padrao",
        texturas: bruto.texturas === "sempre" || bruto.texturas === "nunca" ? bruto.texturas : "auto",
        respondeu: bruto.respondeu === true,
      };
    }
  } catch {
    // Armazenamento bloqueado ou valor inválido: usa as preferências iniciais.
  }
  return PREFERENCIAS_INICIAIS;
}

function obter(): PreferenciasVisao {
  return (atuais ??= ler());
}

function assinar(avisar: () => void) {
  ouvintes.add(avisar);
  return () => ouvintes.delete(avisar);
}

export function usePreferenciasVisao(): PreferenciasVisao | null {
  return useSyncExternalStore(assinar, obter, () => null);
}

export function salvarPreferencias(mudancas: Partial<PreferenciasVisao>) {
  atuais = { ...obter(), ...mudancas };
  try {
    localStorage.setItem(CHAVE_VISAO, JSON.stringify(atuais));
  } catch {
    // Sem armazenamento: a escolha vale até fechar a aba.
  }
  aplicarNoDocumento(atuais);
  ouvintes.forEach((avisar) => avisar());
}
