import type { CategoriaId, Dados, Lancamento, TipoLancamento } from "./tipos";

// Seis meses de uma vida financeira plausível, terminando no dia de hoje.
// O gerador é determinístico (mesma data de referência, mesmos dados).

function sorteador(semente: number) {
  let s = semente >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Modelo = {
  dia: number;
  tipo: TipoLancamento;
  categoria: CategoriaId;
  descricao: string;
  /** Valor em reais; um par [mín, máx] sorteia entre os dois. */
  valor: number | [number, number];
  /** Aparece só em alguns meses (índice 0 = mês mais antigo). */
  meses?: number[];
};

const FIXOS: Modelo[] = [
  { dia: 5, tipo: "entrada", categoria: "salario", descricao: "Salário", valor: 6200 },
  { dia: 15, tipo: "entrada", categoria: "rendimentos", descricao: "Rendimento da poupança", valor: [38, 54] },
  { dia: 18, tipo: "entrada", categoria: "freelance", descricao: "Freelance: site de uma padaria", valor: 1450, meses: [1] },
  { dia: 22, tipo: "entrada", categoria: "freelance", descricao: "Freelance: cardápio digital", valor: 980, meses: [3] },
  { dia: 12, tipo: "entrada", categoria: "outras-entradas", descricao: "Venda da bicicleta antiga", valor: 700, meses: [4] },
  { dia: 9, tipo: "entrada", categoria: "freelance", descricao: "Freelance: identidade visual", valor: 1800, meses: [5] },

  { dia: 10, tipo: "saida", categoria: "moradia", descricao: "Aluguel", valor: 1650 },
  { dia: 10, tipo: "saida", categoria: "moradia", descricao: "Condomínio", valor: 420 },
  { dia: 14, tipo: "saida", categoria: "moradia", descricao: "Conta de luz", valor: [138, 212] },
  { dia: 20, tipo: "saida", categoria: "moradia", descricao: "Internet", valor: 99.9 },
  { dia: 7, tipo: "saida", categoria: "saude", descricao: "Plano de saúde", valor: 289.9 },
  { dia: 3, tipo: "saida", categoria: "saude", descricao: "Academia", valor: 109.9 },
  { dia: 8, tipo: "saida", categoria: "educacao", descricao: "Curso de inglês", valor: 320 },
  { dia: 12, tipo: "saida", categoria: "assinaturas", descricao: "Streaming de vídeo", valor: 44.9 },
  { dia: 16, tipo: "saida", categoria: "assinaturas", descricao: "Streaming de música", valor: 21.9 },
  { dia: 21, tipo: "saida", categoria: "assinaturas", descricao: "Armazenamento na nuvem", valor: 9.9 },
  { dia: 2, tipo: "saida", categoria: "transporte", descricao: "Recarga do bilhete único", valor: 150 },
  { dia: 17, tipo: "saida", categoria: "saude", descricao: "Consulta no dentista", valor: 250, meses: [2] },
  { dia: 11, tipo: "saida", categoria: "educacao", descricao: "Livros da pós", valor: 186.4, meses: [1, 4] },
  { dia: 23, tipo: "saida", categoria: "outros", descricao: "Presente de aniversário", valor: 160, meses: [0, 3, 5] },
  { dia: 26, tipo: "saida", categoria: "outros", descricao: "Corte de cabelo", valor: 55 },
  { dia: 13, tipo: "saida", categoria: "outros", descricao: "Conserto do celular", valor: 340, meses: [2] },
  { dia: 19, tipo: "saida", categoria: "lazer", descricao: "Show no fim de semana", valor: 280, meses: [1, 5] },
  { dia: 24, tipo: "saida", categoria: "lazer", descricao: "Viagem para a praia", valor: 620, meses: [3] },
];

// Gastos que se repetem várias vezes por mês com valores variados.
const VARIAVEIS: { categoria: CategoriaId; descricoes: string[]; vezes: [number, number]; valor: [number, number] }[] = [
  { categoria: "mercado", descricoes: ["Supermercado", "Feira", "Hortifrúti", "Padaria", "Açougue"], vezes: [6, 9], valor: [28, 260] },
  { categoria: "restaurantes", descricoes: ["Almoço perto do trabalho", "Pizza de sexta", "Delivery de comida japonesa", "Café da tarde", "Hambúrguer com amigos"], vezes: [5, 9], valor: [22, 96] },
  { categoria: "transporte", descricoes: ["Corrida de aplicativo", "Combustível", "Estacionamento"], vezes: [3, 6], valor: [14, 120] },
  { categoria: "lazer", descricoes: ["Cinema", "Bar com amigos", "Ingresso de teatro", "Jogo no celular"], vezes: [2, 4], valor: [25, 110] },
  { categoria: "saude", descricoes: ["Farmácia"], vezes: [1, 2], valor: [18, 90] },
];

function iso(ano: number, mesIndice: number, dia: number): string {
  return `${ano}-${String(mesIndice + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function criarDadosDeExemplo(hoje: Date): Dados {
  const sortear = sorteador(hoje.getFullYear() * 100 + hoje.getMonth());
  const entre = ([min, max]: [number, number]) => min + sortear() * (max - min);
  const lancamentos: Lancamento[] = [];
  let contador = 0;

  for (let i = 0; i < 6; i++) {
    const referencia = new Date(hoje.getFullYear(), hoje.getMonth() - 5 + i, 1);
    const ano = referencia.getFullYear();
    const mes = referencia.getMonth();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const mesAtual = i === 5;
    const limiteDia = mesAtual ? hoje.getDate() : ultimoDia;

    const adicionar = (dia: number, tipo: TipoLancamento, categoria: CategoriaId, descricao: string, reais: number) => {
      if (dia > limiteDia) return;
      lancamentos.push({
        id: `exemplo-${++contador}`,
        tipo,
        categoria,
        descricao,
        valor: Math.round(reais * 100),
        data: iso(ano, mes, Math.min(dia, ultimoDia)),
      });
    };

    for (const m of FIXOS) {
      if (m.meses && !m.meses.includes(i)) continue;
      const reais = Array.isArray(m.valor) ? entre(m.valor) : m.valor;
      adicionar(m.dia, m.tipo, m.categoria, m.descricao, reais);
    }

    for (const v of VARIAVEIS) {
      const vezes = Math.round(entre(v.vezes));
      for (let k = 0; k < vezes; k++) {
        const dia = 1 + Math.floor(sortear() * ultimoDia);
        const descricao = v.descricoes[Math.floor(sortear() * v.descricoes.length)];
        adicionar(dia, "saida", v.categoria, descricao, entre(v.valor));
      }
    }
  }

  return { versao: 1, lancamentos };
}
