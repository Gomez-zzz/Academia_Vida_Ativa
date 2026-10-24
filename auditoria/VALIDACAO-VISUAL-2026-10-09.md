# Validação visual — 09/10/2026

Revisão feita no navegador integrado, servindo o projeto em http://127.0.0.1:8765/.

## Telas conferidas

| Tela | Desktop 1280 × 900 | Celular 360 × 800 |
|---|---|---|
| Gestão de Cadastros | Conferida | Conferida |
| Financeiro e Planos | Conferida | Conferida |
| Controle de Catraca / Portaria | Conferida | Conferida |
| Liberação e Auditoria | Conferida | Conferida |
| Avaliação Física | Conferida | Conferida |
| Relatórios Gerenciais | Conferida | Conferida |

Financeiro também conferido em tablet de 768 × 900.

## Verificações

- Administração apresenta cinco abas, sem catraca e sem numeração.
- Portaria apresenta somente Controle de Catraca.
- Cadastro termina após dados pessoais e de saúde; ações financeiras foram removidas. A tabela mostra matrícula, aluno, CPF, telefone e edição.
- Financeiro distingue situação do contrato e situação do pagamento.
- Suspensão e reativação foram acionadas no navegador para o aluno fictício Lucas Andrade: a quitação permaneceu Pago e o vencimento permaneceu 29/10/2026 após reativar no mesmo dia. Ao finalizar, o contrato ficou Ativo.
- As telas usam mensagens operacionais, sem etiquetas de demonstração, referências acadêmicas ou controles visíveis de restauração.
- Campos e componentes adaptam-se às larguras conferidas. Menu compacto permite rolagem horizontal e tabelas rolam dentro dos respectivos cartões.
- Uma quebra indevida de nomes e valores na tabela financeira foi encontrada e corrigida; os registros agora usam colunas sem quebra no meio dos textos.
- A prévia foi devolvida a Administração / Gestão de Cadastros e o tamanho temporário do navegador foi restaurado.

## Evidências e limites

Capturas JPEG estão em auditoria/visual/. Destaques: cadastro-dados-e-lista.jpg, financeiro-registros.jpg, financeiro-tabela-mobile.jpg e portaria-desktop.jpg.

Os 37 cenários de regressão passaram em tests/front-end.test.cjs, cobrindo a separação de aluno e contrato, preservação financeira, contratação, suspensão, acessos e preferências de navegação. Resultado em auditoria/TESTES-FRONTEND.json.

A inspeção cobre as telas e os comportamentos descritos acima; não representa certificação completa de acessibilidade ou execução de todos os recursos nativos. O funcionamento permanece local, com dados fictícios, sem autenticação ou serviços de backend.
