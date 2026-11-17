"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { doMes, ordenarPorData, resumir } from "@/lib/calculos";
import { useDados } from "@/lib/dados/armazenamento";
import { CATEGORIAS_ENTRADA, CATEGORIAS_SAIDA, categoria } from "@/lib/dados/categorias";
import type { CategoriaId, Lancamento, TipoLancamento } from "@/lib/dados/tipos";
import { formatarComSinal, formatarMoeda, maiuscula, nomeDoDia, nomeDoMes } from "@/lib/formato";
import { CabecalhoPagina } from "../comum/CabecalhoPagina";
import { Carregando } from "../comum/Carregando";
import { LinhaLancamento } from "../comum/LinhaLancamento";
import { useApp } from "../estrutura/contexto";
import s from "./Lancamentos.module.css";

type FiltroTipo = "todos" | TipoLancamento;

const FILTROS_TIPO: { id: FiltroTipo; nome: string }[] = [
  { id: "todos", nome: "Todos" },
  { id: "entrada", nome: "Entradas" },
  { id: "saida", nome: "Saídas" },
];

/** Tira acentos e caixa para a busca achar "saude" em "Saúde". */
const normalizar = (texto: string) => texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function Lancamentos() {
  const dados = useDados();
  const { mes, novoLancamento, editarLancamento } = useApp();
  const [tipo, setTipo] = useState<FiltroTipo>("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaId | "todas">("todas");
  const [busca, setBusca] = useState("");

  if (!dados) return <Carregando />;

  const doMesAtual = doMes(dados.lancamentos, mes);
  const termo = normalizar(busca.trim());
  const filtrados = ordenarPorData(doMesAtual).filter(
    (l) =>
      (tipo === "todos" || l.tipo === tipo) &&
      (categoriaFiltro === "todas" || l.categoria === categoriaFiltro) &&
      (!termo || normalizar(`${l.descricao} ${categoria(l.categoria).nome}`).includes(termo)),
  );
  const filtrando = tipo !== "todos" || categoriaFiltro !== "todas" || termo !== "";
  const totais = resumir(filtrados);

  const dias = new Map<string, Lancamento[]>();
  for (const l of filtrados) dias.set(l.data, [...(dias.get(l.data) ?? []), l]);

  const limparFiltros = () => {
    setTipo("todos");
    setCategoriaFiltro("todas");
    setBusca("");
  };

  return (
    <div className="conteiner">
      <CabecalhoPagina pagina="Lançamentos" />

      <div className={s.filtros} role="search" aria-label="Filtrar lançamentos">
        <fieldset className={s.grupoTipo}>
          <legend className="sr-only">Tipo</legend>
          <div className="segmentos">
            {FILTROS_TIPO.map((f) => (
              <label key={f.id}>
                <input type="radio" name="filtro-tipo" checked={tipo === f.id} onChange={() => setTipo(f.id)} />
                {f.nome}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="campo">
          <label htmlFor="filtro-categoria" className="sr-only">
            Categoria
          </label>
          <select
            id="filtro-categoria"
            className="entrada"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value as CategoriaId | "todas")}
          >
            <option value="todas">Todas as categorias</option>
            <optgroup label="Saídas">
              {CATEGORIAS_SAIDA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </optgroup>
            <optgroup label="Entradas">
              {CATEGORIAS_ENTRADA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className={`campo ${s.busca}`}>
          <label htmlFor="filtro-busca" className="sr-only">
            Buscar por descrição
          </label>
          <input
            id="filtro-busca"
            type="search"
            className="entrada"
            placeholder="Buscar por descrição"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {filtrados.length > 0 && (
        <p className={s.totais} aria-live="polite">
          {filtrados.length} {filtrados.length === 1 ? "lançamento" : "lançamentos"}. Entradas{" "}
          <strong>{formatarMoeda(totais.entradas)}</strong>, saídas <strong>{formatarMoeda(totais.saidas)}</strong>.
        </p>
      )}

      {filtrados.length === 0 ? (
        <div className={s.vazio}>
          {filtrando && doMesAtual.length > 0 ? (
            <>
              <p>Nenhum lançamento de {nomeDoMes(mes)} combina com esses filtros.</p>
              <button type="button" className="botao" onClick={limparFiltros}>
                Limpar filtros
              </button>
            </>
          ) : (
            <>
              <p>Nenhum lançamento em {nomeDoMes(mes)}. Registre uma entrada ou uma saída para começar.</p>
              <button type="button" className="botao botao-primario" onClick={novoLancamento}>
                <Plus size={20} strokeWidth={2.6} aria-hidden="true" />
                Novo lançamento
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={s.dias}>
          {[...dias.entries()].map(([data, itens]) => {
            const saldo = resumir(itens).saldo;
            return (
              <section key={data} aria-labelledby={`dia-${data}`}>
                <h2 id={`dia-${data}`} className={s.dia}>
                  <span>{maiuscula(nomeDoDia(data))}</span>
                  <span className={s.saldoDia}>
                    <span className="sr-only">Saldo do dia: </span>
                    {formatarComSinal(Math.abs(saldo), saldo < 0 ? "saida" : "entrada")}
                  </span>
                </h2>
                <ul role="list">
                  {itens.map((l) => (
                    <LinhaLancamento key={l.id} lancamento={l} aoEditar={editarLancamento} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
