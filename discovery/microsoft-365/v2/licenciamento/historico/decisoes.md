# Decisões — Histórico

- Graph e audit logs são evidência e reconciliação, não o único repositório histórico.
- Snapshots detectam alterações de capacidade sem solicitação correspondente e devem gerar evento de atenção.
- Eventos técnicos são registrados na V2. Workflow, operação comercial e efeito financeiro serão vinculados por IDs internos somente na fase futura.
- Auditoria preserva origem por grupo sempre que aplicável, evitando a simplificação “atribuída ao usuário”.
- Retenção e cobertura de audit logs variam; a plataforma copia os eventos relevantes para seu banco.
- O histórico inicia na implantação; snapshots técnicos têm granularidade diária no MVP.
