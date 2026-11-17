// Valida as paletas de src/lib/visao/paletas.json.
//
// Cada modo de visão tem a própria paleta. A regra é simples: as cores de um modo
// precisam continuar diferentes entre si depois de simular a visão daquele modo.
//
// Simulação: Machado, Oliveira & Fernandes (2009), severidade 1.0, em RGB linear.
// Distância: Euclidiana em OKLab ×100 (ΔE). Referências de limite:
//   categorias  ΔE ≥ 10 entre TODOS os pares na visão do modo (a faixa de gastos é
//               ordenada por valor, então qualquer par pode ficar lado a lado);
//               ΔE ≥ 15 em visão típica, para quem acompanha a pessoa também distinguir;
//               no modo padrão, ΔE ≥ 8 também nas três simulações.
//               "Outros" fica de fora: é desenhado como hachura de tinta sobre o papel.
//   fluxo       ΔE ≥ 20 entre entrada e saída; as duas com contraste ≥ 3:1.
//
// Uso: npm run paletas

import { readFileSync } from "node:fs";

const PAPEL = "#eff1ee";
const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const VISAO_DO_MODO = { padrao: null, protanopia: "protan", deuteranopia: "deutan", tritanopia: "tritan" };
const NOME_VISAO = { null: "visão típica", protan: "protanopia", deutan: "deuteranopia", tritan: "tritanopia" };

const s2lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linear = (hex) => [1, 3, 5].map((i) => s2lin(parseInt(hex.slice(i, i + 2), 16) / 255));
const limitar = (v) => Math.max(0, Math.min(1, v));

function simular(rgb, visao) {
  if (!visao) return rgb;
  const M = MACHADO[visao];
  return M.map((linha) => limitar(linha[0] * rgb[0] + linha[1] * rgb[1] + linha[2] * rgb[2]));
}

function oklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const deltaE = (a, b, visao) => {
  const x = oklab(simular(linear(a), visao));
  const y = oklab(simular(linear(b), visao));
  return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};
const luminancia = (hex) => { const [r, g, b] = linear(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const [hi, lo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
const lc = (hex) => { const [L, a, b] = oklab(linear(hex)); return [L, Math.hypot(a, b)]; };

function piorPar(cores, visao) {
  const nomes = Object.keys(cores);
  let pior = { d: Infinity };
  for (let i = 0; i < nomes.length; i++)
    for (let j = i + 1; j < nomes.length; j++) {
      const d = deltaE(cores[nomes[i]], cores[nomes[j]], visao);
      if (d < pior.d) pior = { d, a: nomes[i], b: nomes[j] };
    }
  return pior;
}

const paletas = JSON.parse(readFileSync(new URL("../src/lib/visao/paletas.json", import.meta.url), "utf8"));
let falhas = 0;
const linha = (ok, texto) => { if (!ok) falhas++; console.log(`  ${ok ? "ok   " : "FALHA"}  ${texto}`); };
const par = (p) => `${p.a} × ${p.b} ΔE ${p.d.toFixed(1)}`;

for (const [modo, paleta] of Object.entries(paletas)) {
  const visao = VISAO_DO_MODO[modo];
  console.log(`\n${modo} (validado em ${NOME_VISAO[visao]})`);

  const naVisao = piorPar(paleta.categorias, visao);
  linha(naVisao.d >= 10, `categorias, pior par em ${NOME_VISAO[visao]}: ${par(naVisao)}`);
  if (visao) {
    const tipica = piorPar(paleta.categorias, null);
    linha(tipica.d >= 15, `categorias, pior par em visão típica: ${par(tipica)}`);
  } else {
    for (const v of ["protan", "deutan", "tritan"]) {
      const p = piorPar(paleta.categorias, v);
      linha(p.d >= 8, `categorias, pior par em ${NOME_VISAO[v]}: ${par(p)}`);
    }
  }
  const foraDaFaixa = Object.entries(paleta.categorias).filter(([, h]) => lc(h)[0] < 0.42 || lc(h)[0] > 0.79 || lc(h)[1] < 0.095);
  linha(!foraDaFaixa.length, foraDaFaixa.length
    ? `luminosidade/croma fora da faixa: ${foraDaFaixa.map(([n, h]) => `${n} (L ${lc(h)[0].toFixed(3)}, C ${lc(h)[1].toFixed(3)})`).join(", ")}`
    : "categorias com L entre 0,42 e 0,79 e croma ≥ 0,095");

  const fl = deltaE(paleta.fluxo.entrada, paleta.fluxo.saida, visao);
  linha(fl >= 20, `fluxo, entrada × saída ΔE ${fl.toFixed(1)}`);
  for (const nome of ["entrada", "saida"]) {
    const c = contraste(paleta.fluxo[nome], PAPEL);
    linha(c >= 3, `fluxo ${nome} sobre o papel: ${c.toFixed(2)}:1`);
  }
}

console.log(falhas ? `\n${falhas} verificação(ões) falharam.` : "\nTodas as paletas passaram.");
process.exit(falhas ? 1 : 0);
