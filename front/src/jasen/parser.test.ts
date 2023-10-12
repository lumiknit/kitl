import { expect, test } from "vitest";
import { taste, parse } from "./parser";

// Taste tests

const tastePairs: [string, string, boolean][] = [
	["null", "null", false],
	["true", "true", false],
	["false", "false", false],
	["num1", "123", true],
	["num2", "+123", true],
	["num3", "-.1", true],
	["str1", '"hello"', true],
	["str2", "'hello\\\nw\\borl\\x0035d'", true],
	["arr1", "[1,2,3]", true],
	["arr2", "\t[null, true, 4 5,,'hello", true],
	["obj1", `{"a":1, "b":2}`, true],
	["obj2", `  {,, "a":1,, "b":2, c: null}`, true],
];

for (const [name, input, output] of tastePairs) {
	test(`taste test ${name}`, () => {
		expect(taste(input)).toEqual(output);
	});
}

// Parse tests

const successPairs: [string, string, any][] = [
	["null1", "null", null],
	["null2", "  nULl ", null],
	["true1", "  true", true],
	["true2", " \tTRuE  ", true],
	["false1", "false", false],
	["false2", "  fAlSe", false],
	["num1", "123", 123],
	["num2", " \t-42.15  ", -42.15],
	["num3", "0.1e-2", 0.1e-2],
	["num4", "0x412", 0x412],
	["str1", '"hello"', "hello"],
	["str2", "'hello\\\nw\\borl\\x0035d'", "hello\nw\borl\x0035d"],
	["arr1", "[1,2,3]", [1, 2, 3]],
	["arr2", "\t[null, true, 4 5,,'hello", [null, true, 4, 5, "hello"]],
	[
		"arr3",
		"  [ [1,2,3], \t[4,5,6]\n]  ",
		[
			[1, 2, 3],
			[4, 5, 6],
		],
	],
	["obj1", `{"a":1, "b":2}`, { a: 1, b: 2 }],
	["obj2", `  {,, "a":1,, "b":2, c: null}`, { a: 1, b: 2, c: null }],
	[
		"obj3",
		`{"a":1, "b":2, "c": {"d":3, "e":4}}`,
		{ a: 1, b: 2, c: { d: 3, e: 4 } },
	],
	[
		"complex1",
		`{
			"null": null,
			"true": true,
			"false": false,
			"num": 123,
			"str": "hello",
			"arr": [1,2,3],
			"obj": {"a":1, "b":2}
		}`,
		{
			null: null,
			true: true,
			false: false,
			num: 123,
			str: "hello",
			arr: [1, 2, 3],
			obj: { a: 1, b: 2 },
		},
	],
	[
		"complex2",
		`{
			name: john,
			age: 42 month: 3 day: null
			items:[ potion, sword, shield, "gold coin" ]
			'skills': [,, , { name: "sword", level: 5 }
		 { name: "shield"'level'  :: 3
		`,
		{
			name: "john",
			age: 42,
			month: 3,
			day: null,
			items: ["potion", "sword", "shield", "gold coin"],
			skills: [
				{ name: "sword", level: 5 },
				{ name: "shield", level: 3 },
			],
		},
	],
];

for (const [name, input, output] of successPairs) {
	test(`parse test ${name}`, () => {
		expect(parse(input)).toEqual(output);
	});
}

// Fail tests
const failPairs: [string, string][] = [
	["null1", "nul"],
	["null2", "nulll"],
	["true1", "tru"],
	["unk1", "a"],
	["unk2", "1-3"],
	["num1", "0x"],
	["num2", "0xg"],
	["num3", "0x1.2"],
	["num4", "0x1p"],
	["num5", "0x1p-"],
	["num6", "0x1p-1.2"],
	["num7", "++3"],
	["num8", "3e"],
	["num9", "3e-"],
	["num10", "0qz"],
	["arr1", "[a:1]"],
	["comment1", "// hello\n{}"],
	["comment2", "/* hello */{}"],
];

for (const [name, input] of failPairs) {
	test(`parse fail test ${name}`, () => {
		expect(() => parse(input)).toThrow();
	});
}
