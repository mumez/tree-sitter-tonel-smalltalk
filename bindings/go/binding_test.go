package tree_sitter_tonel_smalltalk_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tonel_smalltalk "github.com/tree-sitter/tree-sitter-tonel-smalltalk/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tonel_smalltalk.Language())
	if language == nil {
		t.Errorf("Error loading TonelSmalltalk grammar")
	}
}
