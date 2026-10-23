# Colaboração e Compartilhamento — Contratos

- Política: configuração, escopo, valor atual, baseline, estado, origem e última alteração.
- Domínio/convidado/link: estado e contagens agregadas; identidade é omitida ou marcada `restricted` quando autorização/cobertura não permitir detalhe.
- SharePoint requer permissões específicas de leitura de tenant; o catálogo expõe essa condição, não a tela.

## Integração com o sync coordenado

SharePoint e grupos são projeções locais das fontes canônicas já existentes. `authorizationPolicy` e `crossTenantAccessPolicy` são novas coletas snapshot justificadas, ambas tecnicamente viáveis. Cada uma executa por conexão customer antes do staging, preserva a última publicação diante de falha ou restrição e expõe `availability`, `coverage`, `freshness`, `reason` e `result_state`. Telemetria separa coleta, staging e promoção atômica; a tela consulta somente o estado local e não chama Graph.

`sharepointSettings` é extensão/leitura complementar viável por conexão customer. Ele publica os fatos de compartilhamento e sincronização que expõe, mas não pode derivar uma permissão padrão `Edit` de link anônimo nem proteção de acesso por dispositivo não gerenciado. Esses dois fatos permanecem `unavailable`/parciais até fonte específica homologada; não há fallback PowerShell autorizado por esta evidência.

Para a trava de autenticação legada, `isLegacyAuthProtocolsEnabled=false` é o baseline conforme de SharePoint/OneDrive. Somente `currentValue=true` ativa o fato de autenticação legada permitida; `false` é conforme e indisponibilidade não ativa a trava.
