# kitl-in-text language spec

kitl-in-text (kitxt) is a programming language to be used for kitl. Note that kitl is a visual programming language, kitl-in-text is used as an intermediate language for execution.

## Objective

- Simple
- Slightly functional
- Contain json format as a literal
- Easy to visualize as flow chart

## (Draft) Syntax and Semantics

### Comment

kitxt's line comments start with `;`, as LISP.

### Expressions

#### Literal

Every valid JOSN is a valid expression. For example,

```
;; null
null
;; boolean
true
false
;; number
42
13.5
;; string
"Hello"
"Boom"
;; array
[1, 2, 3]
;; object
{"bomm": "asd", "qwe": 20}
```

#### Identifier

Every word NOT containing some special characters `@#$()[]{},;\` is considered as identifier.
For example, the belows are valid identifiers:

- `test`
- `hello-world!`
- `<+>`
- `x_print_20`
- `한글이라든가_漢字とか`

Note that for easy editing in mobile environment with kitl UI,

- Case insensitive for ASCII range. For example, `HelloWorld` and `heLLoworld` are same identifier.
- Whitespaces and underscore are equal to `_`. For example, `Hello World!`, `Hello  \t world!` and `Hello___world!` are considered as same identifier.

Therefore, kitxt normalizes every identifiers by downcasing and replace whitespaces & undersocre into a single underscore.

#### Module Identifier

Sometimes you need to point some identifier in specific modules. In this case, use module identifier with `@`.

```
<id>@<module>
```

For example, `add@./main` means `add` identifier in current directory's `main` module.

#### Function Application

As lambda calculus, ML and its dialects, a list of expressions separated by whitespaces are treated as function application.
For example,

```
f a b
```

means we apply `a` to `f`, then apply `b` to the return of `f a`.
Note that function app is left associative.

#### Abstraction (Function)

Functions can be written as the below form:

```
\ <PARAM> , <BODY-EXPRESSION>
```

Note that `\` is used as `λ`, and `,` is used as `.` in lambda calculus. For example, `\x,x` is equal to `λx.x` in lambda expression.

#### Tagged Data and Function

To create new tag function, use

```
\(<VALUES>)
```

For example,

```
\() ; empty values
\(number, number) ; 2d vector
```

The above expression gives a function, which type is

```
a1 => a2 => ... => a_n => Tagged
; for \(a1, a2, ..., a_n)
```

And the tagged variable can be destructed with function defined as:

```
\ <param> <Tag> <elem1> <elem2> ... <elem_n> , <BODY>
```

For example, the below program show how the vector 2d is created and destructed:

```
#= Vec2D ; Definition
\(number@-, number@-) ; Use builtin numbers

#= norm ; function
\v Vec2D x y, ; Take a argument v, which is tagged as Vec2D with x, y
  sqrt@-/math (+ (* x x) (* y y))

#= example
print (norm (Vec2D 3.5 4.2))

```

If tag is declared for function paramter, the tag of arguments are checked for every application, and reject if tag is not matched.
Instead of that, we can add fallback function for function definition as the below syntax:

```
<fallback-function> \\ <PARAM> , <BODY>
```

For example,

```
#= identity
\x,x

#= length
identity \\x String raw, length@-/string raw
```

Above `length` function will call `length@-/string` if the argument is string, and otherwise call `identity` as a fallback.

### Module

Every file is a module. And the file path is considered as a module name.

File contains function definitions. Function name should be given as a line beginning with `#=`. For example,

```
;; test/main.kitxt
#= my_func
\x,x

#= Y
\f,(\x,f (x x))(\x,f (x x))
```

To use other function or module, put `@<path>` after identifier.

```
;; test/sub.kitxt
#= my_ident
\x,x

#= dummy_func_use_ident
(\x,x) my_ident@. ; Use my_ident from current module

#= Use_other_module
Y@./main (\f, (\x, f x))
```

Since every module is a single file, `.` is considered as current 'file', and `./...` is considered a file contained in current 'directory'. Only `.` is a special case, to avoid denote filename of itself.

If you don't want to load file from relative path, put `/`. Note that it does not find from real root directory, but search from KI_ROOT

Also, `-` is used for built-in module. Some of this module is magic function, which cannot be implemented with above expressions.