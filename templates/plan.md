# Plano — <feature>

## Entrada aprovada

Requisitos/revisão em `<artifact_root>/requirements.md`, contratos, commit de Planning e SHAs dos produtos usados na análise. Declare hipóteses e evidências ausentes.

## Estratégia

Como estender as fronteiras canônicas? Justifique complexidade nova e alternativas relevantes. Preserve intenção aprovada e semântica dos dados.

## Escopo por rig

| Rig | Entregável | Contrato consumido/produzido | Dependência | Gate |
| --- | --- | --- | --- | --- |

## Ondas e tarefas

Defina ordem, unidades verificáveis, dependências e rastreabilidade aos critérios de aceite. Quebre ciclos de dependência por compatibilidade explícita, sem merge automático ou workers esperando indefinidamente.

## Integração e ambientes

Defina como compor candidatos por SHA. Indique necessidade de snapshot para UI e uso de `_test` na suíte, sem credenciais. Identifique o contrato de integração frontend/backend e o alinhamento com Design System quando aplicável.

## Validação

Para cada gate, identifique comando/procedimento no repositório proprietário, fronteira observada e evidência esperada. Teste de helper ou documento sintaticamente válido não substitui validação funcional.

## Análise e publicação

Registre achados da análise e condições para iniciar execução. A entrega de alteração termina com PRs abertos, SHAs conferidos e auto-merge desligado. Nenhum agente faz merge ou push na base.
