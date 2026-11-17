import { categoria } from "@/lib/dados/categorias";
import type { CategoriaId } from "@/lib/dados/tipos";
import s from "./Selos.module.css";

/** Quadrado com a cor da categoria e o ícone dela: a cor nunca aparece sozinha. */
export function SeloCategoria({ id, pequeno = false }: { id: CategoriaId; pequeno?: boolean }) {
  const { Icone } = categoria(id);
  return (
    <span className={s.categoria} data-cat={id} data-pequeno={pequeno || undefined} aria-hidden="true">
      <Icone size={pequeno ? 15 : 19} strokeWidth={2.2} />
    </span>
  );
}
