"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import type { Lancamento } from "@/lib/dados/tipos";
import { chaveDoMes, type ChaveMes } from "@/lib/formato";
import type { Simulacao } from "@/lib/visao/modos";
import { aplicarNoDocumento, usePreferenciasVisao } from "@/lib/visao/preferencias";
import { DialogoLancamento } from "../lancamentos/DialogoLancamento";
import { AvisoFlutuante } from "./AvisoFlutuante";
import { Cabecalho } from "./Cabecalho";
import { ConviteVisao } from "./ConviteVisao";
import { Contexto, type AvisoRapido } from "./contexto";
import { FaixaSimulacao, FiltrosSimulacao } from "./Simulacao";
import { PainelVisao } from "./PainelVisao";
import { Rodape } from "./Rodape";

type EstadoDialogo = { aberto: false } | { aberto: true; lancamento: Lancamento | null; chave: number };

export function Estrutura({ children }: { children: React.ReactNode }) {
  const [mesAtual] = useState<ChaveMes>(() => chaveDoMes(new Date()));
  const [mes, setMes] = useState<ChaveMes>(mesAtual);
  const [dialogo, setDialogo] = useState<EstadoDialogo>({ aberto: false });
  const [painelVisao, setPainelVisao] = useState(false);
  const [aviso, setAviso] = useState<(AvisoRapido & { id: number }) | null>(null);
  const [simulacao, setSimulacao] = useState<Simulacao>("nenhuma");
  const preferencias = usePreferenciasVisao();

  // O script do <head> já aplicou a paleta; isto só reaplica depois que o React
  // recria o <html> (acontece no modo de desenvolvimento).
  useLayoutEffect(() => {
    if (preferencias) aplicarNoDocumento(preferencias);
  }, [preferencias]);

  useLayoutEffect(() => {
    document.documentElement.dataset.simulacao = simulacao;
  }, [simulacao]);

  const abrirDialogo = useCallback((lancamento: Lancamento | null) => {
    setDialogo({ aberto: true, lancamento, chave: Date.now() });
  }, []);

  const avisar = useCallback((novo: AvisoRapido) => {
    setAviso({ ...novo, id: Date.now() });
  }, []);
  const fecharAviso = useCallback(() => setAviso(null), []);

  const contexto = {
    mes,
    mesAtual,
    irParaMes: setMes,
    novoLancamento: () => abrirDialogo(null),
    editarLancamento: (lancamento: Lancamento) => abrirDialogo(lancamento),
    abrirVisaoDeCores: () => setPainelVisao(true),
    avisar,
    simulacao,
    simular: setSimulacao,
  };

  return (
    <Contexto.Provider value={contexto}>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="quadro">
        <Cabecalho />
        {preferencias && !preferencias.respondeu && <ConviteVisao />}
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <Rodape />
      </div>

      {simulacao !== "nenhuma" && <FaixaSimulacao />}
      <FiltrosSimulacao />

      {dialogo.aberto && (
        <DialogoLancamento
          key={dialogo.chave}
          lancamento={dialogo.lancamento}
          aoFechar={() => setDialogo({ aberto: false })}
        />
      )}
      {painelVisao && <PainelVisao aoFechar={() => setPainelVisao(false)} />}
      <AvisoFlutuante aviso={aviso} aoSumir={fecharAviso} />
    </Contexto.Provider>
  );
}
