# Produto e autoridades

O Orkestria 360 reúne gestão, governança, conformidade, produtividade e saúde de ambientes corporativos de TI. O planejamento abrange Home, Governança, Normas e Certificações, Microsoft 365, Azure, Assessment, Produtividade e Segurança. Essa visão não significa que todas as capacidades estejam implementadas ou aprovadas para a próxima entrega.

O sistema possui arquitetura e integrações reais. Identidade, tenant e autorização vêm do contexto autenticado. Exemplos de demonstração e fixtures não definem a verdade de produção nem autorizam reduzir a qualidade ou ignorar o isolamento de tenants.

## Onde buscar a verdade de cada assunto

| Assunto | Autoridade |
| --- | --- |
| Princípios de produto e governança | [PRINCIPIOS.md](PRINCIPIOS.md) |
| Referências fornecidas pelo usuário | `inputs/<delivery>/` no commit da branch recebida; briefing e fontes identificados no intake |
| Escopo de uma demanda | Solicitação e decisões aprovadas, discovery e requisitos/plano da revisão em `plans/` |
| Significado de dado, cálculo e disponibilidade | `contratos.md` e contratos aprovados da feature |
| Estrutura e interação de uma superfície | UI Blueprint ou representação estrutural aprovada |
| API externa | Fonte Microsoft oficial e evidências de validação; fixture não define o contrato completo |
| Componentes e APIs visuais existentes | Storybook e repositório Design System, com [referência visual consolidada](DESIGN-orkestria.md) |
| Arquitetura e comportamento implementado | Código, testes e instruções do repositório proprietário, verificados no SHA da entrega |
| Conjunto efetivamente validado | Manifesto da entrega e evidências por SHA |

Decisões específicas não alteram os princípios silenciosamente. Se houver conflito material, registre a contradição e a decisão necessária antes de usar uma fonte como normativa.

## Escopo das entregas

[PRD.md](PRD.md) e [REQUIREMENTS.md](REQUIREMENTS.md) descrevem a visão e os cenários de produto. Cada entrega delimita suas capacidades, contratos e critérios de aceite nos requisitos e no plano aprovados em `plans/<delivery>/r<revision>/`, em conformidade com os princípios. `specs/` é histórico para consulta; seu conteúdo não inicia nem substitui o planejamento de uma nova entrega.

Cenários de demonstração, fixtures e validações de interface precisam de escopo explícito. Eles não substituem persistência, integrações ou autorização quando esses comportamentos fazem parte do resultado aprovado.

Para uma demanda, identifique os artefatos aplicáveis e resolva divergências materiais antes de implementar. A presença de um documento não aprova automaticamente uma nova entrega.

## Diretrizes de escopo

- Princípios I–VII: intenção aprovada, arquitetura canônica, verdade dos dados, consistência visual, isolamento de tenants, rastreabilidade e entrega verificável.
- Selecionar o próximo escopo a partir da solicitação atual e dos artefatos existentes, sem inferir execução de planos antigos.
