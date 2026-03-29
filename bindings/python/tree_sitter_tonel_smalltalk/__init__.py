"""Tree-sitter grammar for Tonel-exported Smalltalk source files."""

from tree_sitter import Language


def language() -> Language:
    """Get the tree-sitter Language for Tonel Smalltalk."""
    from . import _binding

    return Language(_binding.language())


__all__ = ["language"]
