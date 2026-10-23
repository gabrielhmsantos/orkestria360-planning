# APIs — Relatórios Executivos

Não há rota externa própria. O relatório executivo usa somente um manifesto local que fixa publicações e períodos já coletados.

## Uso pela aplicação

Resultado: **projeção local**. Secure Score usa sua publicação da conexão atual; licenças atribuídas usam `LicenseInventoryPublication`; usuários ativos M365 exigem o agregado publicado de `getOffice365ActiveUserDetail(D30)`. O preflight usa publicações atuais e uma solicitação aceita fixa o manifesto; a renderização posterior não relê Graph nem apresenta fotografia corrente como período histórico. PPTX, PDF e IA não têm contrato externo validado neste discovery.
