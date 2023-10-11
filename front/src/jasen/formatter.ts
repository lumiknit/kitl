import { Value } from "./types";

const guessIsJsonLong = (value: Value): boolean => {
	switch (typeof value) {
		case "string":
			return value.length > 20;
		case "object":
			if (value === null) {
				return false;
			} else if (Array.isArray(value)) {
				return value.length > 1;
			} else {
				return Object.keys(value).length > 1;
			}
	}
	return false;
};

export const compactify = (value: Value, indentLevel: number = 0): string => {
	switch (typeof value) {
		case "object": {
			if (value === null) {
				return "null";
			}
			const indent = " ".repeat(2 * (indentLevel + 1)),
				sep = ",\n" + indent;
			if (Array.isArray(value)) {
				const arr = value;
				if (arr.length === 0) {
					return "[]";
				} else if (arr.length === 1) {
					return guessIsJsonLong(arr[0])
						? `[ ${compactify(arr[0], indentLevel + 1)} ]`
						: `[${compactify(arr[0], indentLevel + 1)}]`;
				}
				let s = "[ ";
				for (let i = 0; i < arr.length; i++) {
					if (i > 0) {
						s += sep;
					}
					s += compactify(arr[i], indentLevel + 1);
				}
				return s + " ]";
			} else {
				const obj = value,
					keys = Object.keys(obj);
				if (keys.length === 0) {
					return "{}";
				} else if (keys.length === 1) {
					const key = keys[0],
						value = obj[key];
					return guessIsJsonLong(value)
						? `{ ${JSON.stringify(key)}:\n  ${indent}${compactify(
								value,
								indentLevel + 2,
						  )}}`
						: `{${JSON.stringify(key)}: ${compactify(
								value,
								indentLevel + 1,
						  )}}`;
				}
				let s = "{ ";
				const sepC = "\n  " + indent;
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i],
						value = obj[key];
					if (i > 0) {
						s += sep;
					}

					s += guessIsJsonLong(value)
						? `${JSON.stringify(key)}:${sepC}${compactify(
								value,
								indentLevel + 2,
						  )}`
						: `${JSON.stringify(key)}: ${compactify(
								value,
								indentLevel + 1,
						  )}`;
				}
				return s + " }";
			}
		}
		default:
			return JSON.stringify(value);
	}
};
