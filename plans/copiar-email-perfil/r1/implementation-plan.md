# Plano de implementação — copiar e-mail no perfil — r1

Estado: proposta; não autoriza pressupor aprovação. Entrada: `requirements.md`, `decisions.md`, `analysis.md` desta revisão e `discovery/copiar-email-perfil/r1.md`. Planning e entrada `1f36b34e7a0fc9f2b0d0308ef0e694e1920216d5`; Application `3ed550be9822b000082f2422aa21f5a3df66d465`; Design System `314627a38ae356f9296bdc8600cb444a1de666a0`. Confirmar SHAs e reler instruções antes de implementação; reconciliar diferenças por evidência.

## Responsabilidades e dependências

| Repositório | Trabalho futuro | Dependência e gate |
| --- | --- | --- |
| Planning | Revisão e rastreabilidade dos cinco documentos e manifesto | Revisão independente e publicação pendentes |
| Application | Compor ação local no perfil, testes e evidências | R1–R7, primitivas/hook existentes, gates abaixo |
| Design System | Referência de Button/hook; nenhuma alteração prevista | Reavaliar alinhamento se componente compartilhado mudar |

## Tarefas sequenciais

1. Confirmar revisão da proposta e baseline efetivo, ler `AGENTS.md`, `docs/agents/FRONTEND.md`, `TESTING.md` e baseline visual na Application. Verificar infraestrutura real para testes de interface (R6–R7).
2. Implementar referência ao input existente e botão não submit associado ao campo; consumir valor atual sem mudar `Form`, validação, processamento ou exclusão (R1, R4–R6; D1, D4).
3. Adicionar estado local de feedback; tratar vazio, resultado booleano e indisponibilidade/rejeição, sequenciar tentativas e invalidar resultados ao editar; anúncio acessível e sem expor o valor (R2–R3; D2–D3).
4. Criar regressão observável pela interface usando infraestrutura existente se aplicável; caso contrário cenário reproduzível Playwright conforme instruções de teste. Simular clipboard resolvido, rejeitado e ausente, verificar argumento exato editado, vazio sem escrita, múltiplas tentativas fora de ordem e edição durante espera, e ausência de submit/requisição; conferir mensagem e foco (R1–R5, R7).
5. Testar manualmente/navegador com teclado e ponteiro, leitor de tela quando disponível, viewport estreita e larga, temas claro/escuro; salvar alteração e verificar erros/processing, exclusão com senha correta e incorreta em ambiente isolado (R4–R7). Registrar ambiente e limitações, sem dados reais.
6. Executar `npm run types:check`, `npm run lint:check`, `npm run build`, `npm run format:check` e teste de perfil focado com ambiente de teste explícito conforme `docs/agents/TESTING.md`; depois `composer ci:check`. Testes PHP somente em PostgreSQL `orkestria360_test`, credenciais e isolamento conforme instruções locais; nunca usar banco humano. Registrar saída, SHA, falhas e correções; build/checks não comprovam interação (R7).
7. Revisores independentes avaliam solução mínima, integridade do formulário, acessibilidade e consistência. Conferir diff completo e gates; candidatos e PRs draft nos repositórios que efetivamente mudarem, com head/base/SHA e auto-merge desligado; nenhum merge por agente. Esta fase de planejamento não publica nem implementa.

Ambiente de UI autenticada depende do snapshot isolado `orkestria360`, configuração privada e porta exclusiva; suíte usa `orkestria360_test`. Não executar migrations ou testes contra banco humano. Limitações de navegador, leitor de tela ou infraestrutura são pendências, não aprovação implícita.
