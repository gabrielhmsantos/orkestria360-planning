# Histórico e Auditoria — Contratos

- `ReportRequest`, `ReportSourceManifest`, `ReportArtifact` e `ReportAuditEvent` são tenant+conexão-scoped. O manifesto é criado apenas por solicitação aceita e permanece imutável; histórico não o usa para calcular disponibilidade atual do catálogo.
- `ReportArtifact` é somente evidência persistida de arquivo efêmero: formato, tamanho, hash, resultado e instante de entrega. Conteúdo, storage, URL, retenção, expiração, exclusão e download posterior não existem na V1.
- A superfície não consome Office 365 Management Activity API; eventos Microsoft só aparecem se já estiverem publicados por fonte canônica autorizada.

## Integração com o sync coordenado

- **Resultado: projeção local.** A trilha consulta eventos e manifestos locais por tenant+conexão. Ausência de auditoria Microsoft não é ausência de eventos; é cobertura `unavailable`/`restricted` com motivo sanitizado.
- Histórico, detalhe e exportação de metadados respeitam exatamente o escopo de PII/autorização da solicitação; não mostram payload bruto, URL, token, identificador mascarado ou dado de outra tenant/conexão.
