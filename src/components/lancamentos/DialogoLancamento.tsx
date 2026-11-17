"use client";

import { CircleAlert, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { financas } from "@/lib/dados/armazenamento";
import { categoriaExiste, categoriasDoTipo } from "@/lib/dados/categorias";
import type { CategoriaId, Lancamento, TipoLancamento } from "@/lib/dados/tipos";
import { dataValida, formatarNumero, hojeISO, lerValor, nomeDoMes, type ChaveMes } from "@/lib/formato";
import { SeloCategoria } from "../comum/Selos";
import { useApp } from "../estrutura/contexto";
import s from "./DialogoLancamento.module.css";

type Erros = Partial<Record<"valor" | "descricao" | "data", string>>;

const CATEGORIA_INICIAL: Record<TipoLancamento, CategoriaId> = { saida: "mercado", entrada: "salario" };
const VALOR_MAXIMO = 10_000_000_00; // R$ 10 milhões, em centavos

function dataInicial(mes: ChaveMes, mesAtual: ChaveMes): string {
  return mes === mesAtual ? hojeISO() : `${mes}-01`;
}

export function DialogoLancamento({ lancamento, aoFechar }: { lancamento: Lancamento | null; aoFechar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const { mes, mesAtual, irParaMes, avisar } = useApp();
  const editando = lancamento !== null;

  const [tipo, setTipo] = useState<TipoLancamento>(lancamento?.tipo ?? "saida");
  const [valor, setValor] = useState(lancamento ? formatarNumero(lancamento.valor) : "");
  const [descricao, setDescricao] = useState(lancamento?.descricao ?? "");
  const [categoriaId, setCategoriaId] = useState<CategoriaId>(lancamento?.categoria ?? CATEGORIA_INICIAL.saida);
  const [data, setData] = useState(lancamento?.data ?? dataInicial(mes, mesAtual));
  const [erros, setErros] = useState<Erros>({});

  const campoValor = useRef<HTMLInputElement>(null);
  const campoDescricao = useRef<HTMLInputElement>(null);
  const campoData = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const d = dialogo.current;
    d?.showModal();
    // O foco começa no valor, o primeiro dado que a pessoa preenche.
    campoValor.current?.focus();
    return () => d?.close();
  }, []);

  const fechar = () => dialogo.current?.close();

  const trocarTipo = (novo: TipoLancamento) => {
    setTipo(novo);
    if (!categoriaExiste(categoriaId, novo)) setCategoriaId(CATEGORIA_INICIAL[novo]);
  };

  const salvar = (evento: React.FormEvent) => {
    evento.preventDefault();
    const centavos = lerValor(valor);
    const novosErros: Erros = {};
    if (centavos === null || centavos <= 0) novosErros.valor = "Informe um valor maior que zero, como 49,90.";
    else if (centavos > VALOR_MAXIMO) novosErros.valor = "O valor máximo é R$ 10.000.000,00.";
    if (!descricao.trim()) novosErros.descricao = "Descreva o lançamento, como “Supermercado”.";
    if (!dataValida(data)) novosErros.data = "Informe uma data completa, com dia, mês e ano.";
    setErros(novosErros);

    if (novosErros.valor) return campoValor.current?.focus();
    if (novosErros.descricao) return campoDescricao.current?.focus();
    if (novosErros.data) return campoData.current?.focus();

    const dados = { tipo, valor: centavos!, descricao: descricao.trim(), categoria: categoriaId, data };
    if (editando) financas.editar({ ...lancamento, ...dados });
    else financas.adicionar(dados);
    fechar();

    const mesDoLancamento = data.slice(0, 7) as ChaveMes;
    const verbo = editando ? "atualizado" : "salvo";
    if (mesDoLancamento === mes) {
      avisar({ texto: `Lançamento ${verbo}.` });
    } else {
      avisar({
        texto: `Lançamento ${verbo} em ${nomeDoMes(mesDoLancamento)}.`,
        acao: { rotulo: "Ver mês", fazer: () => irParaMes(mesDoLancamento) },
      });
    }
  };

  const excluir = () => {
    if (!lancamento) return;
    financas.remover(lancamento.id);
    fechar();
    avisar({ texto: "Lançamento excluído.", acao: { rotulo: "Desfazer", fazer: () => financas.devolver(lancamento) } });
  };

  const titulo = editando ? "Editar lançamento" : "Novo lançamento";

  return (
    <dialog
      ref={dialogo}
      className={s.dialogo}
      aria-labelledby="lancamento-titulo"
      onClose={() => {
        // Ignora um "close" atrasado se o diálogo já foi reaberto (acontece no modo de desenvolvimento).
        if (!dialogo.current?.open) aoFechar();
      }}
    >
      <form className={s.formulario} onSubmit={salvar} noValidate>
        <div className={s.topo}>
          <h2 id="lancamento-titulo">{titulo}</h2>
          <button type="button" className="botao botao-icone botao-quieto" onClick={fechar} aria-label="Fechar">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <fieldset className={s.tipo}>
          <legend className="sr-only">Tipo de lançamento</legend>
          <div className="segmentos">
            <label>
              <input type="radio" name="tipo" value="saida" checked={tipo === "saida"} onChange={() => trocarTipo("saida")} />
              <span aria-hidden="true">−</span> Saída
            </label>
            <label>
              <input type="radio" name="tipo" value="entrada" checked={tipo === "entrada"} onChange={() => trocarTipo("entrada")} />
              <span aria-hidden="true">+</span> Entrada
            </label>
          </div>
        </fieldset>

        <div className={s.linhaDupla}>
          <div className="campo">
            <label htmlFor="lancamento-valor">Valor</label>
            <div className={s.comPrefixo}>
              <span aria-hidden="true">R$</span>
              <input
                ref={campoValor}
                id="lancamento-valor"
                className="entrada numeros"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                onBlur={() => {
                  const centavos = lerValor(valor);
                  if (centavos !== null && centavos > 0) setValor(formatarNumero(centavos));
                }}
                aria-invalid={erros.valor ? true : undefined}
                aria-describedby={erros.valor ? "erro-valor" : undefined}
              />
            </div>
            {erros.valor && <Erro id="erro-valor" texto={erros.valor} />}
          </div>

          <div className="campo">
            <label htmlFor="lancamento-data">Data</label>
            <input
              ref={campoData}
              id="lancamento-data"
              type="date"
              className="entrada"
              value={data}
              onChange={(e) => setData(e.target.value)}
              aria-invalid={erros.data ? true : undefined}
              aria-describedby={erros.data ? "erro-data" : undefined}
            />
            {erros.data && <Erro id="erro-data" texto={erros.data} />}
          </div>
        </div>

        <div className="campo">
          <label htmlFor="lancamento-descricao">Descrição</label>
          <input
            ref={campoDescricao}
            id="lancamento-descricao"
            className="entrada"
            maxLength={80}
            autoComplete="off"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            aria-invalid={erros.descricao ? true : undefined}
            aria-describedby={erros.descricao ? "erro-descricao" : undefined}
          />
          {erros.descricao && <Erro id="erro-descricao" texto={erros.descricao} />}
        </div>

        <fieldset className={s.categorias}>
          <legend>Categoria</legend>
          <div className={s.opcoes}>
            {categoriasDoTipo(tipo).map((c) => (
              <label key={c.id} className={s.opcao}>
                <input
                  type="radio"
                  name="categoria"
                  value={c.id}
                  checked={categoriaId === c.id}
                  onChange={() => setCategoriaId(c.id)}
                />
                <SeloCategoria id={c.id} pequeno />
                {c.nome}
              </label>
            ))}
          </div>
        </fieldset>

        <div className={s.acoes}>
          {editando && (
            <button type="button" className={`botao botao-quieto ${s.excluir}`} onClick={excluir}>
              <Trash2 size={18} aria-hidden="true" />
              Excluir lançamento
            </button>
          )}
          <button type="button" className="botao" onClick={fechar}>
            Cancelar
          </button>
          <button type="submit" className="botao botao-primario">
            {editando ? "Salvar alterações" : "Salvar lançamento"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function Erro({ id, texto }: { id: string; texto: string }) {
  return (
    <p id={id} className="erro">
      <CircleAlert size={18} strokeWidth={2.4} aria-hidden="true" />
      {texto}
    </p>
  );
}
