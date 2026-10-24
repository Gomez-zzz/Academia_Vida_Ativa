# Auditoria técnica — Academia Vida Ativa

Data: 08/10/2026. Escopo: os 21 arquivos originais da aplicação, incluindo a tela principal e os seis módulos. Revisão de HTML, CSS, JavaScript, integração, segurança, regras de negócio e preparação para backend.

A aplicação funciona como um protótipo de telas com comportamentos locais. Existem erros de código e funcionalidades incompletas. O repositório não contém API, servidor de aplicação, banco de dados, autenticação ou integração com equipamento de catraca. Portanto, não há implementação de backend para auditar; esses componentes aparecem abaixo como lacunas de arquitetura, sem confundi-los com defeitos de funções já implementadas.

Foram registrados **19 achados: 7 P1, 10 P2 e 2 P3**. P1 indica correção prioritária ou requisito que bloqueia uso operacional; P2 indica funcionamento incorreto, dados incompletos ou problemas de uso; P3 indica organização e prevenção de manutenção. Nenhum cenário demonstrou um incidente em produção.

## Método e limites

- Leitura de todos os arquivos originais e conferência das referências locais.
- Verificação de sintaxe dos sete scripts JavaScript.
- Execução dos scripts reais em Node.js, usando VM e um DOM mínimo simulado, com dados fictícios.
- Conferência de vínculos de formulários, IDs, labels, menus, breakpoints e operações de armazenamento.
- Consulta à documentação primária de MDN e OWASP para fundamentar recomendações de HTML, datas e autorização.
- O navegador integrado não carregou o servidor local: `net::ERR_CONNECTION_TIMED_OUT`. A validação visual, de teclado, de leitores de tela e de formulários em navegador real ficou pendente.
- O DOM simulado não aplica as restrições nativas dos formulários, não renderiza CSS, não interpreta HTML inserido e não executa handlers provenientes desse HTML. A reprodução de valores inválidos confirma o comportamento dos handlers; a possibilidade de digitar esses valores foi conferida separadamente nos atributos HTML.
- O verificador usa um parser simplificado para o HTML atual. Ele é um diagnóstico desta auditoria, não uma suíte completa de testes ou um validador de HTML.
- Não foram executados testes de carga, hardware, implantação, banco, concorrência ou autorização em servidor, pois não há esses componentes no projeto.

Arquivos desta auditoria: [verificador](<C:/Users/erick/Downloads/Projeto Unificado/auditoria/verificar.cjs>) e [evidências](<C:/Users/erick/Downloads/Projeto Unificado/auditoria/evidencias.json>). O verificador registra 20 grupos de verificações, incluindo hashes do código revisado. Seu código de saída indica a execução do diagnóstico; os achados conhecidos são registrados no JSON e não tornam a saída automaticamente inválida.

Para reproduzir na raiz do projeto, com Node.js disponível:

```powershell
node auditoria/verificar.cjs
```

O comando atualiza somente `auditoria/evidencias.json`. Os cenários não alteram os arquivos da aplicação.

## Achados prioritários

### F01 — P1 — Inicialização da catraca interrompida por elementos inexistentes

**Tipo:** defeito confirmado por execução.

**Código:** [script.js:294](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod03-catraca/script.js:294>) e [index.html:77](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod03-catraca/index.html:77>).

Os três botões de simulação foram comentados no HTML. As consultas retornam `null`, mas o script chama `addEventListener` sem conferir sua existência. A execução gera `Cannot read properties of null (reading 'addEventListener')` na linha 294 e não chega às chamadas finais de inicialização.

**Impacto:** inicialização parcial e erro de runtime. O evento de validação manual foi registrado antes da exceção e continua funcionando; a falha não significa que toda a catraca esteja inoperante.

**Manutenção:** retirar os eventos e referências da funcionalidade removida ou montar os eventos somente quando os elementos existirem.

**Aceite:** abrir o módulo sem exceções, finalizar a inicialização e preservar os caminhos de matrícula válida e inexistente. Evidência: `inicializacao`.

### F02 — P1 — Texto dos formulários inserido como HTML

**Tipo:** fluxo vulnerável confirmado por código e execução; execução de payload no navegador não foi realizada.

**Código:** [financeiro/script.js:24](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/script.js:24>), [avaliação/script.js:73](<C:/Users/erick/Downloads/Projeto Unificado/modulos/Modulo 5/script.js:73>) e [catraca/script.js:229](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod03-catraca/script.js:229>).

Nome e matrícula são interpolados diretamente em `innerHTML`. O nome fictício `<b>Teste</b>` chega sem escape à linha da tabela no financeiro e na avaliação. Na catraca, `<b>x</b>` também chega ao histórico e cabe no limite de dez caracteres.

**Impacto:** injeção de marcação e, nos campos livres de financeiro e avaliação, vulnerabilidade de DOM XSS. Hoje a entrada vem dos formulários locais; não foi demonstrada uma origem externa ou persistência do ataque. Na catraca foi confirmada injeção de HTML, sem afirmar execução de JavaScript através do campo limitado.

**Manutenção:** construir células com `createElement` e atribuir dados com `textContent`. Rever também os renderizadores antes de trocar os dados fixos por dados externos. Ícones constantes não exigem o mesmo tratamento de entrada do usuário.

**Aceite:** caracteres especiais aparecem como texto; entradas não criam elementos nem executam código. A documentação explica o risco e recomenda texto literal quando não se deseja HTML. [MDN — innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML). Evidências: `financeiro-renderizacao`, `avaliacao-renderizacao` e `catraca-html-no-log`.

### F03 — P1 — Registros não são persistidos

**Tipo:** lacuna de arquitetura com comportamento confirmado.

**Código:** [cadastro/script.js:126](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/script.js:126>), [financeiro/script.js:33](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/script.js:33>) e [avaliação/script.js:84](<C:/Users/erick/Downloads/Projeto Unificado/modulos/Modulo 5/script.js:84>).

O cadastro apenas imprime JSON e apresenta sucesso. Financeiro e avaliação acrescentam linhas ao DOM. Não há gravação de alunos, contratos, pagamentos ou avaliações. Reabrir o documento elimina as linhas adicionadas. Como a navegação troca o documento do iframe, mudar de módulo e voltar também descarta esses registros.

**Impacto:** os registros não sustentam uma operação real e a mensagem de cadastro/avaliação pode ser interpretada como confirmação de gravação.

**Manutenção:** definir o modo de uso do projeto e implementar persistência compatível. Para múltiplos operadores e dados reais, usar API e banco, retornando sucesso somente após a gravação. Enquanto for demonstração, identificar claramente a simulação.

**Aceite:** registro continua disponível após navegar e recarregar; falha de gravação não gera sucesso nem limpa o formulário. Preferências de perfil/módulo em `localStorage` já existem, mas não salvam os registros. Evidências: `cadastro-semantica`, `financeiro-renderizacao` e `avaliacao-renderizacao`.

### F04 — P1 — Perfis e identidade não oferecem autorização real

**Tipo:** lacuna de arquitetura.

**Código:** [main.js:37](<C:/Users/erick/Downloads/Projeto Unificado/main.js:37>), [seletor de perfil:20](<C:/Users/erick/Downloads/Projeto Unificado/index.html:20>) e [usuário da liberação:173](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod04-auditoria/index.html:173>).

Qualquer pessoa pode escolher Administração. A restrição consiste em ocultar itens de menu. As páginas podem ser abertas diretamente. O campo “Usuário autenticado” recebe texto livre e o perfil responsável também é escolhido pelo operador.

**Impacto:** não há identidade verificável nem autorização para operações ou acesso aos dados. O seletor é útil para demonstrar telas, mas não constitui RBAC de um sistema operacional.

**Manutenção:** autenticar usuários, obter identidade/perfil da sessão e validar permissões em cada operação da API. Os campos de autoria devem vir da sessão, sem depender de nome digitado.

**Aceite:** uma sessão de portaria não consegue executar operações administrativas mesmo usando a URL diretamente; o log usa a identidade autenticada. Essa recomendação segue a validação de autorização no servidor em cada solicitação. [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

### F05 — P1 — Suspensão sobrescrita e congelamento de dias ausente

**Tipo:** defeito confirmado e funcionalidade parcial.

**Código:** [script.js:28](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/script.js:28>) e [script.js:93](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/script.js:93>).

A verificação automática decide apenas entre “Cancelado” e “Ativo”, ignorando “Suspenso” ou cancelamento manual. Ao suspender um contrato com vencimento futuro e disparar a atualização de vencimento, ele volta a “Ativo”. Mudanças de plano ou início também executam essa verificação.

A confirmação promete congelar os dias restantes, mas a função apenas modifica o status: não guarda início de suspensão, saldo de dias ou regra de retomada.

**Impacto:** perda da suspensão e divergência entre o serviço prometido e o estado do contrato.

**Manutenção:** separar vigência, suspensão, cancelamento e situação financeira; definir transições explícitas, motivo, datas e saldo da suspensão.

**Aceite:** recalcular datas preserva suspensão/cancelamento manual; suspender e reativar aplicam uma regra documentada para os dias restantes. Evidência: `suspensao-sobrescrita`.

### F06 — P1 — Catraca decide acesso por dados fixos e sem integração

**Tipo:** funcionalidade parcial de simulação.

**Código:** [script.js:4](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod03-catraca/script.js:4>) e [script.js:241](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod03-catraca/script.js:241>).

Só há três alunos fixos. A decisão usa `tipo: ok/warn/danger`, sem consultar cadastro, pagamento, vencimento, suspensão ou dias de tolerância. A matrícula 1111 recebe “Acesso Liberado” mesmo exibindo vencimento em 31/10/2025. Cadastrar ou pagar em outro módulo não muda a decisão. Não existe comando para equipamento físico.

**Impacto:** a interface de acesso pode exibir resultado incompatível com a situação real do aluno. O comportamento é aceitável como simulação identificada, mas bloqueia uso operacional.

**Manutenção:** criar IDs comuns, um catálogo de planos e uma regra central de acesso baseada em contrato/pagamento. Integrar equipamento somente se ele fizer parte do escopo definido.

**Aceite:** o mesmo aluno aparece nos módulos; pagamento, suspensão e expiração refletem no acesso; condições desconhecidas ou indisponibilidade têm resposta definida. Evidência: `catraca-regras`.

### F07 — P1 — Liberação excepcional não libera nem produz auditoria persistente

**Tipo:** lacuna de arquitetura e funcionalidade parcial.

**Código:** [script.js:152](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod04-auditoria/script.js:152>), [promessa de registro:247](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod04-auditoria/index.html:247>) e [histórico da catraca:218](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod03-catraca/script.js:218>).

A ação somente verifica campos preenchidos e informa que nenhum dado foi gravado. Não confere se o aluno existe, não registra autorização e não altera a catraca. A tela promete registro “auditável”, contrariando a implementação. O histórico da catraca retém só cinco eventos em memória e guarda horário sem uma data completa.

**Impacto:** impossibilidade de comprovar quem autorizou o acesso, para quem, quando e por qual motivo. A janela de cinco linhas pode ser adequada para a tela, mas não substitui armazenamento de eventos.

**Manutenção:** registrar evento com ID, aluno, identidade autenticada, data/hora, motivo, validade e resultado da autorização. Limitar o que aparece na tela sem eliminar os eventos armazenados. Usar horário do servidor e evitar edições silenciosas no histórico.

**Aceite:** autorização e registro são consistentes, consultáveis após recarga e associados ao mesmo acesso; falhas não produzem confirmação indevida. Evidências: `liberacao-simulada` e `catraca-retencao`.

## Achados de funcionamento e uso

### F08 — P2 — Vencimento transborda para outro mês

**Código:** [cadastro/script.js:72](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/script.js:72>). Tipo: defeito confirmado; regra de fim de mês precisa ser definida.

`setMonth` preserva o dia e normaliza datas inexistentes: 31/01/2026 + um mês resulta em 03/03/2026; 29/02/2024 + doze meses resulta em 01/03/2025.

**Manutenção:** documentar a regra contratual. Se for aniversário limitado ao último dia do mês, calcular o mês alvo e limitar o dia à quantidade de dias dele, gerando 28/02 nos exemplos. Não assumir que mês equivale sempre a trinta dias.

**Aceite:** casos com dias 28–31, anos bissextos e virada do ano obedecem à regra escolhida. [MDN — setMonth](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth). Evidências: `vencimento-fim-do-mes` e `vencimento-ano-bissexto`.

### F09 — P2 — Relatório ignora período e não mede frequência

**Código:** [relatórios/script.js:8](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod06-relatorios/script.js:8>) e [relatórios/index.html:23](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod06-relatorios/index.html:23>). Tipo: defeito e funcionalidade parcial.

O handler lê somente o status. Datas inicial/final não participam do filtro nem são validadas. Selecionar 01/01/2099 a 02/01/2099 mantém quatro registros de setembro de 2026. A tela se chama relatório de frequência, mas mostra datas de cadastro e situação da matrícula, sem dados de presença.

**Manutenção:** definir se o relatório é de matrículas ou frequência; usar a data correspondente, aplicar limites inclusivos do período e validar início ≤ fim. Para frequência, consultar eventos de acesso.

**Aceite:** um período sem eventos retorna zero; período invertido gera erro; status e datas se combinam; título e colunas descrevem o que é calculado. Evidências: `relatorio-periodo` e `relatorio-status`.

### F10 — P2 — Campos preenchidos são descartados

**Código:** [foto:43](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/index.html:43>), [altura:87](<C:/Users/erick/Downloads/Projeto Unificado/modulos/Modulo 5/index.html:87>) e [financeiro/script.js:4](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/script.js:4>). Tipo: defeitos de captura.

A foto não entra no objeto do cadastro nem é processada. A altura não é lida na avaliação. A data de início obrigatória do financeiro não é lida no handler. Esses campos não podem ser recuperados após a ação.

**Manutenção:** mapear cada campo para o modelo e sua persistência. Definir formato, tamanho e armazenamento da foto; permitir consulta das métricas da avaliação e datas completas do contrato.

**Aceite:** os valores enviados podem ser recuperados na consulta do registro, inclusive foto, altura e início. Não é obrigatório colocar todos na tabela, mas eles devem existir no modelo. Evidências: `cadastro-semantica`, `avaliacao-renderizacao` e `financeiro-renderizacao`.

### F11 — P2 — Indicadores financeiros fixos e transação incompleta

**Código:** [financeiro/index.html:44](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/index.html:44>) e [financeiro/script.js:1](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/script.js:1>). Tipo: funcionalidade parcial.

Os totais 142, 18 e R$ 15.450,00 são texto fixo e não mudam ao registrar. O formulário mistura contrato e pagamento, sem guardar valor cobrado/pago, data de quitação, identificador da cobrança ou vínculo com um contrato existente.

**Manutenção:** separar contrato, cobrança e pagamento no modelo; guardar valores com precisão monetária definida e calcular os indicadores a partir dos registros.

**Aceite:** um registro altera somente os indicadores aplicáveis, os totais correspondem à mesma base e marcar “Pago” corresponde a um pagamento identificável. A revisão não recomenda instalar processamento de pagamentos sem definição de escopo.

### F12 — P2 — Validação semântica insuficiente

**Código:** [cadastro/index.html:31](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/index.html:31>), [valor:99](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/index.html:99>), [avaliação/index.html:77](<C:/Users/erick/Downloads/Projeto Unificado/modulos/Modulo 5/index.html:77>) e [financeiro/index.html:90](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/index.html:90>). Tipo: defeito de validação.

`required` garante presença, mas CPF aceita texto arbitrário; telefones não são normalizados; nascimento não possui limite futuro; valor e peso não possuem limites inferiores; gordura não possui limite 0–100. As datas de início e vencimento não são comparadas. Os handlers não conferem vínculo com aluno cadastrado.

**Manutenção:** validar e normalizar entradas, usando atributos HTML adequados e regras no código. Quando houver API, repetir as regras no servidor. Separar validação de número/formato de CPF de qualquer comprovação de identidade. Definir limites de negócio e tratar espaços em branco.

**Aceite:** CPF inválido, valor negativo, peso não positivo, percentual fora de intervalo, datas incoerentes e aluno inexistente produzem erros claros. Evidências: `cadastro-semantica`, `financeiro-renderizacao` e `avaliacao-renderizacao`, observando as limitações do DOM simulado.

### F13 — P2 — “Limpar” mantém a data calculada da avaliação

**Código:** [avaliação/index.html:139](<C:/Users/erick/Downloads/Projeto Unificado/modulos/Modulo 5/index.html:139>) e [avaliação/script.js:39](<C:/Users/erick/Downloads/Projeto Unificado/modulos/Modulo 5/script.js:39>). Tipo: defeito confirmado.

Calcular a próxima avaliação com 08/10/2026 e sessenta dias produz 07/12/2026. Ao limpar, a data fica vazia e o intervalo volta a trinta dias, mas a previsão continua em 07/12/2026. A limpeza da previsão existe somente após envio, não no evento `reset`.

**Manutenção:** atualizar o estado derivado e mensagens também no reset; calcular a previsão a partir dos campos na submissão.

**Aceite:** limpar retorna campos e previsão ao estado inicial, sem valor antigo na tela. Evidência: `avaliacao-reset`.

### F14 — P2 — Menu principal fica sem texto em telas estreitas

**Código:** [style.css:171](<C:/Users/erick/Downloads/Projeto Unificado/style.css:171>) e [index.html:30](<C:/Users/erick/Downloads/Projeto Unificado/index.html:30>). Tipo: defeito confirmado pela estrutura HTML/CSS; validação visual pendente.

Até 760px, o CSS oculta `.nav__label`. Os links possuem apenas esse span e nenhum ícone ou texto alternativo. A regra para `.nav__tag` não ajuda porque esse elemento não existe.

**Manutenção:** preservar rótulos ou oferecer ícones com nome acessível e interação identificável no menu compacto. Rever o seletor de perfil.

**Aceite:** cada módulo pode ser identificado e acessado em 360px, 760px e por teclado/leitor de tela.

### F15 — P2 — Navegação duplicada e layouts sem adaptação nos módulos

**Código:** [financeiro/index.html:10](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/index.html:10>), [avaliação/index.html:12](<C:/Users/erick/Downloads/Projeto Unificado/modulos/Modulo 5/index.html:12>) e [relatórios/index.html:11](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod06-relatorios/index.html:11>). Tipo: falha de integração visual e navegação; aparência em navegador pendente.

Financeiro, avaliação e relatórios têm menus próprios dentro do iframe, somados ao menu externo. Seus quatorze links `href="#"` não navegam para os módulos. Há painéis laterais de largura fixa, sem breakpoints nesses três CSS; financeiro e avaliação também não incluem meta viewport para abertura direta. No financeiro o body esconde overflow, aumentando a possibilidade de corte de conteúdo.

**Manutenção:** escolher uma navegação compartilhada e adaptar os módulos à área disponível; prever abertura direta se ela for suportada. Revisar largura mínima dos flex/grid, rolagem de tabelas e layout em telas estreitas.

**Aceite:** menu único ou navegações coerentes, nenhum link de módulo sem destino, conteúdo e botões utilizáveis em 360px, 768px e desktop.

### F16 — P2 — Labels sem associação e feedback dinâmico sem anúncio

**Código:** [financeiro/index.html:64](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/index.html:64>), [avaliação/index.html:56](<C:/Users/erick/Downloads/Projeto Unificado/modulos/Modulo 5/index.html:56>), [feedback:283](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod04-auditoria/index.html:283>) e [status da catraca:114](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod03-catraca/index.html:114>). Tipo: problema estático de acessibilidade; avaliação assistiva pendente.

Os labels dos formulários de financeiro e avaliação não usam `for` e não envolvem os controles. Mensagens da liberação, resultado da catraca e contagem de relatório não têm mecanismos de anúncio de mudanças.

**Manutenção:** associar labels e controles, vincular mensagens de erro e usar regiões de status/alerta apropriadas. Preservar ordem de foco e garantir que ações de formulário sejam alcançáveis.

**Aceite:** clicar no label foca o controle; os campos têm nomes acessíveis; erros e decisões são anunciados; os fluxos funcionam por teclado.

### F17 — P2 — Cadastro imprime dados pessoais e de saúde no console

**Código:** [cadastro/script.js:126](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/script.js:126>). Tipo: exposição desnecessária no ambiente local.

O JSON contém CPF, endereço, telefones, nascimento, contato de emergência e restrições de saúde. Esses valores são registrados integralmente no console em cada submissão.

**Manutenção:** remover esse log do fluxo operacional e definir diagnóstico sem conteúdo pessoal. Ao criar backend, definir acesso aos registros, logs, retenção e tratamento de backups.

**Aceite:** salvar aluno não imprime o conteúdo pessoal no console nem em logs de aplicação; logs técnicos registram identificadores e resultado sem duplicar o cadastro.

## Organização e prevenção

### F18 — P3 — Catálogos, estilos e estrutura sem padrão comum

**Código:** [cadastro/script.js:11](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod01-cadastros/script.js:11>), [planos financeiros:71](<C:/Users/erick/Downloads/Projeto Unificado/modulos/modulo 2/index.html:71>) e [planos da catraca:8](<C:/Users/erick/Downloads/Projeto Unificado/modulos/mod03-catraca/script.js:8>).

Planos, formas de pagamento e estados têm vocabulários diferentes entre módulos: “Mensal”, “Mensal VIP” e “Plano Gold”; “PIX” e “Pix”; situação do contrato e do pagamento sem um modelo comum. Cores, componentes, regras de formatação e menus são repetidos. Os nomes das pastas têm espaços, caixa e padrões diferentes, o que já contribuiu para os links quebrados corrigidos antes desta auditoria. Há código de simulação comentado e datas estáticas de exemplos.

**Manutenção:** estabelecer catálogo com IDs estáveis, normalizar nomes de diretório quando oportuno, centralizar funções de data/formatação/validação e estilos compartilhados e identificar dados de demonstração. A refatoração pode preservar HTML/CSS/JavaScript existentes.

**Aceite:** a mesma entidade tem o mesmo ID e significado nos módulos; uma mudança de regra comum tem um ponto de manutenção; renomear pastas não quebra referências.

### F19 — P3 — Falta uma rotina documentada de execução e regressão

Na versão original não havia README, configuração de testes/lint, manifesto de dependências ou documentação de arquitetura. Também não foi encontrada pasta `.git` na raiz. As duas dependências externas visíveis são CSS de ícones e fontes; não houve varredura de vulnerabilidades dessas dependências.

**Manutenção:** documentar como servir o projeto, dados de exemplo, limitações e regras de negócio; estabelecer controle de versão e acrescentar testes focados nas regras corrigidas. Ao introduzir backend, incluir migrations, variáveis de ambiente de exemplo, tratamento de falhas e instruções para backup/restauração.

**Aceite:** outro desenvolvedor executa e verifica o projeto com instruções suficientes. As correções de datas, suspensão, filtros, DOM e permissões têm testes de regressão adequados. O diagnóstico desta auditoria ajuda a reproduzir os problemas, mas não substitui testes em navegador e integração.

## Verificações que passaram

- Os sete scripts têm sintaxe JavaScript válida. Isso não elimina erros de execução como F01.
- As 21 referências locais capturadas em HTML apontam para arquivos existentes, incluindo os dois links corrigidos anteriormente.
- Não foram encontrados IDs duplicados dentro de cada página. IDs repetidos em páginas de iframe diferentes não são conflito por si só.
- A navegação restaura preferências e exibe os itens correspondentes ao perfil escolhido no cenário controlado; a ausência de segurança real é tratada em F04.
- O filtro de status retorna um registro inativo nos dados de exemplo.
- A catraca distingue matrícula inexistente de inadimplência; o handler manual foi registrado antes da exceção.
- O módulo de liberação recusa campos obrigatórios vazios no código e o contador respeita o limite nativo de 250 caracteres do textarea.
- Cadastro, catraca e liberação possuem regras CSS de adaptação; isso não constitui validação visual completa.
- O iframe principal tem título e os links da navegação desktop têm indicação do módulo atual e estilo de foco.

## Plano de manutenção e dependências

| Ordem | Trabalho | Achados | Critério de conclusão |
|---|---|---|---|
| 1 | Corrigir runtime, renderização de texto, cálculo de datas, preservação de status, reset e filtros | F01, F02, F05, F08, F09, F13 | Cenários atuais corrigidos e verificados em navegador |
| 2 | Completar captura/validação e alinhar mensagens à persistência disponível | F03, F10, F12, F17 | Nenhum campo descartado, entrada inválida tratada e sucesso verdadeiro |
| 3 | Unificar navegação, adaptação de layout e acessibilidade | F14, F15, F16, F18 | Fluxos utilizáveis em desktop, celular e teclado |
| 4 | Definir modelo, API, banco e sessão para o modo operacional | F03, F04, F06, F11, F18 | Alunos, contratos, cobranças, pagamentos, avaliações e usuários relacionados por IDs |
| 5 | Integrar decisões de acesso, liberação excepcional e histórico persistente | F06, F07, F09 | Decisão baseada na mesma base e eventos consultáveis com autoria e data |
| 6 | Consolidar execução, regressão e operação | F19 | Documentação e verificações reproduzíveis, incluindo falhas e autorização |

F04 e F07 são prioridades antes de qualquer uso operacional. A posição posterior no plano reflete sua dependência de identidade, API e persistência. Algumas partes de F05, F09 e F11 exigem definição de regra de negócio e modelo, além da correção imediata da interface.

Para a futura implementação, o modelo mínimo sugerido compreende aluno, plano, contrato, cobrança, pagamento, avaliação física, usuário/perfil, evento de acesso e autorização excepcional. Devem ser definidos: cardinalidades de contrato, unicidade de matrícula/CPF, regra de fim de mês, tolerância após vencimento, suspensão/reativação e validade de liberação. Alterações de contrato e auditoria precisam preservar histórico. A escolha de stack, hospedagem e equipamento depende do modo de uso e não foi feita nesta revisão.

Testes posteriores essenciais: salvar e reabrir registros; pagar e reavaliar acesso; suspender sem perder o estado; autorizar acesso e consultar log; impedir ações administrativas de portaria; combinar datas/status dos relatórios; verificar rollback ou resposta clara em falhas de rede/gravação. Antes de uso com vários operadores, verificar concorrência, duplicidade e consistência das operações.

Nesta etapa foram acrescentados apenas o relatório, o verificador e as evidências em `auditoria/`. As manutenções da aplicação ficam orientadas pelos achados acima.
