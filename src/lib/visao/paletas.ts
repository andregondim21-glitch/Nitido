import paletas from "./paletas.json";
import type { ModoVisao } from "./modos";

// Gera o CSS das paletas a partir de paletas.json (a única fonte das cores; o
// script `npm run paletas` valida o mesmo arquivo). Para cada cor, calcula também:
//   -traco  a cor das linhas da textura, um tom mais claro ou mais escuro da própria cor
//   -sobre  preto ou branco, o que tiver mais contraste para ícones sobre a cor

type Paleta = {
  categorias: Record<string, string>;
  fluxo: Record<string, string>;
};

const PALETAS = paletas as Record<ModoVisao, Paleta>;

export function paletaDoModo(modo: ModoVisao): Paleta {
  return PALETAS[modo];
}

// --- conversões de cor (sRGB ⇄ OKLab) -------------------------------------------

const paraLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const deLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function linear(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => paraLinear(parseInt(hex.slice(i, i + 2), 16) / 255)) as [number, number, number];
}

function oklab([r, g, b]: number[]): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function deOklab([L, a, b]: number[]): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return (
    "#" +
    rgb
      .map((c) => Math.round(deLinear(Math.min(1, Math.max(0, c))) * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function luminancia(hex: string): number {
  const [r, g, b] = linear(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Linhas da textura: um degrau de ~0,2 em L, para o lado com mais espaço. */
function corDoTraco(hex: string): string {
  const [L, a, b] = oklab(linear(hex));
  const novoL = L > 0.6 ? L - 0.22 : L + 0.2;
  return deOklab([novoL, a * 0.85, b * 0.85]);
}

function corSobre(hex: string): string {
  const lum = luminancia(hex);
  const contraBranco = 1.05 / (lum + 0.05);
  const contraPreto = (lum + 0.05) / 0.05;
  return contraPreto >= contraBranco ? "#000000" : "#ffffff";
}

// --- CSS ---------------------------------------------------------------------------

function variaveisDoModo(p: Paleta): [string, string][] {
  const grupos: [string, Record<string, string>][] = [
    ["cat", p.categorias],
    ["fx", p.fluxo],
  ];
  const vars: [string, string][] = [];
  for (const [prefixo, cores] of grupos) {
    for (const [nome, hex] of Object.entries(cores)) {
      vars.push([`--${prefixo}-${nome}`, hex]);
      vars.push([`--${prefixo}-${nome}-traco`, corDoTraco(hex)]);
      vars.push([`--${prefixo}-${nome}-sobre`, corSobre(hex)]);
    }
  }
  return vars;
}

export function cssDasPaletas(): string {
  const porModo = Object.entries(PALETAS).map(([modo, p]) => [modo, variaveisDoModo(p)] as const);
  const nomes = porModo[0][1].map(([nome]) => nome);

  // Registrar as variáveis como <color> permite animar a troca de paleta.
  const registros = nomes
    .map((nome) => `@property ${nome}{syntax:"<color>";inherits:true;initial-value:#808080}`)
    .join("");
  const blocos = porModo
    .map(([modo, vars]) => `[data-visao="${modo}"]{${vars.map(([n, v]) => `${n}:${v}`).join(";")}}`)
    .join("");
  const transicao =
    `html{transition-property:${nomes.join(",")};transition-duration:.45s;transition-timing-function:ease}` +
    `@media (prefers-reduced-motion:reduce){html{transition:none}}`;

  return registros + blocos + transicao;
}
