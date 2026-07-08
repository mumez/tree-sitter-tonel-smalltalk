from unittest import TestCase

from tree_sitter import Parser
import tree_sitter_tonel_smalltalk


class TestLanguage(TestCase):
    def test_binding_language_returns_capsule(self):
        from tree_sitter_tonel_smalltalk import _binding

        capsule = _binding.language()
        self.assertEqual(type(capsule).__name__, "PyCapsule")

    def test_can_load_grammar(self):
        try:
            parser = Parser()
            parser.language = tree_sitter_tonel_smalltalk.language()
        except Exception:
            self.fail("Error loading TonelSmalltalk grammar")
