# <Superfície> — Fontes e viabilidade

Mapeie como o backend pode satisfazer `contratos.md`. Este artefato não muda o
contrato semântico, não define componentes de UI e não substitui a evidência
externa de `api.md` e `openapi.yaml`.

## Mapping fonte → contrato Orkestria

| Fato/contrato | Estratégia e fonte canônica | Campo ou shape de origem | Normalização/composição | Cardinalidade, ausência e relações | Estado de viabilidade e evidência |
| --- | --- | --- | --- | --- | --- |
| `<fato ou campo do contrato>` | `<projeção local \| extensão canônica \| leitura complementar \| nova coleta justificada \| fonte interna \| sem fonte em escopo>` | `<campo do provider, publicação ou agregação; link para a evidência>` | `<direta, rename, enum, fallback, join, cálculo, unidade, enrichment ou deduplicação; múltiplas fontes quando necessário>` | `<1:1, 1:N, nullability, vazio, indisponível, ordenação ou paginação>` | `<confirmada \| documentada \| pending_backend_validation \| bloqueada; condição ou limitação>` |

## Reuso e coleta

- **Projeções locais reutilizadas:** <fatos publicados e seus consumidores>.
- **Extensões ou leituras complementares:** <campos exclusivos e correlação>.
- **Novas coletas justificadas:** <motivo e estratégia de alto nível>.

## Disponibilidade técnica

- **Provider e contrato externo:** <link para `api.md` e `openapi.yaml`, quando houver>.
- **Permissões, licença, audience, consentimento e versão:** <pré-requisitos abstratos conhecidos>.
- **Paginação, retry, freshness e histórico:** <comportamento necessário para satisfazer o contrato>.
- **Cobertura sintética do simulador:** <operação `SUPPORTED`, cenários, artefatos externos e referência ao simulador, quando necessária>.

## Fixtures de Discovery

- **Manifesto:** <link para `fixtures/README.md`; contrato instanciado e cenário>.
- **Fixtures e proveniência:** <arquivos sintéticos e linhas da matriz acima que sustentam seus valores estruturais>.
- **Relação com o Simulator:** <operação/cenário externo que pode ser comparado por mapping; não copiar a fixture do provider>.

## Lacunas e incompatibilidades

- **Candidatos técnicos do sponsor:** <IDs aplicáveis, disposição final ou validação pendente; nenhum candidato pode desaparecer>.
- **Fatos sem fonte confirmada:** <fato, impacto e próximo passo>.
- **Bloqueios técnicos:** <evidência sanitizada; não concluir inviabilidade sem prova>.
- **Incompatibilidade material:** <diferença entre provider e contrato; normalização possível ou clarificação de produto necessária>.

## Impacto no contrato compartilhado

- <confirmação de que a fonte satisfaz o contrato, normalização necessária ou decisão de produto pendente>.

Não reduza ou altere `contratos.md` para refletir o payload do provider sem
evidência e autorização para uma mudança semântica de produto.

Quando houver provider externo, “payload real” significa somente shape e
semântica confirmados por documentação oficial, fonte canônica e validação
técnica. Fixtures permanecem sintéticas: valores concretos, IDs e relações
fictícios são permitidos quando conformes ao contrato e ao mapping. Nunca
registre payload de customer, PII, token, tenant ou ID real.

Não registre neste artefato `tenant_id`, customer, conexão, resultado de acesso
ou cobertura operacional. Esses fatos pertencem ao collector e à publicação de
produção, não ao discovery.
