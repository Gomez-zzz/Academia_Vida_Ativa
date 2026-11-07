# Proposta completa de mudanças — UI/UX e front-end Vida Ativa

**Data:** 06/11/2026  
**Status:** proposta implementada no escopo visual; ver `auditoria/EVIDENCIAS-IMPLEMENTACAO-UX-UI-2026-11-06.md`.  
**Base da proposta:** inspeção estática do projeto e das evidências visuais registradas em `auditoria/visual/tema-grafite/`.

## Objetivo

Deixar a aplicação mais clara, rápida e confortável para a equipe que a usa diariamente e mais coerente para a pessoa que recebe a apresentação. A proposta preserva as regras funcionais existentes enquanto melhora hierarquia, fluxos, componentes, responsividade e acessibilidade.

## Decisões aplicadas nesta implementação

1. **Público da experiência entregue:** mantido como painel demonstrativo/operacional existente. Portal de aluno e página comercial continuam sendo produtos separados.
2. **Identidade visual:** Carbono e Neon aplicada conforme o arquivo de referência após o feedback do usuário; grafite e azul permanecem no histórico.
3. **Formato de formulários longos:** preservadas as seções e o resumo de revisão existentes; aprimorada hierarquia e responsividade sem introduzir etapas desnecessárias às tarefas rápidas.
4. **Prioridade de execução:** mudanças visuais descritas foram aplicadas. Ver evidências e limites no relatório de implementação e os tokens finais em `auditoria/TEMA-CARBONO-NEON-2026-11-06.md`.

## Lista de mudanças propostas

### 1. Direção visual e identidade

- Consolidar a paleta aprovada como tokens semânticos únicos (fundo, superfície, texto principal/secundário, ação primária, foco, sucesso, atenção e erro).
- Manter o tema grafite e azul por padrão. Criar, se aprovado, uma comparação Carbono e Neon em uma tela representativa, sem alterar os módulos existentes durante a avaliação.
- Se Carbono e Neon for escolhido, limitar o neon às ações primárias e indicadores pontuais; validar texto, estados e conforto em sessões longas antes de espalhar a cor.
- Definir escala tipográfica, pesos, line-height, largura de leitura, espaçamento de 4 px, raios, bordas, foco, elevação e durações de transição em tokens documentados.
- Estabelecer regra de hierarquia para superfícies: menos contornos concorrentes, separação mais clara entre conteúdo principal, controles e informações auxiliares.
- Uniformizar estilos de títulos, descrições, cartões, seções, botões, campos, badges, feedback, tabelas e estados vazios entre os seis módulos.

### 2. Shell e navegação principal

- Tornar a navegação entre módulos mais rápida e previsível para Administração e Portaria, mantendo a indicação do módulo ativo e a troca de perfil.
- Rever largura e peso visual da barra lateral para liberar espaço ao conteúdo em desktop.
- Em celular, substituir ou melhorar a faixa horizontal rolável: testar menu recolhível acessível ou seletor de módulo claramente identificado, considerando quantas vezes a equipe troca de módulo.
- Reforçar os nomes e o contexto da área de trabalho no cabeçalho; revisar redundância entre a marca, o nome da academia e o título do módulo.
- Manter e revisar o link de salto, estado ativo, ordem de teclado e anúncio acessível da mudança de módulo no shell com iframe.
- Definir comportamento do cabeçalho e da navegação durante rolagem longa, evitando que contexto e ações de navegação desapareçam quando forem necessários.

### 3. Gestão de Cadastros

- Reagrupar o formulário em blocos visuais e na ordem de preenchimento: identificação, contato, dados de saúde e revisão/salvamento.
- Avaliar índice/âncoras para pular entre seções em telas grandes; em celular, manter fluxo de leitura vertical e reduzir campos lado a lado.
- Diferenciar de forma inequívoca campos editáveis, calculados e somente leitura.
- Rever o campo Matrícula na criação de aluno: deixar explícito que é gerada automaticamente, confirmar momento da geração e evitar aparência de valor preexistente digitável.
- Harmonizar foto, prévia, instruções de formato/tamanho e ação de remoção para que o estado atual da foto fique compreensível.
- Dar destaque consistente à ação primária de salvar e tratar cancelar/descartar com confirmação contextual quando houver alterações.
- Reorganizar a lista de alunos com prioridade para identificação e ação mais usadas, filtros e ordenação quando confirmados pelos operadores; preservar leitura de CPF/telefone e edição.
- Definir visual de estado vazio e orientar próximo passo (cadastrar aluno ou ajustar busca).

### 4. Financeiro e Planos

- Separar a leitura em três áreas inequívocas: indicadores/resumo, edição de contrato e pagamento, e histórico/lista de registros.
- Manter visível a pessoa e o contrato selecionados durante edição, inclusive junto das ações que alteram o estado.
- Diferenciar claramente situação do contrato e situação do pagamento por rótulo, posição e texto de apoio; cor será redundante, não único meio de distinção.
- Tornar valores e datas mais fáceis de conferir com alinhamento, números tabulares e hierarquia consistente.
- Reavaliar quais indicadores merecem destaque e explicar período/fonte do valor para evitar interpretação errada.
- Na lista financeira em celular, avaliar apresentação de cada linha como cartão rotulado; no desktop, manter tabela se comparação cruzada for importante.
- Manter rolagem local onde a tabela larga for necessária, com cabeçalho identificável e indicação acessível de conteúdo rolável.
- Diferenciar claramente salvar/cadastrar, descartar, suspender e reativar; apresentar consequência da suspensão/reativação antes da confirmação.
- Construir estados claros para nenhum aluno selecionado, aluno sem contrato, contrato suspenso, cobrança paga, pendente e vencida.

### 5. Controle de Catraca / Portaria

- Preservar o resultado de validação como foco visual principal, com estado e orientação operacional em texto.
- Otimizar o ciclo de uso repetido: foco inicial/retorno adequado ao campo de matrícula, operação por teclado e feedback rápido sem perder o histórico.
- Distinguir visualmente liberado, atenção e bloqueado com mensagem direta, ícone/indicador e cor coerente; conferir contraste em cada estado.
- Rever hierarquia de identificação do aluno e acesso rápido, para a equipe localizar a decisão e o próximo passo sem competir com o resultado.
- Tornar histórico mais escaneável por data, pessoa, resultado e motivo; manter dados pessoais apenas onde necessários para a tarefa.
- Tratar estado inicial sem matrícula, entrada inválida e falha operacional com instruções que indiquem como continuar.

### 6. Liberação e Auditoria

- Separar formulário de autorização e registros já emitidos para tornar claro o que está sendo criado e o que já aconteceu.
- Dar hierarquia a tipo, justificativa, responsável e prazo, que são as informações de maior importância na decisão.
- Diferenciar autorização disponível, consumida, expirada e área restrita por rótulo textual e estado visual.
- Explicar antes de salvar o alcance e validade da autorização de uso único/temporário.
- Tornar a lista de auditoria fácil de filtrar e ler; em celular, priorizar detalhes em cartão quando a tabela exigir rolagem excessiva.
- Definir apresentação útil de lista vazia, autorização expirada e resultado de validação.

### 7. Avaliação Física

- Agrupar medidas, objetivo e data de reavaliação como blocos distintos e ordenar o preenchimento conforme a rotina real.
- Dar destaque ao aluno selecionado e à data associada a cada avaliação.
- Melhorar comparação do histórico por aluno e evolução entre datas; usar gráfico apenas se ajudar uma decisão e preservar os valores em formato textual acessível.
- Diferenciar ausência de medição de valor igual a zero e exibir unidades junto dos dados.
- Definir estado sem histórico, sucesso ao registrar e validação de valores/unidades sem depender apenas de bordas coloridas.

### 8. Relatórios Gerenciais

- Explicar filtros de período e critério de inclusão antes dos resultados para que os números sejam interpretados corretamente.
- Dar hierarquia ao resumo principal e à tabela/lista detalhada.
- Melhorar estados sem dados, período inválido e resultado carregado; indicar filtros ativos e facilitar limpar/ajustar.
- Garantir que ações de impressão/exportação só sejam apresentadas se estiverem implementadas e forem parte do escopo aprovado.
- Em celular, escolher campos prioritários e forma de inspeção de cada registro sem exigir rolagem horizontal longa.

### 9. Responsividade e conteúdo

- Revisar os seis módulos em larguras de celular, tablet e desktop usando tarefas e estados reais, incluindo larguras intermediárias e zoom/reflow.
- Usar Grid/Flex com colunas que possam encolher sem overflow e breakpoints baseados em quebra de conteúdo, não apenas em dispositivos padrão.
- Priorizar alvos de toque, ordem de campos, ações e leitura nos celulares; evitar cartões excessivamente apertados e tabelas impraticáveis.
- Padronizar linguagem de rótulos, instruções, confirmações, erros e sucesso, com frases curtas que expliquem ação e próximo passo.
- Revisar formatação de moeda, data, telefone, unidades e singular/plural para pt-BR, sem alterar regras de negócio sem autorização.
- Incluir estados vazio, carregando (se aplicável), erro, sucesso, desabilitado, somente leitura e alteração não salva em cada componente pertinente.

### 10. Acessibilidade e interação

- Verificar navegação integral por teclado, ordem de foco entre shell/iframe, retorno do foco depois de ações e foco visível.
- Revisar nomes acessíveis, landmarks, cabeçalhos, labels, instruções e relações entre erros e respectivos campos.
- Confirmar anúncios de feedback dinâmico sem repetição excessiva e sem depender exclusivamente de cor.
- Medir contraste dos pares efetivamente renderizados para texto e controles em cada tema e estado, inclusive hover, disabled, foco, erro e sucesso.
- Validar zoom/reflow, movimento reduzido, áreas de toque, conteúdo cortado e uso com leitor de tela nas telas prioritárias.
- Garantir que transições sejam discretas, funcionais e respeitem `prefers-reduced-motion`; adotar uma duração coerente por tipo de interação em vez de um único número obrigatório.

### 11. Engenharia front-end e preservação de comportamento

- Preservar IDs, classes, `name`, `target`, atributos ARIA e eventos utilizados por `main.js`, `assets/demo.js` e scripts dos módulos, salvo mudança acompanhada de ajuste e verificação de todos os consumidores.
- Continuar com tokens e componentes compartilhados; remover duplicação apenas após mapear dependências e confirmar que seletores globais não causam efeitos cruzados.
- Organizar CSS por camadas: tokens/fundação, componentes compartilhados, shell e exceções de módulo, com escopo e convenção de nomes claros.
- Evitar estilos inline e especificidade crescente; usar propriedades customizadas semânticas e estados consistentes.
- Não introduzir framework, biblioteca, fonte remota ou dependência sem ganho claro e aprovação de escopo.
- Manter separadas alterações visuais de mudanças em regras de matrícula, contratos, pagamentos, catraca, persistência ou permissões.
- Documentar componentes, tokens, breakpoints e contratos DOM para futuras alterações seguras.

### 12. Evidências e aceite de cada etapa

- Capturar antes/depois no mesmo tamanho, dados e estado para telas alteradas.
- Revisar Cadastro e Financeiro primeiro com a equipe que executa as tarefas; validar a direção visual com a pessoa que recebe a apresentação.
- Conferir os seis módulos depois de alterações no CSS compartilhado.
- Verificar teclado, estados de feedback, responsividade e tabelas após cada etapa.
- Executar a regressão existente depois de mudanças e registrar resultado. Teste de lógica não substitui revisão visual nem validação com pessoas.
- Atualizar a documentação de evidências com arquivos, comportamento visual conferido, limites e regressões identificadas.

## Priorização proposta

| Prioridade | Mudanças | Motivo |
|---|---|---|
| P0 — Decisão antes da execução | Público da página, identidade visual e formato dos formulários | Impedem retrabalho e definem a experiência correta |
| P1 — Protótipo para validação | Cadastro, Financeiro, shell móvel e navegação por perfil | Áreas mais densas e mais centrais ao uso diário |
| P2 — Sistema compartilhado | Tokens, componentes, estados, tabela e conteúdo | Cria consistência e permite escalar o padrão com segurança |
| P3 — Demais módulos | Portaria, Liberação/Auditoria, Avaliação e Relatórios | Aplicar padrões validados às tarefas específicas |
| P4 — Verificação final | Acessibilidade, regressão, capturas e documentação | Reduz risco visual e funcional após mudanças compartilhadas |

## Fora do escopo desta proposta

- Implementar autenticação, backend, banco de dados, pagamentos reais ou conexão com catraca física.
- Mudar regras funcionais e cálculos já existentes.
- Publicar ou substituir a aplicação atual.
- Escolher Carbono e Neon sem comparação e validação prévia.
- Alterar a interface antes de a proposta ser revisada e aprovada.

## Como revisar e aprovar

Revise primeiro as quatro decisões no início do documento. Depois, aprove as etapas da tabela de priorização ou indique os itens que deseja remover/alterar. A aprovação pode ser limitada ao protótipo de Cadastro e Financeiro; nesse caso, nenhuma mudança será propagada aos outros módulos até a revisão do resultado.

## Referências do projeto consultadas

- `auditoria/REVIEW_UX_UI.md`
- `auditoria/IDENTIDADE-VISUAL-2026-10-09.md`
- `auditoria/TEMA-GRAFITE-2026-10-09.md`
- `auditoria/MANUTENCOES-FRONTEND.md`
- `assets/app.css`, `style.css`, `index.html`, `main.js`
- Capturas: `auditoria/visual/tema-grafite/cadastro-1280.jpg`, `financeiro-1280.jpg`, `portaria-1280.jpg`, `cadastro-360.jpg`
