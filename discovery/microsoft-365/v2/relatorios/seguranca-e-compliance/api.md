# APIs — Relatórios de Segurança e Compliance

Não há rota externa própria nesta superfície. Ela correlaciona Secure Score/controles, MFA, risco, Configurações e eventos locais somente quando cada fato foi publicado pela fonte canônica correspondente. Nenhum deles é substituído pela Graph Reports API.

## Uso pela aplicação

Resultado: **projeção local**. Secure Score/controles já têm publicação; MFA, risco e Configurações só entram após projeção da conexão compatível. Defender incidents/CVEs, DLP/Purview, labels, service health publicado e auditoria unificada não têm fato canônico disponível nesta superfície. A tela não troca restrição por zero nem introduz Office 365 Management Activity API.
