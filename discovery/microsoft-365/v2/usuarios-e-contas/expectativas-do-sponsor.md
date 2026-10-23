# Expectativas do sponsor — Microsoft 365 / Usuários e Contas

## Referências primárias

- `Microsoft365_UsuarioseContas.docx`
- Imagens `01.Dashboard Executivo.png` a `08.Histórico e Auditoria.png`

## Capacidades e superfícies esperadas

| Superfície | Resultado esperado | Blocos ou capacidades | Estado e condição |
| --- | --- | --- | --- |
| Dashboard Executivo | Entender a saúde das identidades rapidamente | métricas, distribuição, cobertura, qualidade, eventos, recortes e alertas | `available` para estrutura; risco e MFA podem ser `restricted` por licença/permissão. |
| Diretório de Usuários | Consultar e contextualizar identidades | filtros, tabela, exportação, perfil por abas, recomendações | `available` para leitura de diretório; ações de tenant são `coming_soon`. |
| Saúde das Contas | Priorizar não conformidades | score, categorias, severidade, lista, evolução e ações recomendadas | `available` quando há dados; regras internas e dados de RH podem ser `unavailable`. |
| Atividade e Inatividade | Identificar uso, inatividade e desperdício potencial | faixas, tendência, tempo sem acesso, lista e insights | `restricted` quando `signInActivity` ou logs não estiverem autorizados. |
| Contas Privilegiadas | Governar privilégios administrativos | funções, permanência/PIM, MFA, risco, lista e alertas | `restricted` conforme funções, PIM e Identity Protection disponíveis. |
| Convidados e Externos | Controlar identidades B2B | status, domínio, atividade, patrocinador, licenças e recomendações | `available` para dados Graph; patrocinador e revisão podem ser `unavailable`. |
| Ciclo de Vida | Acompanhar processos de admissão, desligamento e revisão | etapas, solicitações, tarefas, SLAs, indicadores e atalhos | `coming_soon` até workflows, aprovações e integrações serem aprovados. |
| Histórico e Auditoria | Investigar mudanças e eventos | métricas, categorias, tendência, criticidade, tabela e exportações | `restricted` por permissão/retenção; histórico próprio depende de persistência. |

## Critérios transversais

- Informar atualização e origem de dados em todas as superfícies.
- Diferenciar visualmente investigação, alerta, recomendação e ação efetiva.
- Permitir filtros e aprofundamento sem perder o contexto da área selecionada.
- Manter ações mutáveis sujeitas a autorização, confirmação e auditoria.

## Pendências

- Aprovar papéis e escopo das ações operacionais.
- Validar matrizes de permissão/licenciamento e privacidade por bloco.
- Formalizar métricas, janelas de inatividade e score proprietário por tenant.
