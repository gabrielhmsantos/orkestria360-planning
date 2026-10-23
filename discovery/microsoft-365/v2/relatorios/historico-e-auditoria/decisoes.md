# Histórico e Auditoria — Decisões

- **Confirmada:** o sponsor requer template, versão, parâmetros, fontes, coleta, processamento, tamanho, hash e eventos relevantes.
- **Confirmada — decisão do usuário:** a Office 365 Management Activity API permanece fora da primeira release; este histórico não declara cobertura de auditoria unificada Microsoft.
- **Confirmada — lifecycle V1:** CSV/XLSX não é persistido; não há retenção, expiração, exclusão ou download posterior de arquivo. Persistem somente request, manifesto, metadados de resultado, hash e eventos sanitizados. A futura Spec define o schema físico e o catálogo inicial, não outro lifecycle de arquivo.
