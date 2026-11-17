# Backlog do Nítido para o Jira

7 épicos e 38 itens (histórias, tarefas e bugs), somando 116 pontos em seis sprints de duas semanas. O arquivo `nitido-backlog.csv`, nesta mesma pasta, tem os mesmos cards prontos para importar.

## Como importar no Jira

1. Abra o importador de CSV do Jira (no Jira Cloud: Configurações › Sistema › Importação de sistema externo › CSV). Ele pede permissão de administrador; quem criou o site do Jira já tem.
2. Envie `nitido-backlog.csv` com codificação UTF-8 e separador vírgula.
3. Mapeie as colunas: Issue ID → Issue ID; Parent → Parent (pai); Issue Type → Tipo; Summary → Resumo; Epic Name → Nome do épico; Description → Descrição; Priority → Prioridade; Story Points → Story Points; as duas colunas Labels → Rótulos.
4. Se o seu Jira usar tipos ou prioridades com outros nomes (por exemplo, "História" em vez de "Story"), associe os valores na etapa de mapeamento.
5. Se a coluna Epic Name não existir no seu projeto, deixe-a sem mapear. Se a ligação com o épico não vier, filtre pelo rótulo do épico (por exemplo, `labels = lancamentos`) e use a alteração em massa para definir o pai.
6. Crie as sprints "Sprint 1" a "Sprint 6" no backlog e mova os cards filtrando pelos rótulos `sprint-1` a `sprint-6`.

## Sprints

| Sprint | Foco | Pontos | Cards |
| --- | --- | --- | --- |
| 1. Descoberta e fundação | Entender o problema, prototipar e criar o projeto. | 18 | 6 |
| 2. Paletas e dados | Validar as cores por tipo de visão e montar a camada de dados. | 20 | 5 |
| 3. Lançamentos | Registrar, listar e exportar lançamentos; conta do mês. | 21 | 6 |
| 4. Visão de cores | Trocar de paleta, texturas e o gráfico de gastos por categoria. | 19 | 6 |
| 5. Resumo e acessibilidade | Gráfico de seis meses, filtros, simulação, teclado e celular. | 18 | 6 |
| 6. Qualidade e entrega | Revisão visual, bugs, testes, build e publicação. | 20 | 9 |

## Definição de pronto

- Critérios de aceite atendidos.
- npm run lint, npm run typecheck e npm run build sem erros.
- npm run paletas passando sempre que uma cor mudar.
- Conferido no celular (375px) e no desktop, nos quatro modos de visão.
- Nenhuma informação nova depende só da cor.
- Tudo alcançável e utilizável pelo teclado.

## O que ainda não existe no repositório

Estes cards descrevem trabalho que ainda não foi feito no código atual. Deixe-os em "A fazer" ou peça para implementar:

- Testes de ponta a ponta dos fluxos principais
- Testes unitários de cálculos e formatação
- Publicar o app na Vercel
- Preparar a demonstração

## Épico: Descoberta e planejamento

Entender como o daltonismo atrapalha a leitura de finanças em apps e transformar isso em requisitos e backlog. Rótulo: `planejamento`. 8 pontos.

### Pesquisar os tipos de daltonismo e o impacto em apps de finanças

Tarefa, 3 pontos, prioridade alta, sprint 1.

**Objetivo:** Entender quais cores cada tipo de visão confunde e onde apps de finanças dependem só de cor.

**Critérios de aceite**
- Resumo dos três tipos pedidos (protanopia, deuteranopia e tritanopia): cores confundidas e prevalência.
- Lista de padrões problemáticos em apps de banco: entrada verde e saída vermelha, pizza só por cor, alertas só por cor.
- Critérios da WCAG 2.2 relacionados: 1.4.1 Uso de cor, 1.4.3 e 1.4.11 Contraste.
- Modelo de simulação escolhido e referência: Machado, Oliveira e Fernandes (2009).

### Definir personas e requisitos

Tarefa, 3 pontos, prioridade alta, sprint 1.

**Objetivo:** Registrar para quem é o app e o que ele precisa fazer.

**Critérios de aceite**
- Três personas: pessoa com deuteranopia que acompanha os gastos pelo celular; pessoa com tritanopia; familiar sem daltonismo que ajuda nas contas.
- Requisitos funcionais numerados: registrar entradas e saídas, categorias, resumo mensal, exportação e escolha do modo de visão.
- Requisitos não funcionais: WCAG 2.2 AA, textos em português, funcionar a partir de 375px, dados só no navegador e nenhuma informação só por cor.

### Montar o backlog e planejar as sprints

Tarefa, 2 pontos, prioridade média, sprint 1.

**Objetivo:** Organizar o trabalho em épicos, histórias e sprints.

**Critérios de aceite**
- Épicos e histórias com critérios de aceite e estimativa em pontos.
- Prioridades definidas e seis sprints de duas semanas planejadas.
- Definição de pronto combinada com o time.

## Épico: Design e paletas de cor

Identidade visual em que a cor só aparece como dado, com uma paleta validada para cada tipo de visão. Rótulo: `design`. 19 pontos.

### Direção visual e tipografia

História, 3 pontos, prioridade alta, sprint 1.

**História:** Como pessoa com daltonismo, quero uma interface em que a cor só apareça quando significa algo, para não precisar adivinhar o que cada cor quer dizer.

**Critérios de aceite**
- Interface em tinta sobre papel, sem cor de marca, com tokens de cor definidos (papel, tinta, textos secundários e fios).
- Texto com contraste de pelo menos 4,5:1 sobre o fundo.
- Fonte Atkinson Hyperlegible Next, com escala tipográfica definida e algarismos tabulares nas colunas de números.

### Protótipo das telas no desktop e no celular

Tarefa, 5 pontos, prioridade média, sprint 1.

**Objetivo:** Validar o layout antes de programar.

**Critérios de aceite**
- Telas de Resumo e Lançamentos, formulário de lançamento e painel de visão de cores.
- Versões com 1440px e 375px de largura.
- Revisado contra as personas e os requisitos.

### Paletas de gráficos para cada tipo de visão

História, 8 pontos, prioridade mais alta, sprint 2.

**História:** Como pessoa com daltonismo, quero que as cores dos gráficos sejam escolhidas para o meu tipo de visão, para distinguir cada categoria sem esforço.

**Critérios de aceite**
- Quatro paletas: padrão, protanopia, deuteranopia e tritanopia.
- Cada paleta tem 8 cores de categoria e 2 de entrada e saída.
- Menor diferença entre duas categorias (ΔE em OKLab ×100): pelo menos 10 na visão do modo e 15 em visão típica.
- Todas as cores ficam num único arquivo (paletas.json).

### Script de validação das paletas

Tarefa, 3 pontos, prioridade alta, sprint 2.

**Objetivo:** Tornar a validação das cores repetível com npm run paletas.

**Critérios de aceite**
- Simula cada tipo de visão com as matrizes de Machado (2009), severidade 1.0.
- Mede o pior par de cores de cada paleta e o contraste das cores de entrada e saída sobre o fundo (mínimo de 3:1).
- Termina com erro quando alguma verificação falha.

## Épico: Fundação técnica

Projeto, camada de dados e estrutura de navegação que as funcionalidades usam. Rótulo: `fundacao`. 14 pontos.

### Criar o projeto Next.js com TypeScript e ESLint

Tarefa, 2 pontos, prioridade mais alta, sprint 1.

**Objetivo:** Ter a base do projeto pronta para o time começar.

**Critérios de aceite**
- Next.js 16 com App Router, TypeScript estrito e CSS Modules.
- Scripts dev, build, lint e typecheck funcionando.
- Pastas src/app, src/components e src/lib criadas.

### Camada de dados com armazenamento no navegador

Tarefa, 5 pontos, prioridade alta, sprint 2.

**Objetivo:** Guardar os lançamentos no navegador com segurança.

**Critérios de aceite**
- Tipos de lançamento e categoria, com valores em centavos e datas no formato AAAA-MM-DD.
- Dados salvos no localStorage; registros inválidos são descartados na leitura.
- Se o JSON salvo estiver ilegível, uma cópia é guardada antes de recomeçar.
- Mudanças feitas em outra aba aparecem sem recarregar a página.
- Sem erro de hidratação: nada que depende do navegador é renderizado no servidor.

### Dados de exemplo para o primeiro acesso

Tarefa, 2 pontos, prioridade média, sprint 2.

**Objetivo:** Mostrar o app funcionando antes de a pessoa cadastrar qualquer coisa.

**Critérios de aceite**
- Seis meses de lançamentos terminando no dia atual, sempre iguais para a mesma data.
- Entradas e saídas em todas as categorias, para os gráficos terem o que mostrar.

### Formatação em português de moeda, datas e valores

Tarefa, 2 pontos, prioridade média, sprint 2.

**Objetivo:** Mostrar e ler valores no formato brasileiro.

**Critérios de aceite**
- Moeda no formato R$ 1.234,56; meses e dias por extenso em português.
- O campo de valor aceita "1.234,56", "1234.5" e "R$ 80".
- Datas tratadas como datas de calendário, sem mudar de dia por causa do fuso horário.

### Navegação entre páginas e meses, com avisos

História, 3 pontos, prioridade alta, sprint 3.

**História:** Como alguém que controla os gastos, quero trocar de página e de mês rapidamente, para comparar meses sem me perder.

**Critérios de aceite**
- Cabeçalho com Resumo e Lançamentos, marcando a página atual.
- Setas de mês anterior e próximo que valem para todas as páginas, e botão para voltar ao mês atual.
- Avisos temporários com ação opcional (como "Desfazer"), anunciados para leitores de tela.
- Link "Pular para o conteúdo".

## Épico: Lançamentos

Registrar, consultar e exportar entradas e saídas. Rótulo: `lancamentos`. 16 pontos.

### Registrar um lançamento

História, 5 pontos, prioridade mais alta, sprint 3.

**História:** Como alguém que controla os gastos, quero registrar uma entrada ou uma saída com valor, data, descrição e categoria, para manter minhas contas em dia.

**Critérios de aceite**
- Formulário em diálogo, com o foco começando no campo Valor.
- Tipo Saída ou Entrada, identificado também pelos sinais − e +.
- Categorias com ícone e nome, que mudam conforme o tipo.
- Erros aparecem com ícone e texto junto ao campo, e o foco vai para o primeiro campo com erro.
- Depois de salvar aparece "Lançamento salvo."; se a data for de outro mês, o aviso cita o mês e oferece "Ver mês".

### Editar e excluir lançamentos, com desfazer

História, 3 pontos, prioridade alta, sprint 3.

**História:** Como alguém que registra muitos gastos, quero corrigir ou apagar um lançamento, e voltar atrás se apagar por engano.

**Critérios de aceite**
- Clicar num lançamento abre o formulário preenchido.
- Salvar a edição mostra "Lançamento atualizado.".
- "Excluir lançamento" remove na hora e oferece "Desfazer" por 8 segundos.

### Lista de lançamentos do mês por dia

História, 3 pontos, prioridade alta, sprint 3.

**História:** Como alguém que confere o extrato, quero ver os lançamentos agrupados por dia, para achar um gasto pela data.

**Critérios de aceite**
- Dias do mais recente para o mais antigo, com o saldo de cada dia.
- Valores sempre em preto, com + para entradas e − para saídas.
- Cada linha tem o selo da categoria (cor e ícone) e o nome dela.
- Mês sem lançamentos mostra o botão "Novo lançamento".

### Exportar lançamentos em CSV

História, 2 pontos, prioridade baixa, sprint 3.

**História:** Como alguém que também usa planilha, quero exportar meus lançamentos, para analisar no Excel.

**Critérios de aceite**
- Separador ";" e vírgula decimal, em UTF-8, abrindo direto no Excel em português.
- Textos que começam com =, +, - ou @ recebem um apóstrofo, para não virarem fórmula.

### Filtrar e buscar lançamentos

História, 3 pontos, prioridade média, sprint 5.

**História:** Como alguém com muitos lançamentos, quero filtrar e buscar, para encontrar um gasto específico.

**Critérios de aceite**
- Filtro por tipo (todos, entradas, saídas) e por categoria.
- Busca por descrição que ignora acentos e maiúsculas: "farmacia" encontra "Farmácia".
- Total de entradas e saídas do resultado filtrado.
- Sem resultado: mensagem e botão "Limpar filtros".

## Épico: Resumo do mês

Mostrar num relance quanto entrou, quanto saiu e para onde foi o dinheiro. Rótulo: `resumo`. 16 pontos.

### Conta do mês: entradas, saídas e saldo

História, 5 pontos, prioridade mais alta, sprint 3.

**História:** Como alguém que controla os gastos, quero ver quanto entrou, quanto saiu e quanto sobrou no mês, para saber se o mês fechou positivo.

**Critérios de aceite**
- Montada como conta armada: entradas, "−" saídas e "=" resultado, com os algarismos alinhados.
- O resultado se chama "sobraram" ou "faltaram", sem depender de cor.
- Frase com o percentual guardado do que entrou.
- O tamanho dos números se ajusta à largura disponível, sem invadir a coluna ao lado.

### Para onde foi o dinheiro

História, 5 pontos, prioridade alta, sprint 4.

**História:** Como alguém que quer gastar melhor, quero ver as saídas do mês divididas por categoria, para saber onde cortar.

**Critérios de aceite**
- Faixa única com um trecho por categoria, separados por 2px de fundo; "Outros" sempre por último.
- Tabela com valor, parcela e comparação com o mês anterior, que também serve de legenda.
- Passar o mouse num trecho ou numa linha destaca o par correspondente e mostra valor e parcela.
- Nos modos de daltonismo, cada categoria tem a sua textura.

### Entradas e saídas dos últimos seis meses

História, 5 pontos, prioridade alta, sprint 5.

**História:** Como alguém que acompanha a evolução das contas, quero comparar os últimos meses, para ver se estou gastando mais do que ganho.

**Critérios de aceite**
- Barras divergentes: entradas acima e saídas abaixo da mesma linha; a legenda explica a posição.
- Dica com entradas, saídas e saldo ao passar o mouse ou focar um mês pelo teclado.
- Botão "Ver tabela" com os mesmos números.
- Clicar num mês abre o resumo daquele mês.

### Últimos lançamentos no resumo

História, 1 ponto, prioridade média, sprint 5.

**História:** Como alguém que acabou de registrar um gasto, quero vê-lo no resumo, para conferir se ficou certo.

**Critérios de aceite**
- Os seis lançamentos mais recentes do mês, com a data.
- Link "Ver todos" quando houver mais.
- Mês sem lançamentos mostra o botão "Novo lançamento".

## Épico: Visão de cores

Adaptar o app para protanopia, deuteranopia e tritanopia. Rótulo: `visao-de-cores`. 17 pontos.

### Escolher o modo de visão de cores

História, 5 pontos, prioridade mais alta, sprint 4.

**História:** Como pessoa com daltonismo, quero escolher meu tipo de visão, para que os gráficos usem cores que eu distingo.

**Critérios de aceite**
- Botão "Visão de cores" em todas as páginas, mostrando o modo atual.
- Painel com Padrão, Protanopia, Deuteranopia e Tritanopia, cada um com uma descrição simples e amostras da própria paleta.
- A troca vale na hora, com transição suave (sem animação para quem pede menos movimento), e fica salva.
- Orientação para quem não sabe o próprio tipo: escolher a opção em que as amostras parecem mais diferentes.

### Aplicar a paleta antes da primeira pintura

Tarefa, 3 pontos, prioridade alta, sprint 4.

**Objetivo:** Evitar que a página apareça por um instante com a paleta errada.

**Critérios de aceite**
- Um script no <head> lê a preferência salva e marca o <html> antes de a página aparecer.
- Recarregar a página não mostra a paleta padrão por um instante.
- A marcação continua certa no modo de desenvolvimento (React StrictMode).

### Texturas nos gráficos

História, 3 pontos, prioridade alta, sprint 4.

**História:** Como pessoa com daltonismo, quero que as categorias também tenham texturas, para diferenciá-las mesmo quando as cores parecem próximas.

**Critérios de aceite**
- Opções Automático, Sempre e Nunca; no automático, as texturas ligam nos modos de daltonismo.
- Cada categoria tem uma textura própria (listras em 45° ou 135°, pontos ou trama); "Outros" é sempre hachurado.
- Texturas em tom sobre tom, só em áreas pequenas (faixa de gastos e amostras).

### Convite para ajustar as cores na primeira visita

História, 1 ponto, prioridade média, sprint 4.

**História:** Como pessoa com daltonismo que abre o app pela primeira vez, quero ser avisada de que existe um ajuste de cores, para não precisar procurar.

**Critérios de aceite**
- Faixa "Tem daltonismo?" com os botões "Ajustar cores" e "Agora não".
- Some depois que a pessoa escolhe um modo ou dispensa o convite.

### Revisar se alguma informação depende só da cor

Tarefa, 2 pontos, prioridade alta, sprint 4.

**Objetivo:** Garantir que toda informação passada por cor também seja passada de outro jeito.

**Critérios de aceite**
- Entradas e saídas: sinais + e − e posição no gráfico.
- Categorias: ícone e nome.
- Erros de formulário: ícone, texto e borda mais grossa.
- Conferido com a simulação "sem cores".

### Ver como uma pessoa com daltonismo enxerga

História, 3 pontos, prioridade média, sprint 5.

**História:** Como familiar sem daltonismo, quero ver a tela como uma pessoa com daltonismo vê, para entender a diferença e ajudar melhor.

**Critérios de aceite**
- Opções: protanopia, deuteranopia, tritanopia e sem cores (acromatopsia).
- Filtros SVG com as mesmas matrizes usadas na validação das paletas.
- Faixa "Simulando..." com o botão "Parar simulação".
- Não muda a paleta escolhida e não fica salva.

## Épico: Qualidade e entrega

Acessibilidade, responsividade, correções, testes e publicação. Rótulo: `qualidade`. 26 pontos.

### Navegação por teclado e leitores de tela

Tarefa, 3 pontos, prioridade alta, sprint 5.

**Objetivo:** Garantir que o app funcione sem mouse e com leitor de tela.

**Critérios de aceite**
- Foco visível de 3px em todos os controles.
- Diálogos nativos: o foco fica preso dentro, Esc fecha e o foco volta ao botão que abriu.
- Campos com rótulo e erros ligados por aria-describedby.
- Avisos numa região "status"; gráficos com tabela equivalente.

### Layout responsivo do celular ao desktop

Tarefa, 3 pontos, prioridade alta, sprint 5.

**Objetivo:** Deixar todas as telas usáveis de 375px até telas largas.

**Critérios de aceite**
- Sem rolagem horizontal a partir de 375px.
- No celular, abas de navegação sob o cabeçalho e botão "+" com o nome acessível "Novo lançamento".
- Conta do mês, gráficos e tabelas legíveis em 375px.

### Revisão visual nos quatro modos de visão

Tarefa, 2 pontos, prioridade média, sprint 6.

**Objetivo:** Encontrar problemas visuais antes da entrega.

**Critérios de aceite**
- Capturas de cada página em 1440px e 390px nos quatro modos.
- Cada problema encontrado vira um bug no backlog.

### Rótulos da conta do mês invadem a tabela no desktop

Bug, 2 pontos, prioridade alta, sprint 6.

**Como reproduzir:** Abrir o Resumo numa janela com 1440px de largura: "entradas", "saídas" e "sobraram" passam por cima da coluna "Para onde foi o dinheiro".

**Causa:** O tamanho dos números seguia a largura da janela, e não a da coluna.

**Correção:** Tamanho calculado pela largura do contêiner (container queries) e mais espaço para a coluna da conta.

### Botão "+" encolhido no cabeçalho do celular

Bug, 1 ponto, prioridade alta, sprint 6.

**Como reproduzir:** Abrir o app com 375px de largura: o ícone "+" do botão "Novo lançamento" aparece minúsculo.

**Causa:** O CSS global era carregado depois dos módulos, e o padding de .botao vencia o do botão (mesma especificidade).

**Correção:** Importar globals.css antes dos componentes no layout.

### Ajustar textos do rodapé e do painel de visão

Tarefa, 1 ponto, prioridade baixa, sprint 6.

**Objetivo:** Aplicar os ajustes de texto pedidos na revisão.

**Critérios de aceite**
- Remover o texto do rodapé sobre onde os dados ficam guardados.
- Remover o texto de ajuda abaixo da simulação.
- Trocar o rótulo "Ver como outra pessoa enxerga" por "Ver como uma pessoa com daltonismo enxerga".

### Testes de ponta a ponta dos fluxos principais

Tarefa, 5 pontos, prioridade média, sprint 6.

**Objetivo:** Automatizar com Playwright os fluxos que mais quebram.

**Critérios de aceite**
- Cenários: validação do formulário, salvar, editar, excluir e desfazer, lançamento em outro mês, troca de paleta, simulação e busca sem acento.
- Os testes rodam no build de produção, sem erros no console.

### Testes unitários de cálculos e formatação

Tarefa, 3 pontos, prioridade média, sprint 6.

**Objetivo:** Proteger as regras de negócio contra regressões.

**Critérios de aceite**
- Cobrir resumo do mês, gastos por categoria, série mensal e leitura de valores digitados.
- Rodar com um script npm (por exemplo, npm test).

### Build de produção, página 404 e README

Tarefa, 2 pontos, prioridade alta, sprint 6.

**Objetivo:** Deixar o projeto pronto para entregar.

**Critérios de aceite**
- npm run build gera as páginas estáticas sem avisos.
- Página 404 em português com link para o resumo.
- README em português: como rodar, scripts, visão de cores e validação das paletas.

### Publicar o app na Vercel

Tarefa, 2 pontos, prioridade média, sprint 6.

**Objetivo:** Ter um link público para a avaliação.

**Critérios de aceite**
- Deploy a partir do repositório, com o build de produção.
- Link público testado no celular e no desktop.

### Preparar a demonstração

Tarefa, 2 pontos, prioridade média, sprint 6.

**Objetivo:** Apresentar o projeto mostrando a adaptação de cores funcionando.

**Critérios de aceite**
- Roteiro: registrar um lançamento, trocar para cada modo de visão, mostrar a simulação "sem cores" e rodar npm run paletas.
- Dados de exemplo restaurados antes de apresentar.
