# jasen

jasen is a superset of json, which allow some common mistkaes.

## Example

Note: jasen not allow comments. The below comments start with `//` are for explanation only.

```
{
	"a": 1,,, // Allow multiple commas
	't': 'hello', // Allow single quotes
	b: 3, // Allow no quotes for keys
	hello world!: 20, // When parsing key, the trimmed string until `:` or `}` is used as a key
	test-word: hello, // If value is not quoted, the trimmed string until `,` or `}` or newline is used as a value
	no-comma: 1 // Allow no comma at the end of a key-value pair
	mult1: 42 mult2: 55 // If value is finished early, the next key-value pair starts even if there is no comma
	arr: [
		42,, // Allow multiple commas in array
		'hello' // Allow no commas
		3 // Allow no comma at the end of array
	]
	// If closing bracket is missing, the parser will add it automatically
```
