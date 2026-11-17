"use client";

import { useState } from "react";
import { tetoRedondo, type PontoMensal } from "@/lib/calculos";
import {
  formatarCompacto,
  formatarComSinal,
  formatarMoeda,
  maiuscula,
  mesAbreviado,
  nomeDoMes,
  nomeDoMesSemAno,
  type ChaveMes,
} from "@/lib/formato";
import s from "./EntradasESaidas.module.css";

type Props = {
  serie: PontoMensal[];
  mes: ChaveMes;
  aoEscolherMes: (mes: ChaveMes) => void;
};

/**
 * Barras divergentes: entradas sobem, saídas descem a partir da mesma linha.
 * A posição já separa as duas séries; a cor só reforça.
 */
export function EntradasESaidas({ serie, mes, aoEscolherMes }: Props) {
  const [verTabela, setVerTabela] = useState(false);
  const [ativo, setAtivo] = useState<ChaveMes | null>(null);

  const maior = Math.max(0, ...serie.flatMap((p) => [p.entradas, p.saidas]));
  const teto = tetoRedondo(Math.max(maior, 100000));
  const marcas = [teto, teto / 2, 0, teto / 2, teto];

  return (
    <section className={s.secao} aria-labelledby="fluxo-titulo">
      <div className={s.topo}>
        <h2 id="fluxo-titulo" className={s.titulo}>
          Entradas e saídas
        </h2>
        <button type="button" className="botao botao-quieto" onClick={() => setVerTabela(!verTabela)}>
          {verTabela ? "Ver gráfico" : "Ver tabela"}
        </button>
      </div>
      <p className={s.sub}>Os seis meses até {nomeDoMesSemAno(mes)}. Escolha um mês para ver o resumo dele.</p>

      {verTabela ? (
        <table className={s.tabela}>
          <caption className="sr-only">Entradas e saídas dos seis meses até {nomeDoMes(mes)}</caption>
          <thead>
            <tr>
              <th scope="col">Mês</th>
              <th scope="col">Entradas</th>
              <th scope="col">Saídas</th>
              <th scope="col">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {serie.map((p) => {
              const saldo = p.entradas - p.saidas;
              return (
                <tr key={p.mes} data-atual={p.mes === mes || undefined}>
                  <th scope="row">{maiuscula(nomeDoMes(p.mes))}</th>
                  <td>{formatarMoeda(p.entradas)}</td>
                  <td>{formatarMoeda(p.saidas)}</td>
                  <td>{formatarComSinal(Math.abs(saldo), saldo < 0 ? "saida" : "entrada")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <>
          <ul className={s.legenda} role="list">
            <li>
              <span className={`preenchimento ${s.chave}`} data-fluxo="entrada" aria-hidden="true" />
              Entradas, acima da linha
            </li>
            <li>
              <span className={`preenchimento ${s.chave}`} data-fluxo="saida" aria-hidden="true" />
              Saídas, abaixo da linha
            </li>
          </ul>

          <div className={s.grafico}>
            <div className={s.eixo} aria-hidden="true">
              {marcas.map((valor, i) => (
                <span key={i} style={{ top: `${i * 25}%` }}>
                  {formatarCompacto(valor)}
                </span>
              ))}
            </div>

            <div className={s.plano}>
              <div className={s.grade} aria-hidden="true">
                {[0, 25, 50, 75, 100].map((y) => (
                  <span key={y} style={{ top: `${y}%` }} data-zero={y === 50 || undefined} />
                ))}
              </div>

              <ol className={s.colunas} role="list">
                {serie.map((p, i) => {
                  const saldo = p.entradas - p.saidas;
                  const nome = maiuscula(nomeDoMes(p.mes));
                  return (
                    <li key={p.mes}>
                      <button
                        type="button"
                        className={s.coluna}
                        aria-current={p.mes === mes ? "date" : undefined}
                        aria-label={`${nome}: entradas ${formatarMoeda(p.entradas)}, saídas ${formatarMoeda(p.saidas)}, saldo ${saldo < 0 ? "negativo de " : ""}${formatarMoeda(Math.abs(saldo))}. Ver resumo do mês.`}
                        onClick={() => aoEscolherMes(p.mes)}
                        onPointerEnter={() => setAtivo(p.mes)}
                        onPointerLeave={() => setAtivo(null)}
                        onFocus={() => setAtivo(p.mes)}
                        onBlur={() => setAtivo(null)}
                      >
                        <span className={s.pista}>
                          <span
                            className={`preenchimento ${s.barra} ${s.sobe}`}
                            data-fluxo="entrada"
                            style={{ height: `${(p.entradas / teto) * 50}%` }}
                          />
                          <span
                            className={`preenchimento ${s.barra} ${s.desce}`}
                            data-fluxo="saida"
                            style={{ height: `${(p.saidas / teto) * 50}%` }}
                          />
                        </span>
                        <span className={s.mes}>{mesAbreviado(p.mes)}</span>
                      </button>

                      {ativo === p.mes && (
                        <div className={s.dica} data-lado={i < serie.length / 2 ? "direita" : "esquerda"} aria-hidden="true">
                          <p className={s.dicaTitulo}>{nome}</p>
                          <dl>
                            <dt>
                              <span className={s.traco} data-fluxo="entrada" />
                              Entradas
                            </dt>
                            <dd>{formatarMoeda(p.entradas)}</dd>
                            <dt>
                              <span className={s.traco} data-fluxo="saida" />
                              Saídas
                            </dt>
                            <dd>{formatarMoeda(p.saidas)}</dd>
                            <dt className={s.saldo}>Saldo</dt>
                            <dd className={s.saldo}>{formatarComSinal(Math.abs(saldo), saldo < 0 ? "saida" : "entrada")}</dd>
                          </dl>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
