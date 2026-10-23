# APIs — Dashboard Executivo

O dashboard é uma projeção local das fontes validadas: registro MFA ([contrato](../cobertura-e-registro-de-mfa/api.md)), identidades publicadas, sign-ins ([contrato](../eventos-e-utilizacao/api.md)), auditoria e risco ([contrato](../usuarios-de-risco/api.md)). Não possui chamada Graph própria.

Registro MFA, sign-ins e auditoria estão tecnicamente disponíveis no tenant; risco está `restricted` por `403`. Scores, alertas, elegibilidade, exceções e tendências são dados/regras internas e não podem ser inferidos do Graph.
