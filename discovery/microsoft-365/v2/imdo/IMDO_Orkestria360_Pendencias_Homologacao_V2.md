# IMDO Orkestria360 — Dependências Reais V2

## Critério

Este arquivo não lista fórmulas que o Orkestria pode propor e validar. Essas regras estão em `IMDO_Orkestria360_Hipoteses_Validador_V2.md` e serão exercitadas por fixtures no futuro script de teste.

Permanecem aqui apenas decisões que um cálculo local não resolve: escolha de provider, contrato entre módulos, disponibilidade de licença/permissão ou limite jurídico de comunicação.

## Dependências externas e internas

| ID | Dependência real | Domínios afetados | Por que o validador não resolve | Próximo responsável |
| --- | --- | --- | --- | --- |
| DEP-001 | Contrato de saída do Assessment | Segurança, Governança, Compliance, Produtividade | A fixture pode simular scores, mas produção precisa de score, evidências, cobertura, versão e data reais. | Produto / Assessment |
| DEP-002 | Dados de Estruturação e Governança | Governança, Compliance, Disponibilidade, Licenciamento | O contrato proposto em [`governance-evidence-form-v1.yaml`](../../../estruturacao-governanca/v2/governance-evidence-form-v1.yaml) já define os oito tópicos, seções, modos de evidência e revisão administrativa. Continua pendente somente implementá-lo e expor seu resultado como contrato interno de produção. | Produto / Governança |
| DEP-003 | Implementação do cadastro comercial de vigência e renovação | Licenciamento e Custos | A decisão está fechada: tabela interna por tenant e SKU, preenchida manualmente na primeira fase, guarda preço, vigência e renovação; Graph fornece SKUs e quantidades. Falta implementar o cadastro, os alertas e a futura reconciliação via Partner Center/distribuidor. | Comercial / Produto |
| DEP-004 | Provider de backup | Disponibilidade | Integrações de backup estão explicitamente fora desta fase. Backup fica `not_applicable`, preserva seu peso de 20%, sai do denominador e reduz a cobertura de Disponibilidade para 80%. DR não depende deste provider quando usa evidências internas. | Aberto para fase futura |
| DEP-005 | ITSM para MTTR e causa raiz | Disponibilidade | ITSM está explicitamente fora desta fase. MTTR e causa raiz ficam `not_applicable`; Incidentes é calculado por críticos e recorrência, com cobertura interna de 60%. | Aberto para fase futura |
| DEP-006 | Permissões da aplicação no tenant | Segurança, Compliance, Produtividade | Sem consentimento/permissão, o Orkestria não consegue medir o sinal e reduz cobertura. Ausência de licença ou workload não entra nesta dependência: zera o indicador previsto e mantém seu peso. | Administração do tenant |
| DEP-007 | Conectores para APIs especializadas | Segurança, Produtividade | O catálogo de endpoints V2 definiu as superfícies de Defender XDR, Power BI REST, Power Platform e Copilot. Ainda faltam conectores autenticados, confirmação da telemetria de execução do Power Automate e validação do relatório Copilot disponível no tenant. | Produto / Integrações |
| DEP-008 | Linguagem jurídica para LGPD e ISO 27001 | Compliance | O cálculo mede maturidade operacional; não pode declarar conformidade legal ou certificação sem validação jurídica. | Jurídico / Sponsor |

## Não bloqueia o validador

- Ausência de integração deliberadamente fora de escopo: o script usa fixture local ou marca o sinal como `not_applicable`. Ausência confirmada de licença/workload previsto: o script preserva o peso e retorna nota zero.
- Fórmulas não escritas pelo sponsor: o script aplica as hipóteses técnicas documentadas e mostra cada contribuição.
- Indicador não aplicável ou evidência antiga: o script usa as convenções do modelo para cobertura, confiabilidade e frescor.
- SKUs e quantidades: o script usa Graph. Preço/valor unitário: usa a tabela própria do Orkestria. Partner Center não é fonte normativa nesta fase.

## Condição para produção

As dependências acima bloqueiam somente a alimentação automática em produção. Elas não bloqueiam a construção do motor de cálculo, a validação de fórmulas nem a criação de cenários demonstráveis.
