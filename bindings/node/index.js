let binding;
try {
  binding = require("../../build/Release/tree_sitter_tonel_smalltalk_binding");
} catch (_) {
  binding = require("../../build/Debug/tree_sitter_tonel_smalltalk_binding");
}

module.exports = {
  language: binding.language,
  nodeTypeInfo: require("../../src/node-types.json"),
};
