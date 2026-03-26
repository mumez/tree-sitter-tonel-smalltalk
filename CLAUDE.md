# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A tree-sitter grammar for Tonel-format Smalltalk `.st` files (Pharo's standard export format). Goals:
- Syntax highlighting via LSP for editors like VSCode
- Replace the Python-based `tonel-smalltalk-parser` as a lint/validation foundation for AI-assisted Smalltalk development

## Commands

```bash
pnpm install            # Install dependencies (tree-sitter-cli 0.20.8)
pnpm run generate       # Generate parser from grammar.js → src/ directory
pnpm test               # Run corpus tests (tree-sitter test)
pnpm run parse <file>   # Parse a specific .st file
```

> **Note:** `tree-sitter-cli 0.20.8` requires GLIBC 2.39+ (Ubuntu 24.04+). On Ubuntu 22.04 (GLIBC 2.35), `generate`/`test` will fail.

### Verify against real Tonel files

```bash
pnpm run parse ../tonel-smalltalk-parser/downloads/Stick/src/Stick-Core/*.st
```

## Grammar Architecture (`grammar.js`)

The grammar has three layers:

1. **Tonel file level** — `source_file` = optional `class_comment` + one `definition` + zero or more `method_definition`s
2. **STON metadata** — `ston_map` / `ston_pair` / `ston_value` used for class definitions and per-method category metadata
3. **Smalltalk method body** — standard Smalltalk expressions inside `[ ... ]` delimiters

### Key disambiguation points

- **`[]` ambiguity**: STON lists (`ston_list`) appear only inside class definition / method metadata STON maps. Smalltalk `block` appears inside method bodies. Context prevents collision.
- **`|` ambiguity**: `temporaries` (`| var1 var2 |`) vs binary `|` operator — resolved via `conflicts: [$.temporaries, $.primary]` and `prec.dynamic(10, ...)`.
- **`>>` separator**: `method_reference` uses `ClassName >> selector` (or `ClassName class >> selector` for class-side methods).

### Definition types

```
Class { ... }      → class_definition
Trait { ... }      → trait_definition
Extension { ... }  → extension_definition
Package { ... }    → package_definition
```

## Reference Files (sibling repos)

| Path | Purpose |
|------|---------|
| `../tree-sitter-smalltalk/grammar.js` | Base Smalltalk grammar rules |
| `../tonel-smalltalk-parser/doc/tonel-and-smalltalk-bnf.md` | BNF spec for Tonel format |
| `../tonel-smalltalk-parser/downloads/Stick/src/Stick-Core/*.st` | Real Tonel sample files for parse verification |

## Planned Artifacts (not yet created)

- `test/corpus/` — tree-sitter corpus test files (one per construct: class_definitions.txt, method_definitions.txt, etc.)
- `queries/highlights.scm` — syntax highlight queries for editors
- `src/` — generated parser C files (produced by `pnpm run generate`, do not edit manually)
