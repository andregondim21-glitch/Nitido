"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { doMes, gastosPorCategoria, ordenarPorData, resumir, serieMensal } from "@/lib/calculos";
import { useDados } from "@/lib/dados/armazenamento";
import { nomeDoMes, nomeDoMesSemAno, somarMeses } from "@/lib/formato";
import { CabecalhoPagina } from "../comum/CabecalhoPagina";
import { Carregando } from "../comum/Carregando";
import { LinhaLancamento } from "../comum/LinhaLancamento";
import { useApp } from "../estrutura/contexto";
import { ContaArmada } from "./ContaArmada";
import { DestinoDoDinheiro } from "./DestinoDoDinheiro";
import { EntradasESaidas } from "./EntradasESaidas";
import s from "./Resumo.module.css";

export function Resumo() {
  const dados = useDados();
  const { mes, irParaMes, editarLancamento, novoLancamento } = useApp();

  if (!dados) return <Carregando />;

  const doMesAtual = doMes(dados.lancamentos, mes);
  const anterior = somarMeses(mes, -1);
  const resumo = resumir(doMesAtual);
  const recentes = ordenarPorData(doMesAtual).slice(0, 6);

  return (
    <div className="conteiner">
      <CabecalhoPagina pagina="Resumo" />

      <div className={s.grade}>
        <div className={s.conta}>
          <ContaArmada resumo={resumo} nomeMes={nomeDoMes(mes)} />
        </div>

        <div className={s.fluxo}>
          <EntradasESaidas serie={serieMensal(dados.lancamentos, mes)} mes={mes} aoEscolherMes={irParaMes} />
        </div>

        <div className={s.destino}>
          <DestinoDoDinheiro
            fatias={gastosPorCategoria(doMesAtual, doMes(dados.lancamentos, anterior))}
            total={resumo.saidas}
            nomeMes={nomeDoMes(mes)}
            nomeMesAnterior={nomeDoMesSemAno(anterior)}
          />
        </div>

        <section className={s.recentes} aria-labelledby="recentes-titulo">
          <div className={s.topo}>
            <h2 id="recentes-titulo" className={s.titulo}>
              Últimos lançamentos
            </h2>
            {doMesAtual.length > recentes.length && (
              <Link href="/lancamentos" className="link">
                Ver todos os {doMesAtual.length}
              </Link>
            )}
          </div>
          {recentes.length ? (
            <ul role="list" className={s.lista}>
              {recentes.map((l) => (
                <LinhaLancamento key={l.id} lancamento={l} aoEditar={editarLancamento} mostrarData />
              ))}
            </ul>
          ) : (
            <div className={s.vazio}>
              <p>Os lançamentos de {nomeDoMes(mes)} aparecem aqui.</p>
              <button type="button" className="botao botao-primario" onClick={novoLancamento}>
                <Plus size={20} strokeWidth={2.6} aria-hidden="true" />
                Novo lançamento
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
