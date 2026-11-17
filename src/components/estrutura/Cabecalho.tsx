"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nomeDoModo } from "@/lib/visao/modos";
import { usePreferenciasVisao } from "@/lib/visao/preferencias";
import s from "./Cabecalho.module.css";
import { useApp } from "./contexto";
import { Marca } from "./Marca";

const PAGINAS = [
  { href: "/", nome: "Resumo" },
  { href: "/lancamentos", nome: "Lançamentos" },
] as const;

const AMOSTRAS = ["moradia", "mercado", "transporte", "saude"];

export function Cabecalho() {
  const caminho = usePathname();
  const { novoLancamento, abrirVisaoDeCores } = useApp();
  const preferencias = usePreferenciasVisao();

  return (
    <header className={s.cabecalho}>
      <div className={`conteiner ${s.linha}`}>
        <Link href="/" className={s.marca}>
          <Marca />
          Nítido
        </Link>

        <nav aria-label="Principal" className={s.nav}>
          <ul role="list">
            {PAGINAS.map((p) => (
              <li key={p.href}>
                <Link href={p.href} aria-current={caminho === p.href ? "page" : undefined}>
                  {p.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.acoes}>
          <button type="button" className={`botao ${s.visao}`} onClick={abrirVisaoDeCores} aria-haspopup="dialog">
            <span className={s.amostras} aria-hidden="true">
              {AMOSTRAS.map((c) => (
                <span key={c} data-cat={c} className={s.pinta} />
              ))}
            </span>
            <span>
              <span className={s.curto}>Cores</span>
              <span className={s.longo}>Visão de cores{preferencias && ": "}</span>
              {preferencias && <span className={s.modo}>{nomeDoModo(preferencias.modo)}</span>}
            </span>
          </button>
          <button type="button" className={`botao botao-primario ${s.novo}`} onClick={novoLancamento}>
            <Plus size={20} strokeWidth={2.6} aria-hidden="true" />
            <span className={s.rotuloNovo}>Novo lançamento</span>
          </button>
        </div>
      </div>
    </header>
  );
}
