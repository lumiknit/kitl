# ki language spec

## Concept

- Simple
- Contain json format as a literal
- Slightly funcitonal

## Syntax

### Comment

After `;` is consiedered as a comment, as LISP.

`;;` is recommended rather than `;` for whole line comment.

### Expressions

Every valid JSON is a valid expression.

If a word does not contain some special character `#",;()[]{}@`, it is consiedered as an identifier. Note that id is case insensitive for ASCII range.

`(param, expr)` is a lambda expression. the param is only available in expr. Note that kitl-t uses static scopes.

`fn arg` is a function application. This is left associative. (e.g. `a b c` is equal to `(a b) c`)

`(, pattern, then-lam, else-lam)` for pattern merge. It takes two functions and return a function. If the argument if fit to the pattern, then, pass it to then-lam, otherwise pass it to else-lam

### Module

Every file is a module. And the file path is considered as a module name.

File contains function definitions. Function name should be given as a line beginning with `#`. For example,

```
;; test/main.ki
# my_func
(x, x)

# Y
(f, (x, f (x x))(x, f (x, x)))
```

To use other function or module, put `@<path>` after identifier.

```
;; test/sub.ki
# my_ident
(x, x)

# dummy_func_use_ident
(x, x) my_ident@. ; Use my_ident from current module

# Use_other_module
Y@./main (f, (x, f x))
```

Since every module is a single file, `.` is considered as current 'file', and `./...` is considered a file contained in current 'directory'. Only `.` is a special case, to avoid denote filename of itself.

If you don't want to load file from relative path, put `/`. Note that it does not find from real root directory, but search from KI_ROOT
