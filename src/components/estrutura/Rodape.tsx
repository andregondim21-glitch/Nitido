"use client";

import { Download, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { ordenarPorData } from "@/lib/calculos";
import { financas, useDados } from "@/lib/dados/armazenamento";
import { categoria } from "@/lib/dados/categorias";
import type { Lancamento } from "@/lib/dados/tipos";
import { useApp } from "./contexto";
import s from "./Rodape.module.css";

export function Rodape() {
  const dados = useDados();
  const { avisar } = useApp();
  const [confirmarApagar, setConfirmarApagar] = useState(false);
  const vazio = !dados || dados.lancamentos.length === 0;

  const usarExemplo = () => {
    if (!dados) return;
    const anterior = dados;
    financas.usarExemplo();
    avisar({ texto: "Dados de exemplo carregados.", acao: { rotulo: "Desfazer", fazer: () => financas.substituir(anterior) } });
  };

  const apagarTudo = () => {
    const anterior = financas.apagarTudo();
    setConfirmarApagar(false);
    avisar({ texto: "Todos os lançamentos foram apagados.", acao: { rotulo: "Desfazer", fazer: () => financas.substituir(anterior) } });
  };

  return (
    <footer className={s.rodape}>
      <div className={`conteiner ${s.linha}`}>
        <div className={s.acoes}>
          <button type="button" className="botao botao-quieto" onClick={() => dados && baixarCsv(dados.lancamentos)} disabled={vazio}>
            <Download size={18} aria-hidden="true" />
            Exportar CSV
          </button>
          <button type="button" className="botao botao-quieto" onClick={usarExemplo} disabled={!dados}>
            <RotateCcw size={18} aria-hidden="true" />
            Usar dados de exemplo
          </button>
          {confirmarApagar ? (
            <span className={s.confirmacao}>
              <button type="button" className="botao botao-primario" onClick={apagarTudo}>
                Apagar tudo agora
              </button>
              <button type="button" className="botao botao-quieto" onClick={() => setConfirmarApagar(false)}>
                Cancelar
              </button>
            </span>
          ) : (
            <button type="button" className="botao botao-quieto" onClick={() => setConfirmarApagar(true)} disabled={!dados}>
              <Trash2 size={18} aria-hidden="true" />
              Apagar tudo
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}

// CSV com ";" e vírgula decimal, que é como o Excel em português abre sem ajuste.
function baixarCsv(lancamentos: Lancamento[]) {
  const celula = (texto: string) => {
    // Texto que começa com = + - @ viraria fórmula na planilha.
    const seguro = /^[=+\-@]/.test(texto) ? `'${texto}` : texto;
    return /[";\n]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro;
  };
  const linhas = [
    ["Data", "Tipo", "Categoria", "Descrição", "Valor (R$)"],
    ...ordenarPorData(lancamentos).map((l) => [
      l.data,
      l.tipo === "entrada" ? "Entrada" : "Saída",
      categoria(l.categoria).nome,
      l.descricao,
      (l.valor / 100).toFixed(2).replace(".", ","),
    ]),
  ];
  const csv = "\uFEFF" + linhas.map((colunas) => colunas.map(celula).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "nitido-lancamentos.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
