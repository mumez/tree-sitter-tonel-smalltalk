#include <napi.h>
#include "tree_sitter/parser.h"

extern "C" TSLanguage *tree_sitter_tonel_smalltalk();

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports["name"] = Napi::String::New(env, "tonel_smalltalk");
    exports["language"] = Napi::External<TSLanguage>::New(env, tree_sitter_tonel_smalltalk());
    return exports;
}

NODE_API_MODULE(tree_sitter_tonel_smalltalk_binding, Init)
