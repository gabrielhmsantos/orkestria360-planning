#!/usr/bin/env python3
"""Read-only checks for the Planning repository; never boot products or services."""

import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]


def relative_links(path):
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"^```.*?^```[^\n]*$", "", text, flags=re.M | re.S)
    for match in re.finditer(r"(?<!!)\[[^\]\n]+\]\((<[^>]+>|[^\s)]+)(?:\s+\"[^\"]*\")?\)", text):
        value = match.group(1).strip("<>")
        url = urlsplit(value)
        if not url.scheme and not url.netloc and url.path and not url.path.startswith("/"):
            target = (path.parent / unquote(url.path)).resolve()
            if not target.exists():
                yield value


def run():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--paths", action="store_true", help="also check explicitly configured product worktrees")
    args = parser.parse_args()
    errors = []
    required = ["README.md", "AGENTS.md", "workspace.json", "workspace.local.example.json",
                "docs/PRINCIPIOS.md", "docs/PRODUTO.md", "docs/REPOSITORIOS.md",
                "docs/FLUXO.md", "docs/SKILLS.md", "docs/solutions/INDEX.md",
                "inputs/README.md", "discovery/README.md", "specs/README.md", "deliveries/README.md",
                "templates/README.md", "templates/manifest.example.json"]
    for name in required:
        if not (ROOT / name).is_file():
            errors.append(f"Missing required file: {name}")
    if errors:
        return report(errors)

    for name in [".gitmodules", ".specify", ".codex/agents", "orkestria360", "orkestria360-design-system", "orkestria360-m365-simulator"]:
        if (ROOT / name).exists():
            errors.append(f"Unexpected nested product, submodule or legacy bootstrap: {name}")

    files = []
    for directory, dirs, names in os.walk(ROOT, followlinks=False):
        dirs[:] = [name for name in dirs if name not in {".git", "__pycache__", ".cache"}]
        for name in dirs + names:
            path = Path(directory) / name
            if path.is_symlink():
                errors.append(f"Symlink is not allowed: {path.relative_to(ROOT)}")
        files.extend(Path(directory) / name for name in names)
    for path in files:
        rel = str(path.relative_to(ROOT))
        if path.name in {".env", ".env.testing", "LOCAL_TEST_CREDENTIALS.md"} or path.suffix in {".dump", ".sql"}:
            errors.append(f"Private environment artifact in Planning: {rel}")
    for path in ROOT.glob(".agents/skills/*/SKILL.md"):
        content = path.read_text()
        match = re.match(r"^---\n(.*?)\n---\n", content, flags=re.S)
        if not match or not re.search(r"^name:\s*" + re.escape(path.parent.name) + r"\s*$", match.group(1), re.M) or "description:" not in match.group(1):
            errors.append(f"Invalid skill frontmatter: {path.relative_to(ROOT)}")
    skills = ["make-discovery", "validate-graph", "frontend-contract-fixtures", "analyze-code-review", "ui-blueprint", "m365-simulator-contracts"]
    for name in skills:
        if not (ROOT / ".agents/skills" / name / "SKILL.md").is_file():
            errors.append(f"Missing local skill: {name}")

    try:
        workspace = json.loads((ROOT / "workspace.json").read_text())
        example = json.loads((ROOT / "templates/manifest.example.json").read_text())
        json.loads((ROOT / "workspace.local.example.json").read_text())
    except (OSError, ValueError) as error:
        return report(errors + [f"Invalid workspace JSON: {error}"])
    expected_policy = {"policy": "pull-request-only", "final_state": "published-prs", "agent_merge": False, "auto_merge": False, "direct_base_push": False}
    if workspace.get("publication") != expected_policy:
        errors.append("workspace.json publication policy differs from the approved PR-only policy")
    if set(workspace.get("repositories", {})) != {"planning", "application", "design-system", "simulator"}:
        errors.append("workspace.json must identify the four independent repositories")
    if example.get("phase") != "intake" or example.get("status") != "registered" or example.get("planning", {}).get("approved_commit") is not None:
        errors.append("The documentary manifest example must remain an unapproved intake")

    documents = [path for path in files if path.suffix == ".md"]
    output_templates = []
    for path in documents:
        relative = path.relative_to(ROOT)
        # Skill output templates refer to files in the generated artifact, not in
        # their own resource directory. Their literal links are not ready documents.
        if relative.parts[:2] == (".agents", "skills") and any(part in {"assets", "templates"} for part in relative.parts[3:-1]):
            output_templates.append(path)
            continue
        for link in relative_links(path):
            errors.append(f"Broken local link in {relative}: {link}")

    if (ROOT / ".git").exists():
        result = subprocess.run(["git", "ls-files", "--stage"], cwd=ROOT, text=True, capture_output=True, check=False)
        if result.returncode:
            errors.append("Unable to inspect the Git index")
        elif any(line.startswith("160000 ") for line in result.stdout.splitlines()):
            errors.append("The Git index contains submodule gitlinks")
    if args.paths:
        check_paths(workspace, errors)
    return report(errors, files=len(files), local_skills=len(skills), documents=len(documents), output_templates=len(output_templates))


def check_paths(workspace, errors):
    config_path = ROOT / "workspace.local.json"
    try:
        config = json.loads(config_path.read_text()) if config_path.exists() else {}
        if not isinstance(config, dict):
            raise ValueError("expected an object")
    except (OSError, ValueError) as error:
        errors.append(f"Invalid workspace.local.json: {error}")
        return
    sentinels = {"application": "artisan", "design-system": ".storybook", "simulator": "contracts/inventory/operations.json"}
    seen = set()
    for name, sentinel in sentinels.items():
        repo = workspace["repositories"][name]
        value = os.environ.get(repo["path_variable"]) or config.get(name)
        if not isinstance(value, str) or not Path(value).is_absolute():
            errors.append(f"Set an absolute path for {name} in {repo['path_variable']} or workspace.local.json")
            continue
        path = Path(value).resolve()
        if path in seen or path == ROOT:
            errors.append(f"The worktree for {name} must be distinct")
        seen.add(path)
        if not (path / sentinel).exists():
            errors.append(f"The selected worktree for {name} is missing {sentinel}")
            continue
        git = subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=path, capture_output=True, text=True, check=False)
        if git.returncode or Path(git.stdout.strip()).resolve() != path:
            errors.append(f"The selected path for {name} must be the root of its own Git worktree")
            continue
        remote = subprocess.run(["git", "remote", "get-url", "origin"], cwd=path, capture_output=True, text=True, check=False)
        normalize = lambda url: url.strip().removesuffix(".git").replace("git@github.com:", "https://github.com/").lower()
        if remote.returncode or normalize(remote.stdout) != normalize(repo["url"]):
            errors.append(f"The origin repository does not match the expected owner for {name}")


def report(errors, **counts):
    print(json.dumps({"ok": not errors, **counts, "errors": errors}, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(run())
