import type { Metadata } from "next";
import { Resumo } from "@/components/resumo/Resumo";

export const metadata: Metadata = {
  title: { absolute: "Resumo do mês | Nítido" },
};

export default function PaginaResumo() {
  return <Resumo />;
}
