import { expect, test } from "vitest";
import { compactify } from "./formatter";

// Formatting tests

test(`format test 1`, () => {
	expect(compactify(null)).toEqual("null");
});

test(`format test 2`, () => {
	const compactified = compactify({
		a: 20,
		b: [1, 4, "hello"],
		test: { boom: true, "some long text": "Lorem ipsum bla bla haskellly" },
		singleton: [{ boom: true }],
	});
	const expected = `
{ "a": 20,
  "b":
    [ 1,
      4,
      "hello" ],
  "test":
    { "boom": true,
      "some long text":
        "Lorem ipsum bla bla haskellly" },
  "singleton": [{"boom": true}] }
		`.trim();
	expect(compactified).toEqual(expected);
});
