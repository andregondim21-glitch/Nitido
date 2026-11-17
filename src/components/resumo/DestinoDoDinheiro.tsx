"use client";

import { useState } from "react";
import type { FatiaDeGasto } from "@/lib/calculos";
import { categoria } from "@/lib/dados/categorias";
import type { CategoriaSaida } from "@/lib/dados/tipos";
import { formatarMoeda, formatarPorcentagem } from "@/lib/formato";
import s from "./DestinoDoDinheiro.module.css";

type Props = {
  fatias: FatiaDeGasto[];
  total: number;
  nomeMes: string;
  nomeMesAnterior: string;
};

function variacao(f: FatiaDeGasto, nomeMesAnterior: string) {
  if (!f.anterior) {
    return (
      <>
        <span aria-hidden="true">—</span>
        <span className="sr-only">sem gasto em {nomeMesAnterior}</span>
      </>
    );
  }
  const v = (f.total - f.anterior) / f.anterior;
  if (Math.abs(v) < 0.005) return "igual";
  return `${v > 0 ? "+" : "−"}${formatarPorcentagem(Math.abs(v))}`;
}

/**
 * Parte do todo numa faixa só (barra empilhada), com a tabela logo abaixo fazendo
 * de legenda e de versão acessível. Passar o mouse numa linha destaca o trecho.
 */
export function DestinoDoDinheiro({ fatias, total, nomeMes, nomeMesAnterior }: Props) {
  const [realce, setRealce] = useState<CategoriaSaida | null>(null);

  if (fatias.length === 0) {
    return (
      <section className={s.secao} aria-labelledby="destino-titulo">
        <h2 id="destino-titulo" className={s.titulo}>
          Para onde foi o dinheiro
        </h2>
        <p className={s.vazio}>Nenhuma saída registrada em {nomeMes}. Quando houver, a divisão por categoria aparece aqui.</p>
      </section>
    );
  }

  // Centro de cada trecho na faixa (0 a 1), para posicionar a dica.
  const trechos = fatias.map((f, i) => ({
    ...f,
    centro: fatias.slice(0, i).reduce((soma, anterior) => soma + anterior.parcela, 0) + f.parcela / 2,
  }));
  const destacado = trechos.find((t) => t.categoria === realce);

  return (
    <section className={s.secao} aria-labelledby="destino-titulo">
      <h2 id="destino-titulo" className={s.titulo}>
        Para onde foi o dinheiro
      </h2>
      <p className={s.sub}>
        {formatarMoeda(total)} em saídas, divididos por categoria.
      </p>

      <div className={s.area}>
        <div className={s.faixa} aria-hidden="true" onPointerLeave={() => setRealce(null)}>
          {trechos.map((t) => (
            <div
              key={t.categoria}
              data-cat={t.categoria}
              className={`preenchimento ${s.trecho}`}
              data-apagado={(realce && realce !== t.categoria) || undefined}
              style={{ flexGrow: t.parcela }}
              onPointerEnter={() => setRealce(t.categoria)}
            />
          ))}
        </div>
        {destacado && (
          <div className={s.dica} style={{ "--x": `${destacado.centro * 100}%` } as React.CSSProperties} aria-hidden="true">
            <strong>{formatarMoeda(destacado.total)}</strong>
            <span>
              {categoria(destacado.categoria).nome}, {formatarPorcentagem(destacado.parcela)}
            </span>
          </div>
        )}
      </div>

      <table className={s.tabela}>
        <caption className="sr-only">Saídas de {nomeMes} por categoria</caption>
        <thead>
          <tr>
            <th scope="col">Categoria</th>
            <th scope="col">Valor</th>
            <th scope="col">Parcela</th>
            <th scope="col">
              <span className={s.cabecalhoLongo}>Comparado a {nomeMesAnterior}</span>
              <span className={s.cabecalhoCurto} aria-hidden="true">
                vs. {nomeMesAnterior.slice(0, 3)}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {fatias.map((f) => (
            <tr
              key={f.categoria}
              data-realce={realce === f.categoria || undefined}
              onPointerEnter={() => setRealce(f.categoria)}
              onPointerLeave={() => setRealce(null)}
            >
              <th scope="row">
                <span className={s.nome}>
                  <span data-cat={f.categoria} className={`preenchimento ${s.amostra}`} aria-hidden="true" />
                  {categoria(f.categoria).nome}
                </span>
              </th>
              <td>{formatarMoeda(f.total)}</td>
              <td>{formatarPorcentagem(f.parcela)}</td>
              <td className={s.variacao}>{variacao(f, nomeMesAnterior)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
