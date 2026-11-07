# Identidade visual Carbono e Neon — 06/11/2026

Aplicação da direção visual indicada em `skill design.md.txt` ao painel Vida Ativa. Este tema substitui visualmente a paleta grafite/azul anterior; o registro dessa versão permanece em `TEMA-GRAFITE-2026-10-09.md` como histórico.

## Tokens aplicados

| Função | Token | Valor |
|---|---|---|
| Fundo principal | `--bg` | `#151718` |
| Painéis/cartões | `--surface` | `#1F2226` |
| Superfície secundária | `--surface-soft` | `#24282D` |
| Divisórias | `--border` | `#2C3035` |
| Borda de controles | `--control-border` | `#89949E` |
| Ação/destaque | `--accent` | `#CCFF00` |
| Hover de ação | `--accent-hover` | `#D7FF33` |
| Seleção/destaque suave | `--accent-soft` | `#28320D` |
| Texto em ação neon | `--on-accent` | `#111315` |
| Texto principal | `--text` | `#FFFFFF` |
| Texto secundário | `--muted` | `#A0AAB2` |
| Placeholder | `--placeholder` | `#9BA4AC` |
| Positivo | `--green` / `--green-soft` | `#CCFF00` / `#28320D` |
| Atenção | `--yellow` / `--yellow-soft` | `#F2C66D` / `#302719` |
| Erro/bloqueio | `--red` / `--red-soft` | `#FF9B96` / `#342122` |

Os tokens residem em `assets/app.css`; o shell e os seis módulos consomem esses tokens. A cor neon fica concentrada em ações, foco, seleção e indicadores positivos. Texto sobre botão neon usa carbono escuro para manter legibilidade. Os estados de atenção e erro continuam diferenciados por cor e texto, além do verde principal.

## Por que esta direção substitui a paleta anterior

A paleta grafite/azul documentada em outubro era suave e discreta, mas não seguia a direção esportiva prescrita no arquivo de referência. Carbono e Neon dá ao painel uma assinatura visual própria para uma academia de alta performance; preto e chumbo reduzem competição entre superfícies, e o verde cyber identifica rapidamente ação principal, foco e seleção. Para que o destaque não tome toda a interface, mantive o neon em pontos de ação e status.

## Engenharia e validação

- A troca foi feita por tokens centrais, sem cores duplicadas nas folhas dos módulos.
- `index.html` usa `theme-color` `#151718`; controles nativos mantêm `color-scheme: dark`.
- A regressão de tema agora exige os valores carbono, chumbo, neon e texto branco. O teste também mede pares de contraste para texto, controles e estados.
- `node tests/front-end.test.cjs`: **55/55 cenários aprovados**, incluindo as verificações de contraste da paleta.
- Capturas após a troca: `visual/implementacao-2026-11/shell-desktop.jpg`, `shell-mobile.jpg`, `financeiro-desktop.jpg` e `portaria-desktop.jpg`.

## Limite

As medições de contraste da suíte cobrem tokens e pares definidos; não representam certificação completa de acessibilidade nem inspeção visual de todos os componentes em todos os estados e navegadores. A revisão visual deve continuar com a equipe que usa o painel diariamente.
