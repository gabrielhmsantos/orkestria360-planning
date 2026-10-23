---
name: frontend-contract-fixtures
description: Crie, gere e valide fixtures sintéticos globais multi-superfície do contrato Orkestria. Use para uma população compartilhada por superfícies relacionadas; não use para payloads do provider, Simulator ou código de produto.
---

# Frontend Contract Fixtures

Esta skill opera exclusivamente fixtures globais multi-superfície. Uma base
canônica descreve um cenário sintético de tenant e suas entidades relacionadas;
as projeções de cada superfície são sempre geradas dessa mesma base. Não crie
JSON, manifesto, cenário ou comando isolado por superfície.

## Pré-requisitos

Leia os contratos, o mapping de viabilidade e o UI Blueprint das superfícies
atingidas. O contrato precisa definir shape, tipos, nulabilidade, cardinalidade
e estados necessários. Uma fixture não autoriza campo, relação, cálculo, enum
ou comportamento novo.

Use apenas valores, IDs, datas, labels e relações sintéticos e determinísticos.
Nunca registre customer, tenant, PII real, token, URL pré-autenticada, ID real
ou resposta coletada.

## Modelo obrigatório

1. Crie uma única base JSON no discovery. Ela contém os cenários globais,
   população, relações, séries e projeções específicas que não possam ser
   derivadas diretamente das entidades.
2. Todo cenário existe para o tenant inteiro. `populated`, `partial`, `empty`,
   `restricted`, `unavailable`, `stale` e `failed` não podem ser escolhidos de
   forma independente por superfície.
3. `partial` preserva a mesma população e relações de `populated`, publicando
   somente a disponibilidade limitada aprovada. `empty` representa coleções e
   agregados vazios coerentes em todas as superfícies. Estados indisponíveis
   não inventam dados bem-sucedidos.
4. O gerador deve receber sempre caminhos explícitos. Defina `ORKESTRIA_APP_PATH` para o worktree autorizado de Application; o output pertence a esse repositório, nunca a uma pasta de produto criada no Planning:

   ```sh
   node .agents/skills/frontend-contract-fixtures/scripts/generate-global-fixtures.mjs \
     --source discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json \
     --runtime-output "$ORKESTRIA_APP_PATH/resources/js/data/modules/onedrive/fixtures/onedrive-tenant.generated.ts"
   ```

   O modo `--check` valida que a saída continua idêntica à base. O runtime da
   aplicação importa somente o arquivo TypeScript gerado e nunca lê o workspace
   ou executa este comando.
5. Execute também:

   ```sh
   node .agents/skills/frontend-contract-fixtures/scripts/validate-global-fixtures.mjs \
     discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json
   ```

## Limites

O gerador e a validação pertencem a esta skill; o arquivo TypeScript produzido
é um artefato de fixture, não lógica de produto. A skill não cria componentes,
integrações, payloads de provider, Simulator ou fallback de produção.
