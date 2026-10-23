# Catálogo de Relatórios — Contratos

- `ReportTemplate` é catálogo global versionado; antes de qualquer solicitação, sua disponibilidade é calculada por tenant+conexão a partir dos requisitos declarados e das publicações/source states **atuais**, nunca de manifestos anteriores.
- Cada requisito de template/bloco é `required` ou `degradable`. Falta/restrição de `required` deixa o template indisponível e bloqueia gerar; `degradable` só pode aparecer como bloco `unavailable`/`restricted` em saída parcial se o template declarar essa permissão e o resultado for rotulado como parcial.
- Catálogo não cria, consulta nem reutiliza `ReportSourceManifest`: ele só informa a condição do preflight que uma nova solicitação deverá passar.

## Integração com o sync coordenado

- **Resultado: projeção local.** O catálogo não coleta Microsoft Graph; calcula requisito/estado do template a partir de fontes já publicadas na mesma conexão customer.
- Restrição em outro customer não é fallback nem disponibilidade transferível. O card mantém a razão sanitizada e a condição habilitadora local.
- O card e “Ver requisitos” não revelam PII, configuração de conexão ou detalhe além da projeção autorizada ao usuário.
