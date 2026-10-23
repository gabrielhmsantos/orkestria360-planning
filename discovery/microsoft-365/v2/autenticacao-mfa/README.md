# Discovery — Microsoft 365 / Autenticação (MFA)

## Objetivo

Dar ao administrador uma leitura confiável da maturidade de autenticação do tenant: cobertura, métodos, uso, falhas, proteção, risco e histórico, sem alterar configurações ou identidades nesta versão.

## Escopo e superfícies

1. Dashboard Executivo — consolidação de saúde, cobertura, uso e alertas.
2. Cobertura e Registro de MFA — preparação de cada identidade elegível.
3. Métodos de Autenticação — adoção, segurança e uso dos métodos.
4. Eventos e Utilização — autenticações, contexto e sucesso.
5. Falhas e Bloqueios — investigação de falhas, recorrência e sinais suspeitos.
6. Políticas e Proteção — métodos, forças, Acesso Condicional, defaults e exceções.
7. Usuários de Risco — riscos de identidade relacionados à autenticação.
8. Histórico e Auditoria — mudanças de autenticação, políticas e ações internas.

## Limites da versão

- O recorte é somente leitura. Alterar/remover métodos, revogar sessões, redefinir senha, gerar TAP, bloquear conta ou mudar políticas permanece `coming_soon`, condicionado a escopo operacional, confirmação e auditoria.
- Os exemplos numéricos, identidades, IPs, aplicações e datas das imagens são ilustrativos e não constituem dados a reproduzir.
- Elegibilidade, exceções, departamentos, score normativo e retenção exigem regras aprovadas e/ou dados internos; não podem ser inferidos como completos.

## Princípios e dependências

- A fonte primária é Microsoft Graph, com estado, cobertura, atualização e restrição declarados por bloco; ausência não é zero.
- `userRegistrationDetails` é a fonte de leitura em massa para registro MFA; `/users` complementa estado e atributos de diretório; consulta individual de métodos é investigativa, não varredura.
- Sign-ins, políticas, risco e auditoria dependem de permissões, licenças e retenção de Microsoft Entra específicas. Dados internos são necessários para exceções, alertas, snapshots e auditoria do Orkestria.
- Identidades, IPs e detalhes de autenticação são dados sensíveis: o discovery evita reproduzir amostras pessoais das referências.

## Decisões transversais

- As oito abas mantêm a ordem e os rótulos observados no DOCX e nas telas do sponsor.
- MFA registrado, capaz, exigido por política e efetivamente usado são conceitos distintos e devem permanecer separados na interface.
- Scores e alertas são orientações de investigação; não representam alteração executada nem devem ocultar suas condições normativas.

## Models

Há necessidade de persistência para fotografia atual, snapshots de cobertura, políticas, eventos, riscos, exceções, alertas e auditoria interna. Consulte [models/modelo-conceitual.md](models/modelo-conceitual.md).

## Estado

Discovery pronto para futura formalização, com superfícies e fontes confirmadas. A futura Spec deve aprovar o catálogo normativo de elegibilidade/score/alertas, permissões consentidas, frequência de coleta, retenção/LGPD, estados de fonte e os workflows transacionais.
