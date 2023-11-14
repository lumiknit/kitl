# kitl language spec

## Introduction

Kitl is a graphical programming language and environment for general purpose programming. The main goal is:

- Reduce language components to a minimum
  - so whoever use & understand it secondarily
- Almost purely functional
- Use JSON as literal
  - So each function can be used as REST API

## Basic concepts

### Components

- 'Name' is a kind of identifier.
- 'Definition' is a binding of a name to something:
  - 'Value': a value or a function
  - 'Tag': It is used to test type of value, or construct a value.
  - 'Alias': A name for another name.
- 'Module' is a collection of definitions.
  - Each file is a module.

### Values

- 'Value' can be a tagged data or function.
- Every value has a tag, a kind of name.
  - Tag is just a unique identifier. Internally it is an unsigned integer binded to a name.
- There are built-in tags, which is predefined and provided by the language. They are built-in and handled specially.
  - 'literal': A literal json values
    - 'null'
    - 'true'
    - 'false'
    - 'number': 64-bit floating point number
    - 'string': string
    - 'array': array of values
    - 'object': object of values
  - 'function': A function
- All other values are tagged data, which is a composition of single tag and one or more values (element).
  - When a tag is defined, a number of elements for the tag is defined and fixed.
  - When a tag is defined, a constructor, which takes prescribed number of values and returns a tagged data, will be defined.
- Every non-built-in value are create by its constructor, and every element can be obtained by destructing the value.
  - Note that built-in tags does not have constructor, and cannot be destructed.

### Functions

- 'Function' is a value which takes a value and returns a value.
- kitl's Function cannot takes multiple values.
- If a function taking multiple values is needed,
  - Make a function which takes a tagged data, and destruct it.
  - Or make curried function, which returns a function.
- Function can check literal value / tag of arguments and reject them.
  - Pattern matching.
  - Basically, a function application is rejected, program halts.
  - You can set a fallback function, which is called when a function application is rejected.
  - Kitl does not have any conditional branch of loop except it.
- Note that a function evaluation runs concurrently.
  - For example, for function call `f a`, evaluation of `a` and `f` runs concurrently, and 'f' is called after both are evaluated.
  - Thus, `f a b c d e`, each of 'a' ... 'f' are evaluated concurrently by induction.

### Tags, Types and Pattern matching

- 'Tag' is a kind of value, with fixed number which is used for a number of elements.
- 'Type' is a group of one of more tags.
  - Every tag is a type itself.
  - For example, literal tags are types already.
- There is built-in types:
  - 'bottom': empty type
  - 'top': any type
  - 'literal': literal tags
  - 'bool': 'true' or 'false'
- Each argument of a function or constructor can have a type signature.
  - If a type signature is not given, it is 'top'.

### Modules and Identifier

- 'Module' is a collection of definitions.
- Every name can be denoted as 'name@module'
  - name is an identifier
  - module is a path of module file.
- Module path can be absolute or relative.
  - If module name is empty or '.', it is considered as current module.
  - If module name is started with '/', it is absolute path.
  - Otherwise, it is relative path from PARENT module.
    - For example, from '/my-test/module', a module 'hello/world' denotes '/my-test/hello/world'.
    - It's because module is a file not a directory.
- The name of built-in module is '_'.
  - You cannot redefined '_' module.
- If filename of a module is '_', or '_.kitl', you can omit it.
  - For example, if there is '/hello/world/_.kitl', you can use 'hello/world' for the file.
- If a module is ommitted, precedence is:
  - If the name is defined in current module, use it.
  - If the name is in built-in, use it.
  - Otherwise, it is an error.
- If module name contains '.', string after dot are ignores.
  - For example, 'hello.world.boom' is same as 'hello'.
  - You can denote version after dot.
    - For example, 'hello.1.42.1'
- Module can be loaded from multiple places.
  - Basically, the current working directory is consiedered as root.
  - Additionally, from root, '_kitlmod' is searched. You may use it for global modules.

## Kitl Text Notation

This is a notation for kitl as common functional programming language.

```text
# <- a line comment

# Module consists of definitions.
# To define a value binding, use ':='

main := 42

# To define a tag, use '::='

None ::= _
Some ::= value
Nil ::= _
Cons ::= head, tail

# To define a type, use '::'

Maybe ::= None, Some
List ::= Nil, Cons

# If your name contains reserved characters, use backquote.

`:=` := "GOOD"

# Every JSON notation is a correct kitl literal.

my-num := 42
my-bool := true
my-string := "hello"
my-array := [1, 2, 3]
my-object := {"a": 1, "b": 2}

# Function can be defined with '\'.

identity := \x -> x

# Function can be applied by listing.

`42` := identity 42

# You can add restrict pattern with ?.

only-accept-true := \x? true -> x

# You can defined a function with fallback by \\.

is-true := (\x? false -> false) \\x? true -> true

# Example of pattern matching.

# len: List -> number

len := (
  \x? Nil -> 0
  \\c? Cons x (xs? List) -> + 1 (len xs)
)

# To reduce complexity, you can define temporary expression using '=' and ';'

job := \x? number -> \y? number -> (
  x-square = * x x;
  y-square = * y y;
  + x-square y-square
)

# Note that '=' is not a binding. It does not evaluate the expression and save the value. To do that, use let simulation.

lc-let := \x? number -> \y? number -> (
  (\x-square ->
    (\y-square ->
      + x-square y-square
    ) (* y y)
  ) (* x x)
)

# For module, use `@`.

side-effect-funciton := \msg? string ->
  log@_ msg

write-file :=
  \path? string ->
  \content? string ->
    write-file@/fs path content

```

## Kitl Graph JSON Notation

### Terms

- 'Graph' is a collection of nodes and edges.
- Each node has some source and sink handles.
  - Source handles provide values, and sink handles receive values.
  - Only source-to-sink is allowed.
  - Sink handle can be connected to at most one source handle.
    - Because it is used to calculate dependency.
- Each node has types:
  - alpha: a literal type.
    - It has a sink node which is used for pattern matching
    - Itself is source
  - beta: unnamed function application. Came from lambda calculus.
    - It only has sink nodes, which is a function and arguments.
  - lambda: function abstraction. Came from lambda calculus.
    - It has a sink fallback node which takes fallback function.
    - It has a source node for parameter and a sink node for return value.
  - nu: Name. Used to get named value or named function or application to named value.
    - It has name & module
    - It has multiple sink nodes for arguments.
  - pi: Pattern. Used to pattern match.
    - It has name & module.
    - It has multiple source nodes which denotes destructed values.

### Example

```json5
// Kitl JSON Notation is a subset of JSON.
// For comment, this block is written in JSON5
// But note that Kitl JSON is strict JSON.
{ // File is a single JSON.
  "#meta": {
    "kitl-version": "0.1"
  },
  "#def": {
    "fn": {
      "type": "alias",
      "name": "function@_"
    },
    "nil": {
      "type": "tag",
      "elem": []
    },
    "cons": {
      "type": "tag",
      "elem": [
        "value",
        ["rest", "list@_"]
      ]
    },
    "list": {
      "type": "type",
      "subs": [
        "nil",
        "cons"
      ]
    },
    "len": {
      "type": "val",
      "nodes": [
        { "type": "d", // Delta, definition
          "x": 0, "y": 0, // Position
          "val": 1 },
        { "type": "l", // Lambda
          "arg"
        }
      ]
    }
  }
}
```