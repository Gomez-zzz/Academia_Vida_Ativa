# Validação do tema claro — 09/10/2026

Revisão no navegador integrado, com a apresentação principal em http://127.0.0.1:8765/. Testes que gravam acessos ou exercitam mensagens de formulário foram feitos em uma prévia separada em http://localhost:8765/, cuja origem tem armazenamento independente.

## Telas e adaptação

| Tela | 1280 × 900 | 768 × 900 | 360 × 800 | Reflow 640 × 450 |
|---|---|---|---|---|
| Gestão de Cadastros | Conferida | Conferida | Conferida | Conferido |
| Financeiro e Planos | Conferida | Conferida | Conferida | Conferido |
| Controle de Catraca / Portaria | Conferida | Conferida | Conferida | Conferido |
| Liberação e Auditoria | Conferida | Conferida | Conferida | Conferido |
| Avaliação Física | Conferida | Conferida | Conferida | Conferido |
| Relatórios Gerenciais | Conferida | Conferida | Conferida | Conferido |

- A largura de rolagem da página e dos módulos permaneceu igual à largura disponível nas três resoluções. Tabelas maiores rolam dentro dos cartões; o menu compacto possui sua própria rolagem.
- Campos e botões renderizados tiveram altura mínima de 44 px, com checkbox nativo e rótulo de 44 px. O botão de seleção de arquivo também usa mínimo de 44 px.
- Tema light confirmado no documento principal e nos seis módulos. Seleção, controles nativos, painéis, títulos e tabelas usam a nova identidade.
- As cinco abas da Administração foram selecionadas em 360 px; o destaque e o rótulo da aba ativa ficaram inteiramente visíveis após o ajuste de rolagem. Portaria apresenta somente a catraca.
- A tabela financeira foi inspecionada também após rolar até os registros, em desktop e celular, mantendo os valores e nomes legíveis.

## Contraste e estados

- Os 37 cenários de regressão existentes e as três verificações novas passaram: **40/40**. Resultado detalhado em TESTES-FRONTEND.json.
- Os testes de cores CSS verificam texto principal/secundário, placeholders, botões normal/hover, estados operacionais, bordas de controle e foco. As comparações usam valores completos, sem arredondar antes de aplicar os limites.
- A amostra de navegador coletou 363 pares de cores de componentes renderizados nos seis módulos, sem resultados abaixo de 4,5:1; o menor valor observado na amostra foi aproximadamente 5,20:1. Placeholders são verificados separadamente pela paleta CSS, com aproximadamente 4,69:1 sobre branco.
- Os painéis da catraca foram acionados com os três alunos fictícios: acesso liberado, período de tolerância e acesso bloqueado. Os contrastes dos títulos foram aproximadamente 5,74:1, 6,07:1 e 5,42:1, respectivamente. As descrições também superaram 4,5:1.
- Navegação por Tab e entrada no formulário conferidas; link e campo apresentaram focus-visible com contorno azul de 3 px.
- Formulário conferido com telefone inválido, mensagem de erro, confirmação de salvamento e CPF inválido. O CPF ganhou borda vermelha e o aviso nativo; descartar alterações recuperou o registro válido.
- O histórico da apresentação principal permaneceu com os oito acessos originais; os acessos de teste ficaram na origem localhost. Contratos e pagamentos da origem principal não foram gravados durante esta revisão.

## Ampliação e limites

Os atalhos de zoom do navegador integrado não alteraram a escala nem a largura CSS. Portanto, **zoom real de 200% não foi confirmado**. Foi inspecionado o reflow em 640 × 450, área CSS equivalente a uma janela de 1280 × 900 em 200%, nos seis módulos, sem rolagem horizontal da página. Isso verifica a adaptação nessa área, mas não substitui a inspeção com zoom real em um navegador que ofereça esse controle.

A revisão não representa certificação completa de acessibilidade, testes de todos os controles do sistema operacional ou integração de produção. Dados, permissões e serviços continuam fictícios e locais.

## Evidências

Capturas e medidas em visual/tema-claro/. Destaques: cadastro-1280.jpg, cadastro-360.jpg, cadastro-foco.jpg, cadastro-campo-invalido.jpg, cadastro-sucesso.jpg, financeiro-registros.jpg, financeiro-tabela-mobile.jpg e portaria-sucesso.jpg / portaria-atencao.jpg / portaria-bloqueio.jpg.

verificacoes.json registra as larguras, controles, rolagem de tabelas, posição das abas, foco e cores lidas do DOM. As capturas antigas em visual/ e VALIDACAO-VISUAL-2026-10-09.md documentam a etapa anterior com o tema escuro.
