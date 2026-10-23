# Construtor de Relatórios — Decisões

- **Confirmada — decisão do usuário:** a Taxa de adoção é métrica V1 do bloco previamente definido e não envolve licenças ou usuários do Orkestria. Sua população é o agregado imutável publicado pelo ciclo de Licenciamento e vinculado inequivocamente ao snapshot de uso; não lê `UserLicenseAssignment` corrente nem infere histórico por timestamp.
- **Confirmada — decisão do usuário:** o bloco de Economia anual estimada usa `economia mensal estimada × 12` somente quando o Assessment publicar a economia mensal canônica. O Assessment não integra esta entrega; portanto, o bloco fica `unavailable` na V1, sem valor estimado.
- **Confirmada — decisão do usuário:** a Taxa de conformidade permanece exemplo futuro, sem bloco ou cálculo na V1. O DOCX não define catálogo canônico de controles, fontes por controle, tratamento de estado parcial ou cobertura para a fórmula `controles conformes ÷ controles avaliados × 100`.
- **Confirmada — decisão do usuário:** o Construtor guiado entra na primeira release; o builder livre não entra.
- `member` seleciona template aprovado, período e filtros allowlisted e gera seu arquivo; não compartilha, agenda, altera fórmula ou acessa fonte restrita.
- `customer admin` mantém configurações locais com blocos aprovados e identidade visual do customer; não cria permissão nem muda fonte Microsoft.
- `platform admin` mantém catálogo, schemas e blocos globais no control plane; nunca acessa dados ou artefatos do customer.
- Fórmulas, comparações e componentes são pré-definidos e versionados. SQL, GraphQL, Graph, HTML/JS, URLs e uploads executáveis são proibidos.
