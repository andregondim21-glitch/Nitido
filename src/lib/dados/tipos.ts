export type TipoLancamento = "entrada" | "saida";

export type CategoriaSaida =
  | "moradia"
  | "mercado"
  | "transporte"
  | "saude"
  | "educacao"
  | "restaurantes"
  | "lazer"
  | "assinaturas"
  | "outros";

export type CategoriaEntrada = "salario" | "freelance" | "rendimentos" | "outras-entradas";

export type CategoriaId = CategoriaSaida | CategoriaEntrada;

export interface Lancamento {
  id: string;
  tipo: TipoLancamento;
  descricao: string;
  /** Valor em centavos, sempre positivo. O tipo diz se o dinheiro entrou ou saiu. */
  valor: number;
  /** Data no formato AAAA-MM-DD. */
  data: string;
  categoria: CategoriaId;
}

export type NovoLancamento = Omit<Lancamento, "id">;

export interface Dados {
  versao: 1;
  lancamentos: Lancamento[];
}
