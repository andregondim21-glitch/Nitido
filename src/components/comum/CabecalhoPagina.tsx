"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { maiuscula, nomeDoMes, nomeDoMesSemAno, somarMeses } from "@/lib/formato";
import { useApp } from "../estrutura/contexto";
import s from "./CabecalhoPagina.module.css";

/** Título da página é o mês em exibição; as setas trocam o mês de todas as páginas. */
export function CabecalhoPagina({ pagina, children }: { pagina: string; children?: React.ReactNode }) {
  const { mes, mesAtual, irParaMes } = useApp();
  const anterior = somarMeses(mes, -1);
  const proximo = somarMeses(mes, 1);

  return (
    <div className={s.cabecalho}>
      <div className={s.navegacao}>
        <button
          type="button"
          className="botao botao-icone"
          onClick={() => irParaMes(anterior)}
          aria-label={`Mês anterior: ${nomeDoMes(anterior)}`}
        >
          <ChevronLeft size={22} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="botao botao-icone"
          onClick={() => irParaMes(proximo)}
          aria-label={`Próximo mês: ${nomeDoMes(proximo)}`}
        >
          <ChevronRight size={22} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
      <h1 className={s.titulo} aria-live="polite">
        <span className="sr-only">{pagina} de </span>
        {maiuscula(nomeDoMes(mes))}
      </h1>
      {mes !== mesAtual && (
        <button type="button" className={`botao botao-quieto ${s.voltar}`} onClick={() => irParaMes(mesAtual)}>
          Voltar para {nomeDoMesSemAno(mesAtual)}
        </button>
      )}
      {children && <div className={s.extra}>{children}</div>}
    </div>
  );
}
