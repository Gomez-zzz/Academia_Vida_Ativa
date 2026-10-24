# Manutenções do front-end — atualizado em 09/10/2026

A apresentação foi atualizada em HTML, CSS e JavaScript, com grafite suave e destaque azul. O escopo desta etapa é a aprovação visual e a demonstração dos fluxos.

## O que foi implementado

- Navegação principal única, com cinco módulos na Administração e a catraca exclusiva da Portaria. Os rótulos continuam visíveis no menu compacto.
- Componentes e estilos compartilhados, adaptação de grids/formulários, rolagem local de tabelas, contraste e foco de teclado, labels associados e regiões de feedback.
- Cadastro e edição de alunos, validação de CPF/telefones/datas, matrícula automática, foto e mensagens inline.
- Catálogo único de planos e valores; vencimentos limitados ao último dia do mês de destino.
- Suspensão que conserva o saldo de dias e reativação; mudanças de campos não sobrescrevem o estado manual.
- Financeiro com seleção de aluno, captura de datas, cobrança demonstrativa, quitação e indicadores calculados.
- Catraca sem referências a botões inexistentes, com decisão a partir do estado compartilhado, fotos e histórico com data completa.
- Liberação excepcional com autoria demonstrativa, prazo, justificativa e uso único para entrada/temporário.
- Avaliação com altura, peso, percentual inclusive zero, histórico, reavaliação e reset do estado derivado.
- Relatório de frequência que combina período e situação atual e conta somente acessos liberados.
- Renderização de entradas com textContent; remoção de logs com dados pessoais.
- Estado demonstrativo no armazenamento do navegador, fallback em memória e falhas de espaço tratadas antes de confirmar a gravação.
- Proteção contra descarte acidental ao navegar e ao trocar de cadastro/contrato.
- Restauração dos dados fictícios disponível apenas na função de apoio Demo.reset(), sem botão na interface.

## Relação com a auditoria anterior

| Achados | Tratamento nesta etapa |
|---|---|
| F01, F02, F05, F08, F09, F10, F12, F13, F17 | Correções aplicadas nos scripts e formulários |
| F11 | Indicadores e cobrança demonstrativa ligados aos registros locais |
| F14, F15, F16, F18 | Navegação, componentes, adaptação e marcação acessível revisados |
| F03 | Persistência local para apresentação; persistência operacional será uma etapa de backend |
| F04 | Perspectivas de demonstração e responsável somente leitura; autenticação real permanece fora desta fase |
| F06, F07 | Fluxos integrados de simulação; equipamento, API e auditoria operacional permanecem fora desta fase |
| F19 | README, servidor estático sem dependências e testes de regressão acrescentados |

## Validação

**40 de 40 cenários passaram** em tests/front-end.test.cjs. O resultado detalhado está em auditoria/TESTES-FRONTEND.json. Os testes cobrem regras de data, CPF, duplicidade, persistência, foto no modelo, suspensão, pagamento/acesso, liberações, métricas, períodos, falhas de armazenamento, inicialização dos seis controladores, navegação, reset e renderização literal de HTML.

A regressão verifica as regras locais e os controladores com DOM mínimo simulado. A revisão atual também foi inspecionada no navegador integrado, em desktop (1280 px), tablet (768 px) e celular (360 px). Foram conferidos a navegação por área, os formulários reorganizados, textos operacionais e o layout responsivo. Isso não representa certificação completa de acessibilidade ou teste de todos os recursos nativos. Capturas estão em auditoria/visual/.

Para abrir a apresentação, servir com node iniciar-preview.cjs e acessar http://127.0.0.1:8765/.

A auditoria e as evidências anteriores foram preservadas como histórico. Suas referências de linha representam a versão anterior. Não foi acrescentado backend, autenticação operacional, transação financeira ou acionamento de catraca física.

## Separação para apresentação ao cliente — 09/10/2026

- Cadastro contém dados pessoais e de saúde; sua tabela mostra matrícula, aluno, CPF, telefone e edição. Salvar não cria contrato nem cobrança.
- Financeiro concentra contratação, situação contratual, suspensão/reativação e pagamento; a tabela distingue a situação do contrato da situação do pagamento.
- Contratos e cobranças existentes foram preservados, com a mesma chave de armazenamento local.
- Menu sem numeração, catraca exclusiva da Portaria e recuperação de preferência antiga para Cadastros na Administração.
- Etiquetas de demonstração, textos acadêmicos e avisos de simulação removidos das telas. Área de trabalho substitui Visualizar como.
- A documentação mantém a informação de que dados, permissões e serviços são fictícios, sem backend real.

- Tabela financeira com nomes, datas e valores sem quebras indevidas; rolagem horizontal limitada ao cartão.
- Evidências da inspeção visual em auditoria/VALIDACAO-VISUAL-2026-10-09.md.

## Identidade visual clara — 09/10/2026

- Tema compartilhado em todos os seis módulos, cabeçalho e navegação: cinza suave, painéis brancos, texto grafite e azul para ações/seleção.
- Tipografia e espaçamento revisados; botões e controles com altura mínima de 44 px, foco azul visível e estados de erro, sucesso, aviso, somente leitura e desabilitado.
- Raio da marca em SVG monocromático; tabelas com cabeçalhos claros, sem transformação para caixa alta, números tabulares e rolagem limitada aos cartões.
- Selecionar uma aba também a traz para a área visível do menu compacto.
- Preservadas as APIs locais, a chave de armazenamento, os registros da apresentação principal e a separação de Cadastro, Financeiro e Portaria.
- Três verificações de tema/contraste acrescentadas à regressão: total de 40 cenários aprovados. Evidências e limite do teste de zoom descritos em auditoria/VALIDACAO-TEMA-CLARO-2026-10-09.md.

## Grafite suave e azul — 09/10/2026

A pedido do cliente, as superfícies brancas foram substituídas por grafite e cinza azulado. A alteração está concentrada na paleta compartilhada, com controles nativos em modo escuro, estados operacionais suaves e texto claro sem branco puro. Layout, tipografia, espaçamentos, APIs locais e registros foram preservados. A validação e as capturas atuais estão em auditoria/TEMA-GRAFITE-2026-10-09.md e auditoria/visual/tema-grafite/. Os documentos do tema claro foram mantidos como histórico.
