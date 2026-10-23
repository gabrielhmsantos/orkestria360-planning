# IMDO Orkestria360 — Modelo de Cálculo V2

## Objetivo

Definir o modelo conceitual do **Índice de Maturidade Digital Orkestria (IMDO)** segundo a matriz final do sponsor. O IMDO responde “quão saudável e maduro está o ambiente Microsoft 365?” integrando sinais técnicos, operacionais e de governança.

Este documento não autoriza implementar cálculo para regras ainda incompletas. As pendências estão registradas em `IMDO_Orkestria360_Pendencias_Homologacao_V2.md`.

## Estrutura do índice

| Domínio | Peso IMDO | Fonte predominante | Estado |
| --- | ---: | --- | --- |
| Segurança | 30% | Microsoft, Defender, Intune, Entra, Assessment | Parcialmente homologado |
| Governança | 20% | Estruturação e Governança, Assessment, Graph | Parcialmente homologado |
| Licenciamento e Custos | 15% | Graph, tabela comercial Orkestria | Parcialmente homologado |
| Compliance | 15% | Purview, Graph, Assessment, Governança | Parcialmente homologado |
| Disponibilidade | 10% | Service Health, ITSM, backup, workloads | Parcialmente homologado |
| Produtividade | 10% | Reports, produtos Microsoft, Assessment | Parcialmente homologado |

Os pesos dos domínios totalizam 100%.

## Fórmula conceitual

Quando todos os indicadores aplicáveis de um domínio tiverem notas homologadas:

```text
nota_do_domínio = soma(nota_do_indicador × peso_interno_do_indicador)
IMDO = soma(nota_do_domínio × peso_do_domínio)
```

As notas são de 0 a 100. Pesos são normalizados como frações. A fórmula só pode ser executada quando os pesos internos do domínio totalizarem 100% ou houver regra de normalização aprovada pelo sponsor.

## Dimensões independentes

| Dimensão | O que mede | Efeito na nota |
| --- | --- | --- |
| Nota | Qualidade/maturidade calculada pelos indicadores | Compõe o IMDO. |
| Cobertura | Evidência ponderada que foi coletada e interpretada | Não altera a nota. |
| Confiabilidade | Qualidade declarada da origem da evidência | Não altera a nota. |

Confiabilidade-base informada pelo sponsor: Microsoft Graph, Defender, Intune, Entra ID e Exchange Online 100%; Assessment Orkestria 80%; Estruturação e Governança 70%; informação manual 50%.

Uma nota só deve ser exibida com seu estado de cobertura e confiabilidade. A ausência de licença ou workload para um indicador previsto pelo IMDO é uma lacuna de maturidade e recebe nota zero; indisponibilidade de permissão ou integração fora de escopo não recebe nota zero automaticamente.

## Convenções operacionais adotadas pelo Orkestria

As convenções abaixo tornam a experiência legível sem substituir fórmulas de indicadores ainda não definidas pelo sponsor.

| Tema | Convenção adotada |
| --- | --- |
| Classificação IMDO | `Crítica` de 0–49; `Atenção` de 50–64; `Em evolução` de 65–79; `Muito Boa` de 80–89; `Excelente` de 90–100. A faixa “Muito Boa” preserva o exemplo do sponsor para 84 pontos. |
| Cobertura | Soma dos pesos de evidências coletadas e interpretáveis, dividida pela soma dos pesos de evidências aplicáveis. |
| Confiabilidade | Média ponderada da confiabilidade das evidências coletadas e aplicáveis; usa os percentuais-base declarados pelo sponsor. |
| Indicador não aplicável | Sai do denominador do domínio e é exibido como `not_applicable`; não recebe nota zero. A nota é normalizada pela soma dos pesos aplicáveis e a cobertura expõe o peso retirado. |
| Licença/workload ausente | Quando o tenant não possui a licença ou o workload necessário para um indicador previsto na matriz, o indicador recebe nota `0`, mantém seu peso no denominador e é exibido como oportunidade de contratação/evolução. A cobertura conta como disponível se a ausência for confirmada. |
| Permissão insuficiente | É exibida como `insufficient_privileges`; reduz cobertura e não é convertida em nota zero, pois o produto não conseguiu medir o tenant. |
| Frescor | Segurança, identidade e Service Health: 24h; reports Microsoft: 7 dias; Assessment e Governança: 90 dias; dados comerciais: 30 dias. Evidência fora da janela é `stale`, preservada para leitura, mas não conta como atual. |

### Exemplo: integração ainda não definida

Enquanto não houver provider de backup, o indicador **Backup** permanece com os 20% definidos pelo sponsor, porém é marcado como `not_applicable`. Os demais indicadores de Disponibilidade preservam seus pesos originais e a nota do domínio é normalizada pelos 80% aplicáveis:

```text
nota_disponibilidade = soma(nota_do_indicador × peso_do_indicador_aplicável) / 0,80
cobertura_disponibilidade = 80%
```

O mesmo vale para evidências de Incidentes que dependem de ITSM: MTTR (30% interno) e causa raiz (10% interno) ficam `not_applicable`; incidentes críticos (40%) e recorrência (20%) compõem a nota normalizada sobre os 60% aplicáveis. A interface deve apresentar a nota, a cobertura e o motivo da não aplicação juntos. Isso não se aplica a um workload licenciado ausente: por exemplo, a ausência de Defender zera seu indicador e preserva seu peso.

## Estados de homologação

| Estado | Uso no cálculo |
| --- | --- |
| `homologada` | Fórmula, limiar, fonte e peso estão definidos. |
| `parcial` | Há pesos e evidências, mas falta pelo menos uma regra de transformação em nota. |
| `pendente` | Faltam fórmula, fonte, contrato ou decisão de negócio. |
| `futura` | Depende de integração não disponível no produto. |

## Regras explícitas do sponsor já preservadas

- Domínios e seus pesos globais.
- Média ponderada para o domínio Segurança.
- Faixas de Secure Score, MFA, Conditional Access, uso e ociosidade de licenças, Compliance Score e Service Health onde a planilha as apresenta.
- Separação entre fontes técnicas, Assessment, Governança e dados manuais.

## Hipóteses de cálculo a validar

Quando a planilha define evidência e peso, mas não fecha a função de nota, o Orkestria adota uma hipótese técnica testável em fixture. As hipóteses por indicador, primitivas reutilizáveis e casos de borda estão em `IMDO_Orkestria360_Hipoteses_Validador_V2.md`.

Elas não substituem as limitações de produção: integrações, contratos internos, licenças e linguagem jurídica permanecem registradas em `IMDO_Orkestria360_Pendencias_Homologacao_V2.md`.

## Legado V1

`../health-score/` contém o modelo técnico V1, baseado em sete pilares e somente em dados coletáveis por API. Ele não é a fonte normativa do IMDO V2 e não deve ser combinado numericamente com esta matriz.
