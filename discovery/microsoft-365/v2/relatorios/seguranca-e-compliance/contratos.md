# Relatórios de Segurança e Compliance — Contratos

- **Projeção local:** Secure Score e seus controles são publicados e connection-scoped. MFA, risco, Configurações, identidades e eventos de diretório são consumidores possíveis somente após suas próprias publicações/ciclos compatíveis.
- **Restrição:** Defender incidents/CVEs, DLP/Purview, labels e service health não são Graph Reports e não possuem publicação que sustente essas regiões hoje. Intune só entra com sua publicação específica. A Management Activity API não é ativada por esta tela.

## Integração com o sync coordenado

- **Resultado: projeção local.** A superfície consulta fatos e source states já publicados na conexão customer; não lança coleta de segurança, compliance ou auditoria em request.
- Falha/restrição independente mantém a fonte anterior quando existente e deixa a cobertura explícita; não aprova controle nem certificação.
- Secure Score não equivale a certificação LGPD, ISO, CIS ou Zero Trust. O resumo só apresenta controles/evidências publicados e situação humana; os status técnicos permanecem para auditoria, fora da interface.
- Requisito `required` indisponível bloqueia template/configuração; requisito `degradable` só preserva o bloco `restricted`/`unavailable` quando o template permitir saída parcial identificada. Nenhuma correlação de fontes reidentifica pessoa ou amplia acesso a dado restrito.
