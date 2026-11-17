import type { Metadata } from "next";
import { Lancamentos } from "@/components/lancamentos/Lancamentos";

export const metadata: Metadata = {
  title: "Lançamentos",
};

export default function PaginaLancamentos() {
  return <Lancamentos />;
}
