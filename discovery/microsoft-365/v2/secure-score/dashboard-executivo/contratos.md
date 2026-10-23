# Dashboard Executivo — Contratos

- Dados: fotografia `secureScores`, histórico, agregação por categoria, perfis de controle, comparativos e dados internos de plano/meta. Percentual oficial = `currentScore / maxScore × 100`; pontos disponíveis = `maxScore − currentScore`; diferença para meta = `meta percentual − percentual atual`. Sem `maxScore` disponível ou diferente de zero, os derivados ficam indisponíveis, nunca zero.
- Classificação do percentual: Excelente `90–100`; Bom `75–<90`; Requer atenção `60–<75`; Alto risco `40–<60`; Crítico `0–<40`. Valor fora de faixa ou indisponível não produz rótulo.
- Fonte e limite: `secureScores` é endpoint viável no tenant; plano, meta e riscos correlatos dependem de entidades futuras do Orkestria.

## Integração com o sync coordenado

- Fato e fonte canônica: fotografia `secureScores` publicada por snapshot periódico; o endpoint é viável no tenant (`200`) e não tem delta seguro. Coletar a coleção histórica paginada integralmente, com cobertura da janela devolvida pelo Graph (aproximadamente 90 dias), e promover só uma geração íntegra.
- Consumidores locais: Dashboard Executivo consulta a fotografia, controles e comparativos publicados; as demais abas reutilizam a mesma fonte. Não faz chamada Graph na tela.
- Falha/telemetria: falha, `401/403/404/429` ou erro Graph preserva a geração anterior e publica `availability`, `coverage`, `freshness`, `reason` e `result_state`; o estágio registra início/fim, duração, páginas, itens, tentativas e `Retry-After`.

### Entidades afetadas por recomendações

- MFA é **projeção local** da fonte canônica já publicada `userRegistrationDetails` combinada com identidades: `isAdmin=true` e `isMfaRegistered=false` mede administradores registrados sem MFA, excluindo usuários desabilitados que o relatório não devolve.
- Intune é uma **nova coleta justificada** de `managedDevices`, para `complianceState=noncompliant` dentro do inventário gerenciado. A validação retornou `401 UnknownError`; não publicar total de dispositivos nem zero até consentimento efetivo e licença Intune.
- SharePoint/OneDrive: `sites/getAllSites`, `sites/{site-id}/permissions` e `admin/sharepoint/settings` são endpoints viáveis (`200`). O primeiro enumera sites; pelo contrato Learn, `200 value: []` sem filtros em permissões é `empty_valid_response` — não há permissão direta retornada no site amostrado, sem inferir subsites ou conteúdo. Settings fornece postura global, incluindo `sharingCapability` e restrição de domínios. O indicador disponível deve ser nomeado “postura de compartilhamento configurada no tenant e permissões explícitas de site observadas”; não deve alegar exposição efetiva de arquivos/pastas sem futura varredura de drives/itens.
- A coleta SharePoint é estritamente somente leitura: apesar de `Sites.FullControl.All` ser necessário pelo endpoint de permissões, o conector futuro aceita apenas requisições `GET` para hosts SharePoint/Graph, bloqueia métodos de escrita (`POST`, `PUT`, `PATCH`, `DELETE`) e não possui comando ou operação pública de alteração.
- Exchange: `messageRules` é **nova coleta justificada** por mailbox elegível e foi validada com `200 value: []`. Detecta apenas regras da Caixa de Entrada com encaminhamento/redirect externo; mailbox forwarding e regras de transporte exigem integração Exchange Online complementar. Persistir domínio/indicador externo, não endereços de destinatários.
- Defender for Endpoint é fonte externa distinta: `machines` devolveu `403 Unauthorized`. A futura coleta requer token com audiência própria e `Machine.Read.All`, correlação por `aadDeviceId` com inventário publicado e cobertura explícita de máquinas não associadas.
