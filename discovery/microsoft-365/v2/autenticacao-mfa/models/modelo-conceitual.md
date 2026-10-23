# Modelo conceitual — Autenticação (MFA)

## Entidades propostas

| Entidade | Finalidade | Fonte/estado |
| --- | --- | --- |
| Registro MFA atual | estado por identidade, métodos, capacidade e sinais derivados | Graph `userRegistrationDetails`; `available` quando publicado. |
| Snapshot de cobertura | série histórica de elegíveis, registrados, capazes e adoção | banco Orkestria; `unavailable` até regra e job aprovados. |
| Política de método e força | configuração de métodos e forças de autenticação | Graph Policy; `restricted` por permissão. |
| Evento de sign-in | autenticação, método, resultado, contexto e risco | Graph sign-ins; `restricted` por permissão/retenção. |
| Sinal de risco | risco de identidade ou login | Graph Identity Protection; `restricted` por licença/consentimento. |
| Exceção MFA | justificativa, aprovação, validade e responsável | banco Orkestria; `unavailable` até workflow aprovado. |
| Alerta MFA | achado priorizado, severidade, origem e resolução | derivado + banco Orkestria; `unavailable` até catálogo aprovado. |
| Auditoria interna | ação do Orkestria, antes/depois e justificativa | banco Orkestria; `coming_soon` enquanto não houver ações. |

## Regras a formalizar

- Elegibilidade, classificação de método, correlação de MFA em sign-ins, score, recorrência e deduplicação são hipóteses ou recomendações do DOCX e exigem decisão normativa.
- Snapshots, eventos e auditoria têm retenções apenas sugeridas pela referência; a Spec deve decidir conformidade, LGPD e ciclo de vida.
