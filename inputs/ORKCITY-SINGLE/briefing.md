Validar o fluxo completo da City para a atividade ORKCITY-SINGLE.

Produzir uma alteração pequena e verificável nos quatro repositórios. Em cada rig, criar o arquivo especificado nas tarefas com o conteúdo exato. Planning também produz requisitos, Clarify/Analyze, plano e evidências canônicas. Usar os mesmos quatro rigs e worktrees isoladas. Publicar branches candidatas e deixar os quatro PRs draft abertos. Nenhum merge, auto-merge ou push na base. Esta demanda altera apenas documentação, sem migrations ou chamadas Microsoft.

Tarefas e critérios fixados para este ensaio:

```json
[
  {
    "task_key": "validation-marker",
    "rig": "planning",
    "attempt": 1,
    "request": "Criar docs/city-validation/ORKCITY-SINGLE.txt com exatamente 'Flow City: ORKCITY-SINGLE\\nrig: planning\\n'. Não alterar código de produto.",
    "allowed_paths": [
      "docs/city-validation/ORKCITY-SINGLE.txt"
    ],
    "prerequisites": [],
    "acceptance": [
      {
        "id": "diff-check",
        "command": [
          "git",
          "diff",
          "--check"
        ],
        "cwd": ".",
        "profile": "none",
        "expected_exit": 0,
        "timeout_seconds": 60
      },
      {
        "id": "marker-content",
        "command": [
          "python3",
          "-c",
          "from pathlib import Path; p=Path('docs/city-validation/ORKCITY-SINGLE.txt'); assert p.is_file(); assert p.read_text()=='Flow City: ORKCITY-SINGLE\\nrig: planning\\n'"
        ],
        "cwd": ".",
        "profile": "none",
        "expected_exit": 0,
        "timeout_seconds": 60
      }
    ]
  },
  {
    "task_key": "validation-marker",
    "rig": "application",
    "attempt": 1,
    "request": "Criar docs/city-validation/ORKCITY-SINGLE.txt com exatamente 'Flow City: ORKCITY-SINGLE\\nrig: application\\n'. Não alterar código de produto.",
    "allowed_paths": [
      "docs/city-validation/ORKCITY-SINGLE.txt"
    ],
    "prerequisites": [],
    "acceptance": [
      {
        "id": "diff-check",
        "command": [
          "git",
          "diff",
          "--check"
        ],
        "cwd": ".",
        "profile": "none",
        "expected_exit": 0,
        "timeout_seconds": 60
      },
      {
        "id": "marker-content",
        "command": [
          "python3",
          "-c",
          "from pathlib import Path; p=Path('docs/city-validation/ORKCITY-SINGLE.txt'); assert p.is_file(); assert p.read_text()=='Flow City: ORKCITY-SINGLE\\nrig: application\\n'"
        ],
        "cwd": ".",
        "profile": "none",
        "expected_exit": 0,
        "timeout_seconds": 60
      }
    ]
  },
  {
    "task_key": "validation-marker",
    "rig": "design-system",
    "attempt": 1,
    "request": "Criar docs/city-validation/ORKCITY-SINGLE.txt com exatamente 'Flow City: ORKCITY-SINGLE\\nrig: design-system\\n'. Não alterar código de produto.",
    "allowed_paths": [
      "docs/city-validation/ORKCITY-SINGLE.txt"
    ],
    "prerequisites": [],
    "acceptance": [
      {
        "id": "diff-check",
        "command": [
          "git",
          "diff",
          "--check"
        ],
        "cwd": ".",
        "profile": "none",
        "expected_exit": 0,
        "timeout_seconds": 60
      },
      {
        "id": "marker-content",
        "command": [
          "python3",
          "-c",
          "from pathlib import Path; p=Path('docs/city-validation/ORKCITY-SINGLE.txt'); assert p.is_file(); assert p.read_text()=='Flow City: ORKCITY-SINGLE\\nrig: design-system\\n'"
        ],
        "cwd": ".",
        "profile": "none",
        "expected_exit": 0,
        "timeout_seconds": 60
      }
    ]
  },
  {
    "task_key": "validation-marker",
    "rig": "simulator",
    "attempt": 1,
    "request": "Criar docs/city-validation/ORKCITY-SINGLE.txt com exatamente 'Flow City: ORKCITY-SINGLE\\nrig: simulator\\n'. Não alterar código de produto.",
    "allowed_paths": [
      "docs/city-validation/ORKCITY-SINGLE.txt"
    ],
    "prerequisites": [],
    "acceptance": [
      {
        "id": "diff-check",
        "command": [
          "git",
          "diff",
          "--check"
        ],
        "cwd": ".",
        "profile": "none",
        "expected_exit": 0,
        "timeout_seconds": 60
      },
      {
        "id": "marker-content",
        "command": [
          "python3",
          "-c",
          "from pathlib import Path; p=Path('docs/city-validation/ORKCITY-SINGLE.txt'); assert p.is_file(); assert p.read_text()=='Flow City: ORKCITY-SINGLE\\nrig: simulator\\n'"
        ],
        "cwd": ".",
        "profile": "none",
        "expected_exit": 0,
        "timeout_seconds": 60
      }
    ]
  }
]
```
