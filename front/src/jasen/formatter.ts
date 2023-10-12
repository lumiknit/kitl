import { Value } from "./types";

const jsonStringify = JSON.stringify;

const guessIsJsonLong = (value: Value): boolean => {
	switch (typeof value) {
		case "string":
			return value.length > 20;
		case "object":
			if (value === null) return false;
			if (Array.isArray(value)) return value.length > 1;
			return Object.keys(value).length > 1;
	}
	return false;
};

export const compactify = (value: Value, indentLevel: number = 0): string => {
	if (typeof value !== "object" || value === null)
		return jsonStringify(value);
	const indent = " ".repeat(2 * (indentLevel + 1)),
		sep = ",\n" + indent;
	if (Array.isArray(value)) {
		const arr = value;
		if (arr.length === 0) return "[]";
		if (arr.length === 1) {
			return guessIsJsonLong(arr[0])
				? `[ ${compactify(arr[0], indentLevel + 1)} ]`
				: `[${compactify(arr[0], indentLevel + 1)}]`;
		}
		return `[ ${arr.map(x => compactify(x, indentLevel + 1)).join(sep)} ]`;
	}
	// Object
	const obj = value,
		keys = Object.keys(obj);
	if (keys.length === 0) return "{}";
	if (keys.length === 1) {
		const key = keys[0],
			keyStr = jsonStringify(key),
			value = obj[key];
		return guessIsJsonLong(value)
			? `{ ${keyStr}:\n  ${indent}${compactify(value, indentLevel + 2)}}`
			: `{${keyStr}: ${compactify(value, indentLevel + 1)}}`;
	}
	return `{ ${Object.entries(obj)
		.map(([key, val]) =>
			guessIsJsonLong(val)
				? `${jsonStringify(key)}:\n  ${indent}${compactify(
						val,
						indentLevel + 2,
				  )}`
				: `${jsonStringify(key)}: ${compactify(val, indentLevel + 1)}`,
		)
		.join(sep)} }`;
};
