# Nítido

Controle de finanças pessoais em Next.js com paletas adaptadas para **protanopia**, **deuteranopia** e **tritanopia**.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000. No primeiro acesso o app carrega seis meses de dados de exemplo; dá para trocar por dados próprios ou apagar tudo pelo rodapé.

| Script | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` / `npm start` | build e servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | checagem de tipos do TypeScript |
| `npm run paletas` | valida as paletas de cor para cada tipo de visão |

## O que o app faz

- **Resumo do mês**: entradas, saídas e saldo montados como uma conta armada; gastos por categoria; entradas e saídas dos últimos seis meses; últimos lançamentos.
- **Lançamentos**: lista por dia, com filtro por tipo e categoria e busca que ignora acentos. Criar, editar e excluir (com "Desfazer").
- **Exportar CSV** com `;` e vírgula decimal, que abre direto no Excel em português.

Os dados ficam só no navegador (`localStorage`). Nada é enviado para servidor.

## Visão de cores

O botão **Visão de cores**, no topo de todas as páginas, troca a paleta dos gráficos. A escolha fica salva e é aplicada antes da primeira pintura da página, sem piscar.

- **Uma paleta por tipo de visão.** As cores estão em `src/lib/visao/paletas.json`. Cada paleta foi escolhida para que suas cores continuem diferentes entre si depois de simular a visão daquele tipo.
- **Nunca só cor.** Entradas e saídas também se distinguem pelos sinais + e − e pela posição (acima ou abaixo da linha no gráfico). Cada categoria tem ícone, nome e, nos modos de daltonismo, uma textura (listras em 45° ou 135°, pontos ou trama).
- **Simulação.** No mesmo painel, quem não tem daltonismo pode ver a tela como uma pessoa com protanopia, deuteranopia, tritanopia ou sem cores. É só uma prévia; a paleta escolhida não muda.
- **Tipografia.** Atkinson Hyperlegible Next, desenhada pelo Braille Institute para que cada letra e cada algarismo sejam inconfundíveis.

### Validação das paletas

`npm run paletas` simula cada tipo de visão com as matrizes de Machado, Oliveira e Fernandes (2009) e mede a distância entre as cores em OKLab (ΔE × 100). Menor distância entre duas categorias quaisquer:

| Paleta | Na visão para a qual foi feita | Em visão típica |
| --- | --- | --- |
| Padrão | 20,1 (e ≥ 10 nas três simulações) | 20,1 |
| Protanopia | 15,1 | 17,6 |
| Deuteranopia | 14,9 | 16,6 |
| Tritanopia | 15,4 | 17,6 |

O script exige no mínimo 10 na visão do modo e 15 em visão típica. Como referência, o método usado trata 8 como alvo e 6 como piso para cores de categorias. O script também confere o contraste das cores de entrada e saída sobre o fundo.

## Estrutura

```
src/
  app/                  rotas (resumo e lançamentos), layout e estilos globais
  components/
    estrutura/          cabeçalho, painel de visão de cores, simulação, avisos, rodapé
    resumo/             conta do mês, gastos por categoria, gráfico de entradas e saídas
    lancamentos/        lista e formulário de lançamento
    comum/              selos, linha de lançamento, cabeçalho de página
  lib/
    dados/              tipos, categorias, dados de exemplo e armazenamento local
    visao/              modos de visão, preferências e geração do CSS das paletas
    calculos.ts         resumos e séries mensais
    formato.ts          moeda, datas e meses em pt-BR
scripts/
  validar-paletas.mjs   validação das paletas
```
