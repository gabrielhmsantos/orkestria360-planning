# Decisões propostas — r1

Fonte e SHAs: `discovery/copiar-email-perfil/r1.md`. Decisões abaixo são escolhas de planejamento, não aprovação humana.

- D1 (R1, R5): preservar `Form` e o campo não controlado; ler o valor do elemento por referência no momento da ativação. Evita usar o e-mail persistido ou reestruturar o formulário.
- D2 (R2–R3): reutilizar `useClipboard` da Application e usar o booleano retornado por cada chamada, não `copiedText`; recusa e ausência resultam em falha. Verificar vazio antes de chamar. Feedback local visível e região `aria-live="polite"` com mensagem em português; sucesso sugerido “E-mail copiado.”. Não registrar conteúdo.
- D3 (R2): limpar feedback ao editar e iniciar nova tentativa, invalidar resultados de operações anteriores após edição ou tentativa mais recente; preservar foco. Uma operação já iniciada pode escrever o valor capturado no clique, mas sua conclusão obsoleta não deve anunciar estado atual.
- D4 (R4, R6): compor `Button` existente com `type="button"` e rótulo textual; ajustar disposição responsiva com tokens existentes. Não alterar primitivas compartilhadas; a contraparte Design System foi examinada e não requer mudança para esta composição. Se implementação demonstrar alteração compartilhada necessária, reavaliar e alinhar no repositório proprietário antes da entrega.
- D5 (R7): regressão de navegador é necessária: testes PHP existentes não verificam clipboard nem acessibilidade. Se infraestrutura de componente não estiver disponível, seguir `docs/agents/TESTING.md` e produzir cenário reproduzível Playwright, registrando limitações; não alegar cobertura funcional por typecheck.
