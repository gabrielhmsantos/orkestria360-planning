# Modelo conceitual — Relatórios

## Entidades candidatas para futura Spec

| Entidade | Finalidade | Limite/invariante |
| --- | --- | --- |
| `ReportTemplate` | Estrutura global/versionada de um tipo de relatório: formatos, requisitos e blocos permitidos. | Não contém dado customer nem define fonte atual de uma execução. |
| `ReportBlockDefinition` | Unidade estrutural/versionada reutilizável ou pertencente ao schema do template. | Define ID estável, tipo de apresentação, fontes/requisitos, campos/métricas, filtros/parâmetros allowlisted, granularidade, disponibilidade, PII, formatos e transformação/fórmula previamente definida. Cada requisito é `required` ou `degradable`; não aceita código, query ou fórmula fornecida pelo usuário. |
| `ReportConfiguration` | Configuração tenant-scoped permitida sobre template/blocos aprovados. | Seleciona somente blocos, períodos e filtros allowlisted; não adiciona fonte, fórmula, permissão ou granularidade. |
| `ReportSourceManifest` | Evidência imutável de uma solicitação aceita, criada após preflight. | Fixa tenant, conexão, versão do template/configuração, publicações selecionadas, source states, período, parâmetros, disponibilidade/cobertura/frescor e hash. Não calcula disponibilidade geral nem é mutado. |
| `ReportRequest` | Registra o preflight aceito e a execução local vinculada a um manifesto. | Tenant + conexão; alteração material exige nova solicitação e manifesto. |
| `ReportArtifact` | Metadados persistidos do resultado efêmero: formato, tamanho, hash, resultado e instante de entrega. | Não persiste conteúdo, URL, segredo ou cópia para download posterior; não possui retenção, expiração ou exclusão de arquivo na V1. |
| `ReportAuditEvent` | Registra evento local sanitizado de preflight, geração, entrega ou falha. | Não substitui eventos Microsoft; PII mínima, escopo autorizado e RLS obrigatórios. |

Uma publicação canônica de módulo-fonte pode conter agregados derivados e imutáveis produzidos localmente pelo próprio módulo. O `ReportSourceManifest` referencia a publicação e sua geração, não reconstitui fatos a partir do estado corrente. Para Taxa de adoção, Licenciamento publica o agregado de população elegível com identidade de geração, tenant, conexão, cobertura e regra de SKUs congelada.

## Lifecycle canônico

1. Catálogo e seleção avaliam `ReportTemplate` e `ReportBlockDefinition` contra publicações/source states atuais da mesma tenant+conexão, sem consultar manifestos anteriores.
2. O preflight valida parâmetros, filtros, períodos, requisitos e autorização. `required` ausente/restrito bloqueia; `degradable` só continua se o template permitir saída parcial marcada.
3. A solicitação aceita cria o manifesto. Prévia e geração usam a mesma fotografia congelada; não relêem o estado atual.
4. CSV/XLSX é entregue de forma efêmera e controlada. Request, manifesto, hash/metadados e eventos permanecem para reprodução e auditoria, sem armazenar o arquivo.

## Não incluído nesta versão

- Destinatário externo, e-mail, canal Teams, biblioteca SharePoint/OneDrive, aprovação e assinatura da Office 365 Management Activity API.
- Regra comercial de preço, renovação, margem ou economia: pertencem à entrada comercial do Assessment/CSV já definida em Licenciamento.
