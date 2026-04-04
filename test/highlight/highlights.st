"Class definition keyword"
Class { #name : #Counter }
"^ @keyword"

"Class name in method reference"
Counter >> value [
"^ @type"
"       ^ @operator"
"          ^ @function.method"
    ^ self value
"   ^ @operator"
"     ^ @variable.builtin"
]

"Class-side method"
Counter class >> new [
"        ^ @keyword"
    ^ super new
"   ^ @operator"
"      ^ @variable.builtin"
]

"Method with temporaries"
Counter >> init [
    | count |
"   ^ @punctuation.delimiter"
    count := 0.
"         ^ @operator"
"             ^ @punctuation.delimiter"
    ^ count
]

"Block brackets are @punctuation.special"
Counter >> run [
    [ 1 + 1 ] value
"   ^ @punctuation.special"
"           ^ @punctuation.special"
]

"Literals"
Counter >> literals [
    ^ 'hello'
"     ^ @string"
]

"Comment"
Counter >> commented [
    "this is a comment"
"   ^ @comment"
]
