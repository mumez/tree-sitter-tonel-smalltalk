// Binary operator characters (same as tree-sitter-smalltalk)
const binary_chars = "-+\\\\/*~<>=@,%|&?!";
const symbol_chars = `[A-Za-z0-9_:]+|[${binary_chars}]+`;
const identifier_regex = /[A-Za-z_][A-Za-z0-9_]*/;

module.exports = grammar({
  name: "tonel_smalltalk",

  supertypes: ($) => [$.expression, $.primary],

  conflicts: ($) => [
    // Pipe disambiguation: | used as temp delimiter vs binary operator
    [$.temporaries, $.primary],
    [$.temporaries, $.temporaries],
    // keyword_message parsing
    [$.keyword_message, $.keyword_message],
    // block/dynamic_array vs method_body dot repeat disambiguation
    [$.block],
    [$.dynamic_array],
    [$.method_body],
  ],

  inline: ($) => [$.keyword_part],

  extras: ($) => [$.comment, /[\s\f]/],

  rules: {
    // -------------------------------------------------------------------------
    // Tonel file level
    // -------------------------------------------------------------------------

    source_file: ($) =>
      seq(
        optional($.class_comment),
        $.definition,
        repeat($.method_definition)
      ),

    class_comment: ($) => token(seq('"', /[^"]*/, '"')),

    definition: ($) =>
      choice(
        $.class_definition,
        $.trait_definition,
        $.extension_definition,
        $.package_definition
      ),

    class_definition: ($) => seq("Class", $.ston_map),
    trait_definition: ($) => seq("Trait", $.ston_map),
    extension_definition: ($) => seq("Extension", $.ston_map),
    package_definition: ($) => seq("Package", $.ston_map),

    method_definition: ($) =>
      seq(
        optional($.method_metadata),
        $.method_reference,
        "[",
        optional($.method_body),
        "]"
      ),

    method_metadata: ($) => $.ston_map,

    method_reference: ($) =>
      seq(
        field("class_name", $.identifier),
        optional(field("class_side", "class")),
        ">>",
        field("selector", choice(
          $.unary_selector,
          seq($.binary_selector, field("param", $.identifier)),
          repeat1(seq($.keyword, field("param", $.identifier)))
        ))
      ),

    method_body: ($) =>
      choice(
        seq(
          repeat1(choice($.pragma, $.temporaries)),
          repeat("."),
          sep($.statement, repeat1(".")),
          repeat(".")
        ),
        seq(
          repeat(choice($.pragma, $.temporaries)),
          repeat("."),
          sep1($.statement, repeat1(".")),
          repeat(".")
        )
      ),

    // -------------------------------------------------------------------------
    // Selector types
    // -------------------------------------------------------------------------

    selector: ($) =>
      choice($.unary_selector, $.binary_selector, $.keyword_selector),

    unary_selector: ($) => alias($.identifier, $.unary_identifier),
    binary_selector: ($) => $.binary_operator,
    keyword_selector: ($) => repeat1($.keyword),

    // -------------------------------------------------------------------------
    // STON metadata
    // -------------------------------------------------------------------------

    ston_map: ($) =>
      seq(
        "{",
        optional(seq($.ston_pair, repeat(seq(",", $.ston_pair)))),
        "}"
      ),

    ston_pair: ($) => seq($.ston_key, ":", $.ston_value),

    ston_key: ($) => choice($.ston_symbol, $.string),

    ston_value: ($) =>
      choice(
        $.string,
        $.ston_symbol,
        $.number,
        $.ston_list,
        $.ston_map,
        $.nil,
        $.true,
        $.false
      ),

    ston_list: ($) =>
      seq(
        "[",
        optional(seq($.ston_value, repeat(seq(",", $.ston_value)))),
        "]"
      ),

    // STON symbol: #name or #'name with spaces'
    ston_symbol: ($) => token(seq("#", choice(identifier_regex, seq("'", /[^']*/, "'")))),

    // -------------------------------------------------------------------------
    // Smalltalk method body expressions
    // -------------------------------------------------------------------------

    temporaries: ($) => prec.dynamic(10, seq("|", repeat($.identifier), "|")),

    statement: ($) => choice($.return, $.expression),
    return: ($) => seq("^", $.expression),

    expression: ($) =>
      choice(
        $.assignment,
        $.cascade,
        $.keyword_message,
        $.binary_message,
        $.unary_message,
        $.primary
      ),

    assignment: ($) => prec.left(-5, seq($.identifier, ":=", $.expression)),

    unary_message: ($) =>
      prec(4, seq(field("receiver", $.expression), alias($.identifier, $.unary_identifier))),

    binary_message: ($) =>
      prec.left(3, seq(field("receiver", $.expression), $.binary_operator, $.expression)),

    keyword_message: ($) =>
      prec(-1, seq(field("receiver", $.expression), repeat1($.keyword_part))),

    keyword_part: ($) => seq($.keyword, $.expression),

    cascade: ($) =>
      prec(-2, seq(
        field("receiver", $.expression),
        repeat1(seq(";", $._cascaded_send))
      )),

    _cascaded_send: ($) =>
      choice(
        $.cascaded_unary_message,
        $.cascaded_binary_message,
        $.cascaded_keyword_message
      ),

    cascaded_unary_message: ($) => prec(-2, alias($.identifier, $.unary_identifier)),
    cascaded_binary_message: ($) => prec(-3, seq($.binary_operator, $.expression)),
    cascaded_keyword_message: ($) => prec(-4, repeat1($.keyword_part)),

    pragma: ($) =>
      seq("<", choice($.pragma_unary_selector, $.pragma_keyword_selector), ">"),

    pragma_unary_selector: ($) => alias($.identifier, $.unary_identifier),
    pragma_keyword_selector: ($) => repeat1(seq($.keyword, $.primary)),

    // -------------------------------------------------------------------------
    // Primary elements
    // -------------------------------------------------------------------------

    primary: ($) =>
      choice(
        $.identifier,
        $.number,
        $.string,
        $.symbol,
        $.character,
        $.literal_array,
        $.byte_array,
        $.dynamic_array,
        $.block,
        $.parenthesized_expression,
        $.true,
        $.false,
        $.nil,
        $.self,
        $.super,
        $.thisContext
      ),

    block: ($) =>
      seq(
        "[",
        optional(seq(repeat($.block_argument), "|")),
        optional($.temporaries),
        repeat("."),
        sep($.statement, repeat1(".")),
        repeat("."),
        "]"
      ),

    block_argument: ($) => /: *[A-Za-z_][A-Za-z0-9_]*/,

    parenthesized_expression: ($) => seq("(", $.expression, ")"),

    dynamic_array: ($) => seq("{", repeat("."), sep($.expression, repeat1(".")), repeat("."), "}"),

    byte_array: ($) => seq("#[", repeat($.number), "]"),

    literal_array: ($) => seq("#(", repeat($._literal_array_element), ")"),

    _literal_array_element: ($) =>
      choice(
        $.string,
        $.number,
        $.character,
        $.nil,
        $.true,
        $.false,
        $.symbol,
        alias(new RegExp(symbol_chars), $.symbol),
        alias($.binary_operator, $.symbol),
        alias(/\./, $.symbol),
        alias(";", $.symbol),
        alias(":=", $.symbol),
        alias("^", $.symbol),
        alias($.identifier, $.symbol),
        choice(alias($.nested_literal_array, $.literal_array), $.literal_array)
      ),

    nested_literal_array: ($) => seq("(", repeat($._literal_array_element), ")"),

    // -------------------------------------------------------------------------
    // Terminals
    // -------------------------------------------------------------------------

    number: ($) => /-?[0-9]+\.[0-9]+([eE][+-]?[0-9]+|s[0-9]*)?|-?([0-9]+r)?[0-9]+/,

    string: ($) => token(seq("'", /([^']|'')*/, "'")),

    symbol: ($) =>
      token(
        seq(
          "#",
          choice(new RegExp(symbol_chars), seq("'", /[^']*/, "'"))
        )
      ),

    character: ($) => /\$(\s|.)/,

    keyword: ($) => /[A-Za-z_][A-Za-z0-9_]*:/,

    identifier: ($) => identifier_regex,

    binary_operator: ($) => new RegExp(`[${binary_chars}]+`),

    true: ($) => "true",
    false: ($) => "false",
    nil: ($) => "nil",
    self: ($) => "self",
    super: ($) => "super",
    thisContext: ($) => "thisContext",

    comment: ($) => token(seq('"', /[^"]*/, '"')),
  },
});

function sep1(rule, char) {
  return seq(rule, repeat(seq(char, rule)));
}

function sep(rule, char) {
  return optional(sep1(rule, char));
}
