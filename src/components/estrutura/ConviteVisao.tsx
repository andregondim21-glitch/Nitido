"use client";

import { salvarPreferencias } from "@/lib/visao/preferencias";
import s from "./ConviteVisao.module.css";
import { useApp } from "./contexto";

/** Aparece até a pessoa escolher uma paleta ou dispensar o convite. */
export function ConviteVisao() {
  const { abrirVisaoDeCores } = useApp();

  return (
    <aside className={s.convite} aria-label="Ajuste de cores">
      <div className={`conteiner ${s.linha}`}>
        <p>
          <strong>Tem daltonismo?</strong> Escolha seu tipo de visão e os gráficos trocam de paleta para cada cor ficar
          distinguível.
        </p>
        <div className={s.acoes}>
          <button type="button" className="botao botao-primario" onClick={abrirVisaoDeCores}>
            Ajustar cores
          </button>
          <button type="button" className="botao botao-quieto" onClick={() => salvarPreferencias({ respondeu: true })}>
            Agora não
          </button>
        </div>
      </div>
    </aside>
  );
}
