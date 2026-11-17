"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { CATEGORIAS_SAIDA } from "@/lib/dados/categorias";
import {
  MODOS,
  SIMULACOES,
  texturasAtivas,
  type ModoVisao,
  type PreferenciaTexturas,
  type Simulacao,
} from "@/lib/visao/modos";
import { salvarPreferencias, usePreferenciasVisao } from "@/lib/visao/preferencias";
import { useApp } from "./contexto";
import s from "./PainelVisao.module.css";

const OPCOES_TEXTURA: { id: PreferenciaTexturas; nome: string }[] = [
  { id: "auto", nome: "Automático" },
  { id: "sempre", nome: "Sempre" },
  { id: "nunca", nome: "Nunca" },
];

const CATEGORIAS_COLORIDAS = CATEGORIAS_SAIDA.filter((c) => c.id !== "outros");

export function PainelVisao({ aoFechar }: { aoFechar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const preferencias = usePreferenciasVisao();
  const { simulacao, simular } = useApp();

  useEffect(() => {
    const d = dialogo.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  const fechar = () => dialogo.current?.close();

  if (!preferencias) return null;

  return (
    <dialog
      ref={dialogo}
      className={s.painel}
      aria-labelledby="visao-titulo"
      onClose={() => {
        // Ignora um "close" atrasado se o painel já foi reaberto (acontece no modo de desenvolvimento).
        if (!dialogo.current?.open) aoFechar();
      }}
      onClick={(e) => {
        // Clique no fundo escurecido fecha o painel.
        if (e.target === dialogo.current) fechar();
      }}
    >
      <div className={s.corpo}>
        <div className={s.topo}>
          <h2 id="visao-titulo">Visão de cores</h2>
          <button type="button" className="botao botao-icone botao-quieto" onClick={fechar} aria-label="Fechar">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <p className={s.intro}>
          Escolha a paleta em que você distingue melhor as amostras. Em qualquer opção, os gráficos também usam posição,
          ícones, os sinais + e − e texturas: nenhuma informação depende só da cor.
        </p>

        <fieldset className={s.modos}>
          <legend className="sr-only">Paleta dos gráficos</legend>
          {MODOS.map((modo) => (
            <label key={modo.id} className={s.modo}>
              <input
                type="radio"
                name="modo-visao"
                value={modo.id}
                checked={preferencias.modo === modo.id}
                onChange={() => salvarPreferencias({ modo: modo.id, respondeu: true })}
              />
              <span className={s.modoTexto}>
                <span className={s.modoNome}>{modo.nome}</span>
                <span className={s.modoDescricao}>{modo.descricao}</span>
              </span>
              <Amostras modo={modo.id} texturas={texturasAtivas({ ...preferencias, modo: modo.id })} />
            </label>
          ))}
        </fieldset>

        <p className={s.ajuda}>
          Não sabe qual é o seu tipo? Escolha a opção em que as oito amostras parecem mais diferentes entre si. Formas
          leves (protanomalia, deuteranomalia e tritanomalia) funcionam bem com a paleta do tipo correspondente.
        </p>

        <fieldset className={`${s.grupo} ${s.grupoOpcoes}`}>
          <legend className={s.rotulo}>Texturas nos gráficos</legend>
          <div className="segmentos">
            {OPCOES_TEXTURA.map((opcao) => (
              <label key={opcao.id}>
                <input
                  type="radio"
                  name="texturas"
                  value={opcao.id}
                  checked={preferencias.texturas === opcao.id}
                  onChange={() => salvarPreferencias({ texturas: opcao.id })}
                />
                {opcao.nome}
              </label>
            ))}
          </div>
          <p className="dica-campo">
            Listras e pontos separam as categorias mesmo sem cor. No automático, aparecem nos modos de daltonismo.
          </p>
        </fieldset>

        <div className={s.grupo}>
          <label htmlFor="simulacao" className={s.rotulo}>
            Ver como uma pessoa com daltonismo enxerga
          </label>
          <select
            id="simulacao"
            className={`entrada ${s.seletor}`}
            value={simulacao}
            onChange={(e) => simular(e.target.value as Simulacao)}
          >
            {SIMULACOES.map((opcao) => (
              <option key={opcao.id} value={opcao.id}>
                {opcao.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={s.rodape}>
          <button type="button" className="botao botao-primario" onClick={fechar}>
            Pronto
          </button>
        </div>
      </div>
    </dialog>
  );
}

function Amostras({ modo, texturas }: { modo: ModoVisao; texturas: boolean }) {
  return (
    <span className={s.amostras} data-visao={modo} data-texturas={texturas ? "sim" : "nao"} aria-hidden="true">
      {CATEGORIAS_COLORIDAS.map((c) => (
        <span key={c.id} data-cat={c.id} className={`preenchimento ${s.pinta}`} />
      ))}
    </span>
  );
}
