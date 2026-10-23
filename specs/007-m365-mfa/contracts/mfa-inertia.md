# Contract: Inertia — Autenticação (MFA)

## Rota e entrada

`GET /microsoft-365/autenticacao-mfa/{tab?}` retorna a página MFA e uma aba válida na ordem da spec. O controller delega o domínio ao serviço de page data; props compartilhadas ficam restritas ao shell.

## Envelope

```text
data: {
  activeTab,
  globalPeriod: "30d" | "60d" | "90d" | "180d",
  lastSynchronization,
  sources: SourceState[],
  dashboard, coverage, methods, events, failures, policies, risk, history
}
```

`globalPeriod` é o único recorte de tempo público do módulo. A UI o guarda em `sessionStorage` e faz visitas Inertia com `preserveUrl`; a URL não retém período, filtros nem paginação. Cada aba contém `availabilityStatus`, `reason`, `freshness`, `coverage`, `textSummary` e apenas os blocos publicados para sua finalidade. Gráficos carregam série e resumo textual equivalente; tabelas retornam linhas minimizadas e a paginação é local ao cliente.

Fatos temporais usam a janela atual `[agora − período, agora)` e comparam automaticamente `[agora − 2 × período, agora − período)`, sempre sem sobreposição. Se não existir base anterior, o KPI mostra `— vs. período anterior`. Fotografias de Cobertura e Métodos permanecem no estado atual publicado; seus KPIs numéricos comparam a última fotografia disponível em ou antes de `agora − período`. Controles textuais ou booleanos de Políticas não recebem comparação.

## Cobertura e registro

`coverage.directory.items` contém a identidade minimizada e os fatos de registro MFA da geração publicada. As linhas partem de `IdentityMfaRegistration.generation_id`; atributos atuais de `DirectoryIdentity` são associados pelo `directory_identity_id`, sem exigir que `last_seen_generation` seja igual à geração MFA — os dois ciclos podem ser publicados em momentos diferentes. `methods` traduz localmente os valores publicados de `methodsRegistered` para rótulos de apresentação, e `passwordless` preserva `isPasswordlessCapable` como booleano; ambos permanecem nulos/vazios somente quando a fotografia individual não contém o fato. A coluna `Métodos` exibe somente a contagem; os rótulos ficam no painel de detalhes da identidade. A coluna `lastLogin` é uma projeção local de `IdentityActivitySignal` com `source = Microsoft Graph signInActivity`, limitada à mesma geração da cobertura MFA: nunca consulta Graph pela tela nem usa o histórico de `signIns`. Cada linha declara `lastLoginAvailabilityStatus` e `lastLoginReason`; com a fonte `available`, `lastLogin` pode ser `null` e representa ausência válida de sinal, enquanto a interface o apresenta no rótulo temporal canônico `Hoje às HH:MM`, `Ontem às HH:MM` ou `Há N dias` (e `—` quando não houver sinal). Com a fonte `restricted` ou `unavailable`, `lastLogin` é nulo e a razão da fonte é preservada, sem se apresentar como ausência de login. Busca, status, capacidade, tipo, departamento, localização e paginação são filtros locais da tabela; não alteram KPIs, gráficos ou laterais.

## Eventos e utilização

`events.window` declara somente o período global usado por KPIs, séries, rankings e tabela. `comparison` e `granularity` não são APIs públicas: a comparação anterior é automática e a granularidade é decidida internamente a partir do período. A paginação de Últimos eventos de autenticação é local e não altera os demais blocos.

`dashboard.applications.items` e `events.applications.items` expõem as cinco aplicações de maior volume da janela publicada; quando houver mais categorias, consolidam a cauda em `Outros`. A soma das linhas continua representando o total publicado do card.

Todo bloco compacto de barras ou donut com dimensão não limitada (`métodos`, `dispositivos`, `localizações` e `tipos de risco`) expõe no máximo cinco categorias e consolida a cauda em `Outros`; a tabela operacional correspondente permanece a fonte para investigação completa.

## Falhas e bloqueios

`failures.window` usa somente o período global. A projeção consulta somente eventos `signIns` publicados com `result != 0`; filtros locais `type` (cliente publicado) e `status` (código de resultado) afetam exclusivamente Últimos eventos de falha e sua paginação, nunca KPIs, gráficos ou rankings.

`failures.categories.items` expõe os seis **códigos numéricos** `status.errorCode` de maior volume na seleção atual; cada item preserva `code` (valor Graph), `normalizedCode` (`AADSTS{código}`), `label` humano e `category` analítica. A chave de agrupamento nunca é o texto variável de `failureReason` nem a categoria. Códigos remanescentes são agregados em `Outros`, sem alterar o total central do donut.

`failures.rankings.applications.items` expõe as cinco aplicações com mais falhas e consolida as demais em `Outros`. `failures.rankings.ips.items` limita o ranking a cinco IPs minimizados; pessoas e IPs não são agregados em `Outros`.

`failures.events.items.category` mantém exclusivamente o motivo publicado pelo Graph (`status.failureReason`) quando seguro; eventos históricos sem esse campo usam `Motivo não informado`. A linha também publica `failure` com código normalizado, rótulo humano, família analítica e chave técnica opcional do catálogo versionado AADSTS. A coleta guarda `failureReason` e `additionalDetails` cifrados como evidência, sem expor `additionalDetails`. As linhas contêm somente `id`, hora, identidade minimizada, aplicação, método, categoria, classificação de falha, IP minimizado, localização, dispositivo, tipo de cliente e `detail` seguro derivado deste último. `location` concatena somente as partes publicadas `city`, `state` e `countryOrRegion`; IPv4 e IPv6 são sempre minimizados, inclusive IPv6 mapeado para IPv4. Falha e detalhe podem ser truncados visualmente, mas expõem seu texto seguro integral por tooltip focável. Não retornam UPN, IP integral, payload Graph ou uma ação de tenant. `recurring`, `suspiciousIps`, `criticalMethod` e ações de bloqueio/remediação permanecem `unavailable` ou `restricted` enquanto a regra, o limiar ou a classificação correspondente não estiver publicada.

## Políticas e proteção

`policies.tables` expõe blocos independentes para `methods`, `strengths` e `conditionalAccess`; cada bloco conserva o `availabilityStatus` e a razão do endpoint que o publicou. `security_defaults` alimenta somente o controle Defaults quando a fotografia publicada estiver disponível. Score, exigência de MFA, autenticação legada, contas de emergência, resumo, exceções e verificação de efetividade não são inferidos do registro MFA: ficam `unavailable` ou `restricted` até a fonte e a regra correspondente existirem. A aba não contém rota ou ação de alteração de tenant.

## Usuários de risco

`risk` usa o snapshot publicado de `riskyUsers` para a tabela de estado atual; KPIs, tendência e Tipo respeitam o período global. `riskDetections` publicado alimenta separadamente Logins de risco e Tipo na mesma janela. Nível, estado, busca e paginação são locais somente à tabela de Usuários de risco. Quando a licença/consentimento restringe uma fonte, o bloco dependente preserva `restricted` e motivo em vez de produzir zero.

`risk.table.items` contém somente identidade minimizada, nível, estado, atividade, registro MFA, indicador de privilégio, último login quando publicado e detalhe minimizado de risco. Não expõe UPN, payload Graph ou endpoint de revogação/redefinição/bloqueio; ações de tenant seguem indisponíveis ou `coming_soon`.

## Histórico e auditoria

`history` consulta exclusivamente `directoryAudits` publicados na janela global. A fonte controla disponibilidade e motivo da aba; categoria, tipo, usuário, origem e paginação são locais somente à lista de eventos, sem alterar KPIs, origens ou filtros rápidos. `history.retention` lê a política efetiva do tenant com `event_kind = directory_audit`.

`history.table.items` contém data/hora, categoria, tipo, descrição, ator e objeto minimizados, origem, resultado, IP minimizado e detalhe seguro. Não retorna UPN, IP integral, payload Graph, exportação ou ações de tenant. Ações sensíveis ficam `restricted` ou `coming_soon`.

## Política de telefone

```text
phoneChannels: Array<{
  identityId: string,
  registration: "mobilePhone",
  sms: { availabilityStatus, applicable },
  voice: { availabilityStatus, applicable },
  display: "mobile" | "sms" | "voice" | "sms_and_voice"
}>
```

Cada item é emitido apenas para uma identidade que tenha registrado `mobilePhone`. `applicable` é calculado com estado e alvos da fotografia de política, mais grupos publicados da identidade. Se a resolução não for possível, o canal correspondente é `unavailable`; não há chamada Graph da página.

`phoneSummary` agrega somente canais emitidos, preservando `availabilityStatus` para telefone, SMS e ligação. Um canal de política sem escopo resolúvel continua `unavailable`, nunca `0`.

## Estados

`available`, `restricted`, `unavailable` e `coming_soon` usam a linguagem de disponibilidade existente. `empty_valid_response` é vazio válido, nunca sinônimo de restrição ou zero. Exportação e alterações de tenant não têm endpoint executável.
