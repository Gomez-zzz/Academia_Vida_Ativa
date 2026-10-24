# Identidade visual clara — Vida Ativa

Implementada em 09/10/2026 para a apresentação ao cliente. O tema claro com azul discreto substitui a identidade escura com laranja. A organização dos módulos, os contratos, pagamentos e regras locais foram preservados.

## Paleta por função

| Função | Variável CSS | Cor |
|---|---|---|
| Fundo | --bg | #F3F5F7 |
| Painéis e navegação | --surface | #FFFFFF |
| Superfícies secundárias | --surface-soft | #F7F9FC |
| Divisórias decorativas | --border | #DCE2EA |
| Bordas dos campos e ações secundárias | --control-border | #7E8C9F |
| Ações principais, seleção e foco | --accent | #345F96 |
| Ação principal ao passar o mouse | --accent-hover | #284D7D |
| Fundo de seleção e resultados | --accent-soft | #EAF0F8 |
| Texto sobre ações principais | --on-accent | #FFFFFF |
| Texto principal | --text | #233044 |
| Texto secundário | --muted | #596579 |
| Placeholder | --placeholder | #66758A |
| Fundo desabilitado | --disabled-bg | #EEF1F5 |
| Sucesso: texto / fundo / borda decorativa | --green / --green-soft / --green-border | #236B4B / #EAF5EE / #BEDCCA |
| Atenção: texto / fundo / borda decorativa | --yellow / --yellow-soft / --yellow-border | #7C5515 / #FFF4DB / #E7D1A4 |
| Erro: texto / fundo / borda decorativa | --red / --red-soft / --red-border | #A63F3F / #FBEDED / #E8C3C3 |

As bordas suaves de cartões e badges são decorativas. Campos e botões secundários usam a borda de controle, mais contrastante. A seleção da navegação possui indicador azul e peso de texto; o status da catraca usa uma barra lateral e mensagem explícita, além da cor.

## Componentes e implementação

- assets/app.css centraliza todas as cores e os componentes; style.css aplica o tema ao shell. Os seis módulos continuam importando os estilos comuns.
- color-scheme: light ajusta os controles nativos. A meta theme-color usa o fundo claro.
- Segoe UI e fontes do sistema; texto geral de 16 px, campos de 16 px, rótulos e tabelas de 14 px, títulos de 30 px no desktop e 26 px no celular.
- Espaçamentos em escala de 4/8 px, intervalos de 16 px e cartões com 24 px de preenchimento no desktop e 20 px no celular.
- Cartões com raio de 12 px; campos e botões com raio de 8 px. Sem sombras pesadas.
- Campos e botões têm altura mínima de 44 px. O checkbox mantém o controle nativo de 18 px com rótulo clicável de 44 px.
- Foco de teclado com contorno azul de 3 px; erro de campo após interação, estados desabilitados e de somente leitura legíveis, feedback com mensagens operacionais.
- Tabelas com cabeçalhos claros, números tabulares e rolagem dentro do cartão. Financeiro conserva a largura mínima de 1320 px para nomes, datas e valores sem quebras indevidas.
- Marca com raio em SVG monocromático local. Não foram adicionadas fontes, bibliotecas ou serviços externos.
- main.js traz a aba selecionada para a área visível do menu; a margem de rolagem evita encostar o destaque na borda.

## Referências e critérios

A organização das cores por função segue a abordagem de [tokens e camadas do Carbon](https://www.carbondesignsystem.com/building-blocks/foundations/color/guidelines). Os critérios de verificação foram 4,5:1 para texto comum e 3:1 para as partes visuais necessárias à identificação de controles e estados, conforme [WCAG 2.2 — contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) e [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

A aparência foi escolhida conforme a preferência do cliente; sua aprovação do conforto visual continua sendo parte da análise da apresentação. Ver evidências e limites em VALIDACAO-TEMA-CLARO-2026-10-09.md.
