"use client";

import { Eye } from "lucide-react";
import { SIMULACOES } from "@/lib/visao/modos";
import { useApp } from "./contexto";
import s from "./Simulacao.module.css";

// Matrizes de Machado, Oliveira & Fernandes (2009), severidade 1.0, aplicadas em
// RGB linear (o espaço padrão dos filtros SVG). As mesmas do script de validação.
const MATRIZES = {
  protan: "0.152286 1.052583 -0.204868 0 0  0.114503 0.786281 0.099216 0 0  -0.003882 -0.048116 1.051998 0 0  0 0 0 1 0",
  deutan: "0.367322 0.860646 -0.227968 0 0  0.280085 0.672501 0.047413 0 0  -0.011820 0.042940 0.968881 0 0  0 0 0 1 0",
  tritan: "1.255528 -0.076749 -0.178779 0 0  -0.078411 0.930809 0.147602 0 0  0.004733 0.691367 0.303900 0 0  0 0 0 1 0",
};

export function FiltrosSimulacao() {
  return (
    <svg className={s.filtros} aria-hidden="true" focusable="false">
      {Object.entries(MATRIZES).map(([id, valores]) => (
        <filter key={id} id={`simular-${id}`} colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={valores} />
        </filter>
      ))}
      <filter id="simular-acromatopsia" colorInterpolationFilters="linearRGB">
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
  );
}

export function FaixaSimulacao() {
  const { simulacao, simular } = useApp();
  const nome = SIMULACOES.find((x) => x.id === simulacao)?.nome ?? "";

  return (
    <div className={s.faixa} role="region" aria-label="Simulação de visão ativa">
      <div className={`conteiner ${s.linha}`}>
        <p>
          <Eye size={20} aria-hidden="true" className={s.icone} />
          <span>
            Simulando <strong>{nome.toLowerCase()}</strong>. É uma prévia: a paleta escolhida continua a mesma.
          </span>
        </p>
        <button type="button" className="botao botao-primario" onClick={() => simular("nenhuma")}>
          Parar simulação
        </button>
      </div>
    </div>
  );
}
