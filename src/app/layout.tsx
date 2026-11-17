// O CSS global vem antes dos componentes: assim os módulos de cada componente
// podem ajustar as classes base (.botao, .entrada) sem brigar por especificidade.
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import { Estrutura } from "@/components/estrutura/Estrutura";
import { SCRIPT_VISAO } from "@/lib/visao/modos";
import { cssDasPaletas } from "@/lib/visao/paletas";

// Atkinson Hyperlegible foi desenhada pelo Braille Institute para que cada letra
// e cada algarismo sejam inconfundíveis: a mesma ideia que o app aplica às cores.
const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
  // O Next não tem métricas desta fonte para gerar um substituto ajustado.
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "Nítido", template: "%s | Nítido" },
  description:
    "Controle de finanças pessoais com paletas ajustadas para protanopia, deuteranopia e tritanopia.",
};

export const viewport: Viewport = {
  themeColor: "#eff1ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-visao="padrao"
      data-texturas="nao"
      data-simulacao="nenhuma"
      className={atkinson.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_VISAO }} />
        <style dangerouslySetInnerHTML={{ __html: cssDasPaletas() }} />
      </head>
      <body>
        <Estrutura>{children}</Estrutura>
      </body>
    </html>
  );
}
