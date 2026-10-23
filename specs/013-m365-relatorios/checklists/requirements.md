# Specification Quality Checklist: Relatórios Microsoft 365 V1

**Purpose**: Validate specification completeness and quality before planning
**Created**: 2026-09-02
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details beyond approved physical contracts requested by the feature
- [x] Focused on user value and business needs
- [x] Written for stakeholders with testable constraints
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable and technology-agnostic
- [x] Acceptance scenarios and edge cases are defined
- [x] Scope, dependencies and assumptions are bounded

## Feature Readiness

- [x] Functional requirements map to user scenarios and data invariants
- [x] All eight surfaces have independently testable coverage
- [x] Closed discovery decisions are preserved
- [x] CSV e XLSX são serializers da mesma projeção congelada; XLSX tem dependência,
      bytes/hash e política de temporário efêmero definidos
- [x] Todos os modos de sync têm semântica de publicação de Licenciamento definida,
      inclusive `recollect_date` e `recollect_today`
- [x] Toda persistência tenant-scoped possui retention/purge por janela e `all`,
      com pruners centralizados, ordem de FK e testes planejados
- [x] Cutoffs canônicos estão definidos: `published_at` imutável por geração de
      Licenciamento e `completed_at` de requests terminais de Relatórios
- [x] Fonte é validada somente no aceite; manifesto congelado sustenta prévia,
      CSV/XLSX e histórico mesmo após prune da publicação original

## Notes

O contrato físico da publicação histórica de população licenciada, o catálogo V1,
os serializers CSV/XLSX efêmeros e as proibições de persistência de arquivo estão
definidos nos artefatos desta Spec; não há decisão de domínio pendente.
