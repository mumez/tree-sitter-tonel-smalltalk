# tree-sitter-tonel-smalltalk

A [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for [Tonel](https://github.com/pharo-vcs/tonel)-format Smalltalk `.st` files — Pharo's standard source export format.

## Features

- Parses class/trait/extension/package definitions (STON metadata)
- Parses Smalltalk method bodies (expressions, blocks, messages, pragmas, etc.)
- Syntax highlighting queries (`queries/highlights.scm`) for editors via LSP
- Designed as a lint/validation foundation for AI-assisted Smalltalk development

## Requirements

- Node.js + [pnpm](https://pnpm.io/)
- `tree-sitter-cli 0.26.8` (installed automatically via `pnpm install`)

## Setup

```bash
pnpm install
```

## Build

Generate the parser from `grammar.js`:

```bash
pnpm run generate
```

This writes the generated C parser into `src/`.

## Usage

Parse a specific `.st` file:

```bash
pnpm run parse path/to/SomeClass.st
```

Parse multiple files (e.g. a full Tonel package):

```bash
pnpm run parse src/MyPackage-Core/*.st
```

The output is a concrete syntax tree. Errors are reported inline as `(ERROR ...)` nodes.

## Testing

Run the corpus tests:

```bash
pnpm test
```

Test cases live in `test/corpus/` as plain-text files with input/expected-output pairs:

```
test/corpus/
  class_definitions.txt      # Class, Trait, Extension, Package definitions
  method_definitions.txt     # Method reference + body
  smalltalk_expressions.txt  # Literals, messages, blocks, etc.
```

## Grammar overview

A Tonel `.st` file has this structure:

```
"Optional class comment"
Class {
    #name : #ClassName,
    #superclass : #Object,
    ...
}

{ #category : 'accessing' }
ClassName >> someMethod [
    ^ self value
]
```

The grammar has three layers:

1. **Tonel file level** — `class_comment` + one `definition` + zero or more `method_definition`s
2. **STON metadata** — `ston_map` / `ston_pair` / `ston_value` for class metadata and per-method category
3. **Smalltalk method body** — expressions inside `[ ... ]` delimiters

### Definition types

| Keyword     | Node type              |
|-------------|------------------------|
| `Class`     | `class_definition`     |
| `Trait`     | `trait_definition`     |
| `Extension` | `extension_definition` |
| `Package`   | `package_definition`   |

## Syntax highlighting

The `queries/highlights.scm` file maps grammar nodes to standard highlight capture names and can be used with any tree-sitter-compatible editor (Neovim, Helix, Zed, etc.).

## License

MIT
