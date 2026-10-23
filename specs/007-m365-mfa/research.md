# Research: Microsoft 365 — Autenticação (MFA)

## Decisões

### Mapa de extensão do sync coordenado (T001)

**Estado atual**: `CoordinatedSyncCoordinator` abre o ciclo, registra cada
estágio por `SyncStageRecorder` e só promove a fonte consumível depois de sua
coleta. Identidades publicadas habilitam associações, licenças e atividade;
grupos publicados habilitam relações, atividade e licenciamento; os eventos
canônicos (`directory_audits` e `sign_ins`) já são coletados como estágios
separados. O bloco agregado `identity_secondary_snapshots` ainda reúne roles,
PIM, registro MFA e risky users por `UsersAccountsSynchronizer`.

**Desenho MFA**: T015 substituirá esse bloco pelos estágios independentes
`privileges`, `mfa_registration`, `risk_users` e `risk_detections`. O estágio
`mfa_policy` só será iniciado após `groups` e `group_relationships` publicados
no ciclo, pois a aplicabilidade de SMS/Voice depende das associações locais.
Cada estágio futuro usará `start`, `complete`, `fail` ou `skip`, com publicação
e telemetria independentes por fonte. Essa preservação granular é objetivo de
T015 — hoje o bloco agregado só roda depois de a geração de identidades ter
sido publicada. A página nunca participa da coleta. `directory_audits` e
`sign_ins` continuarão sendo a fonte canônica de eventos, sem nova leitura
Graph para MFA.

### Consumir somente projeções publicadas

**Decision**: Todas as abas leem snapshots, source states e eventos canônicos publicados; nenhuma página chama Microsoft Graph.

**Rationale**: Mantém uma única coleta por fonte, preserva a última publicação após falha e atende ao sync coordenado.

**Alternatives considered**: Consultar Graph por filtro/tabela foi rejeitado por repetir leitura, vazar diferenças de frescor e quebrar a semântica de disponibilidade.

### Política de telefone em snapshot único

**Decision**: Coletar `authenticationMethodsPolicy` como snapshot e extrair `Sms` e `Voice` (estado, alvos e `isOfficePhoneAllowed`); não coletar `/sms` e `/voice` separadamente em produção.

**Rationale**: Os endpoints específicos foram validados, mas a política geral já contém o mesmo fato e evita chamadas redundantes.

**Alternatives considered**: Leitura individual de configurações foi rejeitada como duplicada; classificar `mobilePhone` por texto fixo foi rejeitado porque o tenant pode alterar as políticas.

### Semântica de telefone

**Decision**: `microsoftAuthenticatorPush` identifica Authenticator por push; `mobilePhone` identifica telefone móvel, não SMS ou ligação. O canal exibido depende de SMS/Voice e dos grupos da identidade; escopo ausente torna o canal indisponível.

**Rationale**: A validação no tenant retornou `phoneType: mobile` e `smsSignInState: notAllowedByPolicy`; a coleção em massa não diferencia os canais.

**Alternatives considered**: Inferir SMS ou voz por `mobilePhone` foi rejeitado por não ser fato Graph.

### Eventos e retenção

**Decision**: Reutilizar sign-ins e directory audits canônicos por watermark, com retenção por tenant de 180 dias; snapshots de identidade/MFA/risco seguem poda de 12 meses.

**Rationale**: É o contrato já publicado pelo sync coordenado e mantém histórico consistente entre módulos.

### Estados sensíveis

**Decision**: Risco sem licença P2, políticas sem consentimento, score, alertas, exceções e ações operacionais são `restricted`, `unavailable` ou `coming_soon`, jamais zero.

**Rationale**: A experiência precisa comunicar condição e frescor sem fabricar conclusão de segurança.
