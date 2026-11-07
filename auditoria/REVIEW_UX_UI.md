# Revisão sênior de UI/UX e engenharia front-end — Vida Ativa

**Data:** 06/11/2026  
**Escopo:** revisão visual e técnica para orientar a próxima etapa. Nenhuma interface foi alterada nesta revisão.

> **Atualização 06/11/2026:** após o usuário apontar que a paleta da referência deveria ser aplicada, o tema Carbono e Neon foi implementado. Veja `TEMA-CARBONO-NEON-2026-11-06.md` e `EVIDENCIAS-IMPLEMENTACAO-UX-UI-2026-11-06.md`. As recomendações abaixo descrevem a avaliação anterior à implementação.

## Resumo executivo

O projeto já tem uma base mais consistente do que um protótipo descartável: seis módulos usam componentes e tokens compartilhados, há adaptação para celular, estados de formulário e feedback, navegação por perfil, foco visível e evidências anteriores em três larguras. A tela da Portaria também dá destaque suficiente ao resultado do acesso, e o Financeiro organiza indicadores, formulário e registros em áreas reconhecíveis.

O maior ganho agora não viria de aplicar uma paleta nova isoladamente. Eu priorizaria reduzir esforço e densidade nas tarefas frequentes, reforçar hierarquia e legibilidade no tema atual, e definir claramente a jornada de demonstração ao cliente. As capturas atuais mostram conteúdo extenso com rolagem vertical, formulários com muitas informações na mesma tela e, no celular, navegação principal por rolagem horizontal. Isso funciona como estrutura, mas ainda pode exigir orientação e memória do operador.

## Direção visual e decisão de produto

O arquivo de referência descreve uma identidade “Carbono e Neon”, com fundo quase preto e verde `#CCFF00`, e recomenda criar esta auditoria antes de qualquer execução visual. Já `auditoria/IDENTIDADE-VISUAL-2026-10-09.md`, `auditoria/TEMA-GRAFITE-2026-10-09.md` e `auditoria/MANUTENCOES-FRONTEND.md` registram uma escolha posterior de grafite suave com azul para a apresentação ao cliente. Portanto, trato Carbono e Neon como direção proposta no anexo, não como autorização para substituir a decisão mais recente documentada.

Minha recomendação é manter grafite e azul como base aprovada até haver decisão de produto em contrário. Se o objetivo for experimentar o estilo esportivo, eu faria primeiro uma comparação visual isolada — mesma tela, mesmos dados e componentes, tema atual versus Carbono e Neon — e avaliaria conforto em turnos longos, leitura de texto, contraste e percepção de marca. Neon deve ficar reservado a ações e estados de destaque, sem virar cor de texto ou superfície extensa. A decisão deve ser aplicada por tokens, sem duplicar regras por módulo.

## O que já está bem encaminhado

- `assets/app.css` concentra paleta, componentes, controles, estados e breakpoints compartilhados pelos módulos.
- Os módulos têm títulos, descrições, agrupamento em cartões e formulários com labels; o layout troca colunas por uma coluna em telas menores.
- Campos e botões têm alvo de interação confortável; o foco de teclado é visível e há suporte a movimento reduzido.
- Tabelas têm contêiner de rolagem horizontal próprio; a tabela financeira preserva colunas de datas e valores.
- O shell preserva hooks de navegação (`id`, `class`, `name` e `target`) e mostra claramente o módulo selecionado.
- As evidências em `auditoria/visual/tema-grafite/` cobrem os seis módulos em desktop e celular, além de estados da Portaria.

## Achados e recomendações

### P1 — Melhorar o fluxo de trabalho recorrente

**Observação:** Cadastros e Financeiro concentram muitos campos e ações numa única página comprida. O Financeiro combina indicadores, edição de contrato/pagamento e registros; Cadastros reúne dados pessoais e de saúde. O scroll é esperado, mas o usuário pode perder contexto e percorrer campos pouco relevantes para a tarefa atual.

**Eu faria:**

1. Mapear as cinco tarefas mais frequentes de cada perfil (Administração e Portaria) e ordenar os módulos pela frequência e risco operacional.
2. Em formulários longos, agrupar campos por etapas sem esconder contexto importante: por exemplo, dados pessoais, contato, saúde e revisão/salvamento. Se etapas forem excessivas para a rotina, manter uma página única com âncoras/índice e cabeçalhos de seção bem marcados.
3. No Financeiro, separar visualmente “resumo do contrato”, “alterações” e “histórico de cobranças”, deixando evidente o registro selecionado e quais ações afetam contrato versus pagamento.
4. Manter ações primárias em posição previsível e explicar estados sem depender apenas de cor. Antes de ações que suspendem, cancelam ou descartam mudanças, mostrar consequência e alvo da ação.

**Resultado esperado:** menos busca visual, menos erros de contexto e salvamento mais previsível para quem usa o sistema repetidamente.

### P1 — Definir a experiência que o cliente recebe

**Observação:** A aplicação atual é claramente um painel administrativo com seletor de área e navegação de módulos. Isso demonstra a operação, mas não constitui uma página de apresentação ou portal do aluno/cliente. A própria documentação descreve dados e serviços locais fictícios.

**Eu faria:** decidir qual é a “página recebida pelo cliente”: (a) apresentação comercial da academia, (b) portal do aluno, ou (c) demonstração do painel para um comprador/gestor. Cada objetivo pede conteúdo, navegação e tom diferentes. Para uma demonstração comercial, eu criaria uma entrada curta com proposta de valor, roteiro e dados demonstrativos coerentes; para uso de aluno, uma área própria com autenticação e ações orientadas ao aluno; para apresentação do painel, eu reduziria elementos de bastidor e prepararia uma sequência guiada de tarefas. Não tentaria atender os três públicos na mesma tela.

### P2 — Reforçar hierarquia visual e legibilidade

**Observação:** Nas capturas atuais o tema é uniforme, com cartões contornados e campos de aparência semelhante. A identidade é consistente, mas a prioridade visual entre conteúdo, controles e divisórias pode ficar achatada, especialmente em formulários densos. O shell mantém uma coluna lateral generosa; em telas menores a navegação vira uma faixa horizontal com rolagem.

**Eu faria:**

- Criar uma escala tipográfica explícita para título de página, título de seção, rótulo e texto auxiliar, com line-height adequado e comprimento máximo para descrições.
- Reservar superfície e borda mais fortes para áreas que exigem ação; usar divisórias mais discretas nas demais. Evitar que cada elemento pareça um cartão independente.
- Garantir que estados selecionado, foco, erro, aviso e sucesso tenham sinal visual e textual consistente.
- Na navegação móvel, testar uma solução compacta que não esconda destinos além da primeira faixa: menu recolhível acessível, seletor de módulo com nome completo ou navegação horizontal com indicação clara de que há mais itens. A alternativa depende da frequência de troca de módulo.
- Revisar o estado inicial do cadastro: a captura exibe um campo de matrícula preenchido para “Novo aluno”. Confirmar se isso é esperado e se o valor é apresentado como informação gerada/inalterável, para não parecer dado digitado ou reutilizado.

### P2 — Tratar tabelas como ferramenta de trabalho

**Observação:** rolagem local protege o layout geral, porém tabelas largas ainda podem exigir deslocamento horizontal e dificultar comparar um registro distante com seu cabeçalho.

**Eu faria:** manter a tabela completa em desktop, mas definir colunas prioritárias por tarefa; em celular, transformar cada registro em cartão/lista com rótulos quando a comparação tabular deixar de ser útil. Preservaria filtros, ordenação e ações por registro, com estados vazios que indiquem o próximo passo. Se a tabela financeira continuar horizontal, manter cabeçalho identificável e sinalizar o contêiner rolável de forma acessível.

### P2 — Detalhar o sistema de design e os contratos de componente

**Observação:** os tokens existentes cobrem cores e raio, mas espaçamentos, elevação e transições continuam parcialmente definidos diretamente nas regras. O botão usa transições de 120 ms, enquanto o arquivo de referência propõe 180 ms.

**Eu faria:** formalizar tokens para espaço (escala de 4 px), tipografia, raios, foco, camadas/sombras e duração/easing; usar nomes semânticos por intenção (ação primária, superfície, texto secundário, perigo) e documentar exemplos de uso. Eu não adotaria 180 ms como requisito universal: validaria duração por componente, respeitaria `prefers-reduced-motion` e usaria movimento curto para resposta, não como decoração contínua.

Antes de qualquer refatoração estrutural, faria inventário de seletores, IDs, `name`, `target`, atributos ARIA, eventos e contratos consumidos pelos scripts. Alteraria componentes gradualmente e manteria hooks estáveis. Os estilos de cada módulo encaminham para a folha compartilhada; isso é positivo para consistência, mas pede revisão de regressão visual nos seis módulos após mudanças globais.

### P3 — Acabamento de acessibilidade e conteúdo

**Eu faria:** validar navegação completa só por teclado, ordem de foco entre shell e iframe, títulos acessíveis dos módulos, leitura por leitor de tela, zoom/reflow real, mensagens dinâmicas e erros associados aos campos. Revisaria foco visível em todos os controles nativos e se estados indisponíveis continuam legíveis. Escreveria mensagens curtas em linguagem operacional, explicando erro e correção possível. As auditorias existentes relatam contrastes medidos e foco, mas não equivalem a certificação completa de acessibilidade.

## Plano recomendado de execução

1. **Decisão de produto:** confirmar público e objetivo principal da página entregue; registrar paleta aprovada (atual ou teste Carbono e Neon).
2. **Mapa de tarefas:** listar tarefas por perfil, frequência, risco, dados necessários e resultado esperado; identificar os pontos de maior espera e rolagem.
3. **Protótipo de duas telas:** redesenhar Cadastro e Financeiro, cobrindo desktop e celular, incluindo estados vazio, preenchido, erro, sucesso e alteração não salva. Validar com operador e cliente antes de propagar padrões.
4. **Fundação visual:** fechar tokens e componentes com estados, foco e conteúdo; preservar os hooks DOM usados por `main.js`, `assets/demo.js` e controladores dos módulos.
5. **Implementação incremental:** aplicar primeiro aos módulos de maior frequência, revisar cada breakpoint e manter o histórico de mudanças. Evitar uma reescrita completa antes de provar o padrão em telas reais.
6. **Revisão de qualidade:** comparar capturas nas mesmas resoluções e estados, verificar teclado/leitor de tela/reflow, e rodar a regressão existente depois de cada mudança compartilhada. Não confundir teste de regras com validação visual.

## Limites desta revisão

Esta é uma revisão estática dos arquivos e das evidências já armazenadas, não uma sessão de observação com operadores nem uma inspeção ao vivo no navegador. As capturas consultadas foram `auditoria/visual/tema-grafite/cadastro-1280.jpg`, `financeiro-1280.jpg`, `portaria-1280.jpg` e `cadastro-360.jpg`. Não executei testes nesta etapa e não alterei arquivos de interface. As recomendações devem ser validadas com usuários e com o objetivo de produto antes da implementação.
