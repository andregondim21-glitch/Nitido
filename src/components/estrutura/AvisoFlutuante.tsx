"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import s from "./AvisoFlutuante.module.css";
import type { AvisoRapido } from "./contexto";

type Props = {
  aviso: (AvisoRapido & { id: number }) | null;
  aoSumir: () => void;
};

/** A região "status" fica sempre montada para leitores de tela anunciarem cada aviso. */
export function AvisoFlutuante({ aviso, aoSumir }: Props) {
  useEffect(() => {
    if (!aviso) return;
    const tempo = setTimeout(aoSumir, aviso.acao ? 8000 : 5000);
    return () => clearTimeout(tempo);
  }, [aviso, aoSumir]);

  return (
    <div className={s.regiao} role="status">
      {aviso && (
        <div key={aviso.id} className={s.aviso}>
          <span>{aviso.texto}</span>
          {aviso.acao && (
            <button
              type="button"
              className={s.acao}
              onClick={() => {
                aviso.acao?.fazer();
                aoSumir();
              }}
            >
              {aviso.acao.rotulo}
            </button>
          )}
          <button type="button" className={s.fechar} onClick={aoSumir} aria-label="Fechar aviso">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
