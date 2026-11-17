import {
  Briefcase,
  Bus,
  CirclePlus,
  Ellipsis,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Popcorn,
  Repeat,
  ShoppingCart,
  TrendingUp,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { CategoriaEntrada, CategoriaId, CategoriaSaida, TipoLancamento } from "./tipos";

export interface Categoria<Id extends CategoriaId = CategoriaId> {
  id: Id;
  nome: string;
  tipo: TipoLancamento;
  Icone: LucideIcon;
}

// A ordem é a da lista de escolha no formulário. "Outros" fica sempre por último.
export const CATEGORIAS_SAIDA: Categoria<CategoriaSaida>[] = [
  { id: "moradia", nome: "Moradia", tipo: "saida", Icone: House },
  { id: "mercado", nome: "Mercado", tipo: "saida", Icone: ShoppingCart },
  { id: "transporte", nome: "Transporte", tipo: "saida", Icone: Bus },
  { id: "saude", nome: "Saúde", tipo: "saida", Icone: HeartPulse },
  { id: "educacao", nome: "Educação", tipo: "saida", Icone: GraduationCap },
  { id: "restaurantes", nome: "Restaurantes", tipo: "saida", Icone: UtensilsCrossed },
  { id: "lazer", nome: "Lazer", tipo: "saida", Icone: Popcorn },
  { id: "assinaturas", nome: "Assinaturas", tipo: "saida", Icone: Repeat },
  { id: "outros", nome: "Outros", tipo: "saida", Icone: Ellipsis },
];

export const CATEGORIAS_ENTRADA: Categoria<CategoriaEntrada>[] = [
  { id: "salario", nome: "Salário", tipo: "entrada", Icone: Briefcase },
  { id: "freelance", nome: "Freelance", tipo: "entrada", Icone: Laptop },
  { id: "rendimentos", nome: "Rendimentos", tipo: "entrada", Icone: TrendingUp },
  { id: "outras-entradas", nome: "Outras entradas", tipo: "entrada", Icone: CirclePlus },
];

const PORID = new Map<CategoriaId, Categoria>(
  [...CATEGORIAS_SAIDA, ...CATEGORIAS_ENTRADA].map((c) => [c.id, c]),
);

export function categoria(id: CategoriaId): Categoria {
  return PORID.get(id) ?? CATEGORIAS_SAIDA[CATEGORIAS_SAIDA.length - 1];
}

export function categoriaExiste(id: unknown, tipo: TipoLancamento): id is CategoriaId {
  const encontrada = PORID.get(id as CategoriaId);
  return encontrada !== undefined && encontrada.tipo === tipo;
}

export function categoriasDoTipo(tipo: TipoLancamento): Categoria[] {
  return tipo === "saida" ? CATEGORIAS_SAIDA : CATEGORIAS_ENTRADA;
}
