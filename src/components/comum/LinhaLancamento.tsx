import { categoria } from "@/lib/dados/categorias";
import type { Lancamento } from "@/lib/dados/tipos";
import { diaCurto, formatarComSinal } from "@/lib/formato";
import s from "./LinhaLancamento.module.css";
import { SeloCategoria } from "./Selos";

type Props = {
  lancamento: Lancamento;
  aoEditar: (lancamento: Lancamento) => void;
  mostrarData?: boolean;
};

/** Valores em tinta, com sinal: entrada é "+", saída é "−". A cor fica no selo ao lado. */
export function LinhaLancamento({ lancamento, aoEditar, mostrarData = false }: Props) {
  const { nome } = categoria(lancamento.categoria);
  return (
    <li>
      <button type="button" className={s.linha} onClick={() => aoEditar(lancamento)}>
        <SeloCategoria id={lancamento.categoria} />
        <span className={s.texto}>
          <span className={s.descricao}>{lancamento.descricao}</span>
          <span className={s.meta}>
            {nome}
            {mostrarData && `, ${diaCurto(lancamento.data)}`}
          </span>
        </span>
        <span className={s.valor} data-tipo={lancamento.tipo}>
          <span className="sr-only">{lancamento.tipo === "entrada" ? "Entrada de" : "Saída de"} </span>
          {formatarComSinal(lancamento.valor, lancamento.tipo)}
        </span>
        <span className="sr-only">. Editar</span>
      </button>
    </li>
  );
}
