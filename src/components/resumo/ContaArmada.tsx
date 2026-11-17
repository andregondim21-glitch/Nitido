import type { Resumo } from "@/lib/calculos";
import { formatarMoeda, formatarNumero, formatarPorcentagem } from "@/lib/formato";
import s from "./ContaArmada.module.css";

// O resumo do mês montado como conta de subtrair feita no papel.
// Os sinais − e = e as palavras ao lado dizem tudo; não há cor aqui.

function Quantia({ centavos, negativa = false }: { centavos: number; negativa?: boolean }) {
  return (
    <span className={s.quantia}>
      <span className={s.simbolo}>R$</span>
      <span>
        {negativa && "−"}
        {formatarNumero(centavos)}
      </span>
    </span>
  );
}

const plural = (n: number) => `${n} ${n === 1 ? "lançamento" : "lançamentos"}`;

export function ContaArmada({ resumo, nomeMes }: { resumo: Resumo; nomeMes: string }) {
  const { entradas, saidas, saldo, qtdEntradas, qtdSaidas } = resumo;
  const sobrou = saldo >= 0;

  let nota: string;
  if (qtdEntradas + qtdSaidas === 0) nota = `Nenhum lançamento em ${nomeMes} ainda.`;
  else if (entradas === 0) nota = "Nenhuma entrada registrada neste mês.";
  else if (sobrou) nota = `Você guardou ${formatarPorcentagem(saldo / entradas)} do que entrou.`;
  else nota = `As saídas passaram as entradas em ${formatarMoeda(-saldo)}.`;

  return (
    <section className={s.secao} aria-labelledby="conta-titulo">
      <h2 id="conta-titulo" className="sr-only">
        Conta de {nomeMes}
      </h2>
      <dl className={s.conta}>
        <div className={s.linha}>
          <dt>
            entradas
            <span className={s.detalhe}>{plural(qtdEntradas)}</span>
          </dt>
          <dd>
            <Quantia centavos={entradas} />
          </dd>
        </div>
        <div className={s.linha} data-operador="menos">
          <dt>
            saídas
            <span className={s.detalhe}>{plural(qtdSaidas)}</span>
          </dt>
          <dd>
            <Quantia centavos={saidas} />
          </dd>
        </div>
        <div className={`${s.linha} ${s.resultado}`} data-operador="igual">
          <dt>{sobrou ? "sobraram" : "faltaram"}</dt>
          <dd>
            <Quantia centavos={saldo} negativa={!sobrou} />
          </dd>
        </div>
      </dl>
      <p className={s.nota}>{nota}</p>
    </section>
  );
}
