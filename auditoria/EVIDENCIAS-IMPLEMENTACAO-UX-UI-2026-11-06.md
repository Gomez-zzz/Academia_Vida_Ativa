# Evidências da implementação visual — Vida Ativa

**Data:** 06/11/2026  
**Status:** implementação aplicada no painel administrativo/demonstrativo e tema Carbono e Neon.  
**Prévia local:** http://127.0.0.1:8765/

## Direção adotada

Depois do feedback do usuário, apliquei a paleta obrigatória do arquivo de referência: fundos carbono (`#151718`), superfícies chumbo (`#1F2226`), texto branco/cinza e verde cyber (`#CCFF00`). O histórico de grafite e azul permanece nos relatórios antigos, sem substituir o registro histórico. A aplicação continua como painel de gestão/demonstração; não a converti em página comercial ou portal do aluno, pois isso seria outro produto.

## Mudanças aplicadas e motivo

| Área/arquivo | Implementado | Por que é melhor que o estado anterior |
|---|---|---|
| `assets/app.css` | Tokens compartilhados para cores, espaçamento, raio, sombra e duração; paleta Carbono e Neon; largura de leitura mais ampla; escala de título fluida; maior distinção entre superfície de edição e superfície externa; foco visível; resposta breve de hover/active com suporte a movimento reduzido. | Antes, as cores eram grafite azulado com azul claro e alguns valores/transições eram avulsos. A nova paleta atende à direção visual anexada, dá à marca um acento energético reconhecível e mantém texto e controles destacados em superfícies escuras; tokens compartilhados evitam variações acidentais por módulo. |
| `style.css` | Navegação móvel recolhível com nome do módulo atual, estado `aria-expanded`, fechamento ao escolher um destino e tecla Escape; cabeçalho/brand ajustados; largura lateral refinada; mantém o menu lateral no desktop. | Antes, no celular todos os módulos ocupavam uma faixa rolável que escondia parte das opções. O menu recolhível mostra os destinos em uma grade compacta e libera altura para o conteúdo; Escape e o estado anunciado ajudam teclado e tecnologias assistivas. |
| `index.html`, `main.js` | Botão móvel conectado ao menu existente; texto do botão acompanha o módulo ativo; Escape retorna o foco ao acionador; módulos carregados no iframe recebem a classe `embedded`, escondendo o link “Voltar à navegação” redundante no painel. | Reaproveita links e contratos DOM existentes, mas evita duplicar a navegação que o shell já fornece. A versão do módulo aberta diretamente continua com seu link de retorno. |
| Cadastro — `modulos/mod01-cadastros/index.html` e `style.css` | Ajuda associada ao campo somente leitura Matrícula explica que o código é gerado; lista de alunos identificada como região nomeada e focável por teclado; refinamento da hierarquia entre blocos pessoais e de saúde. | Antes, o campo preenchido em um novo cadastro podia parecer um dado digitável ou reaproveitado. A explicação torna a geração automática explícita; o foco na lista ajuda a percorrer tabelas estreitas sem depender de mouse. |
| Financeiro — `modulos/modulo 2/index.html` e `style.css` | Mantidos os fluxos já existentes de busca, filtros, formulário progressivo, plano, resumo antes de salvar e cartões em larguras menores; as descrições dos indicadores deixam de sumir no celular; lista de contratos/pagamentos passa a ser uma região nomeada e focável. | A área já tinha separação entre consulta e operação e cartão responsivo em tablet/celular. O ajuste evita perder o significado dos indicadores no celular e torna a lista rolável alcançável por teclado, sem desfazer o fluxo atual nem esconder colunas relevantes. |
| Portaria — `modulos/mod03-catraca/style.css` e `index.html` | Painel do resultado recebe mais área de leitura; relógio/histórico rápido é separado visualmente; histórico de acessos é região nomeada e focável. | O resultado de liberar/bloquear é a decisão principal do operador. Dar-lhe área estável e contraste estrutural reduz competição com os controles de entrada e deixa o histórico fácil de percorrer. |
| Liberação e Auditoria — `modulos/mod04-auditoria/index.html` e `style.css` | Orientação da autorização recebe maior legibilidade; histórico nomeado e navegável pelo teclado. | A validade e o motivo definem o alcance da liberação. A instrução ganha peso suficiente e o registro pode ser explorado com teclado quando exceder a largura do cartão. |
| Avaliação Física — `modulos/Modulo 5/index.html` e `style.css` | Resultado da próxima avaliação passa a ter alinhamento de saída; filtro do histórico ganha largura mínima mais previsível; tabela nomeada e focável. | O valor calculado fica visualmente separado de campos editáveis e o filtro deixa de comprimir o cabeçalho em larguras médias. A tabela preserva a apresentação de métricas existente. |
| Relatórios — `modulos/mod06-relatorios/index.html` e `style.css` | Filtros e indicadores mantêm colunas que podem encolher sem forçar largura mínima excessiva; tabela de resultados nomeada e focável. | Antes, valores longos podiam pressionar cartões de indicador e a rolagem da tabela não tinha região acessível explícita. Agora o resumo quebra conteúdo sem deformar o grid e a região pode receber foco. |

## Evidências visuais

Capturas feitas depois da implementação em Edge, servindo o projeto localmente:

- Shell e Cadastro, desktop 1440 × 1000: `auditoria/visual/implementacao-2026-11/shell-desktop.jpg`
- Shell e Cadastro, celular 390 × 844: `auditoria/visual/implementacao-2026-11/shell-mobile.jpg`
- Financeiro, desktop 1440 × 1000: `auditoria/visual/implementacao-2026-11/financeiro-desktop.jpg`
- Portaria, desktop 1440 × 1000: `auditoria/visual/implementacao-2026-11/portaria-desktop.jpg`

O tema Carbono e Neon está visível nas capturas: fundo quase preto, cartões chumbo, ação neon com texto escuro e seleção neon no menu.

As capturas anteriores do mesmo projeto estão em `auditoria/visual/tema-grafite/` e servem como referência do estado anterior. Os artefatos novos mostram a tipografia, espaçamento, superfície, agrupamento de tela e layout móvel depois da mudança. A captura de celular mostra o estado recolhido da navegação; os estados expandido/teclado não foram capturados em imagem.

## Validação executada

- `node tests/front-end.test.cjs` — **55/55 cenários aprovados**. A suíte cobre regras de negócio locais, renderizadores, navegação, controladores, estados financeiros, tema e contraste computado.
- O servidor estático foi aberto em `http://127.0.0.1:8765/` para produzir as capturas. Os seis controladores são verificados pela suíte; as capturas visuais deste conjunto cobrem shell/Cadastro, Financeiro e Portaria.
- As regiões das tabelas receberam `tabindex="0"`, `role="region"`, rótulo acessível e estilo de foco, mantendo a leitura tabular e os cabeçalhos.
- Os IDs/classes consumidos pelos controladores foram preservados. As alterações no comportamento do shell limitam-se ao menu móvel e à apresentação do conteúdo já carregado.

## Limites e escolhas ainda abertas

- Não alterei regras de cadastro, cobrança, contrato, acesso, liberação, avaliações ou relatórios.
- O sistema continua sendo uma prévia local com dados demonstrativos; não foi criado portal do aluno, autenticação, API ou página comercial.
- A proposta de comparar as duas paletas foi substituída pela aplicação direta de Carbono e Neon após o feedback do usuário. Uma avaliação de conforto em turnos longos ainda depende de validação com a equipe.
- As capturas de evidência novas não incluem cada um dos seis módulos em desktop e celular. A suíte de 55 cenários passou, mas isso não substitui uma rodada completa de observação de tarefas com operadores e clientes.

## Arquivos principais alterados

`assets/app.css`, `style.css`, `index.html`, `main.js`; HTML/CSS dos módulos Gestão de Cadastros, Financeiro e Planos, Controle de Catraca, Liberação e Auditoria, Avaliação Física e Relatórios Gerenciais. A proposta original permanece em `auditoria/PROPOSTA-MUDANCAS-UX-UI.md` e a revisão inicial em `auditoria/REVIEW_UX_UI.md`.
