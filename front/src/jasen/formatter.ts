import { Value } from "./types";

const guessIsJsonLong = (value: Value): boolean => {
	switch (typeof value) {
		case "boolean":
		case "number":
			return false;
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
};

export const compactify = (value: Value, indentLevel: number = 0): string => {
	switch (typeof value) {
		case "boolean":
		case "number":
		case "string":
			return JSON.stringify(value);
		case "object":
			if (value === null) {
				return "null";
			} else if (Array.isArray(value)) {
				const arr = value;
				if (arr.length === 0) {
					return "[]";
				} else if (arr.length === 1) {
					return `[${compactify(arr[0], indentLevel + 1)}]`;
				}
				let s = "[ ";
				const sep = ",\n" + " ".repeat(2 * (indentLevel + 1));
				for (let i = 0; i < arr.length; i++) {
					if (i > 0) {
						s += sep;
					}
					s += compactify(arr[i], indentLevel + 1);
				}
				s += " ]";
				return s;
			} else {
				const obj = value;
				const keys = Object.keys(obj);
				if (keys.length === 0) {
					return "{}";
				} else if (keys.length === 1) {
					return `{${JSON.stringify(keys[0])}: ${compactify(
						obj[keys[0]],
						indentLevel + 1,
					)}}`;
				}
				let s = "{ ";
				const sep = ",\n" + " ".repeat(2 * (indentLevel + 1));
				const sepC = "\n" + " ".repeat(2 * (indentLevel + 2));
				for (let i = 0; i < keys.length; i++) {
					if (i > 0) {
						s += sep;
					}

					if (guessIsJsonLong(obj[keys[i]])) {
						s += `${JSON.stringify(keys[i])}:${sepC}${compactify(
							obj[keys[i]],
							indentLevel + 2,
						)}`;
					} else {
						s += `${JSON.stringify(keys[i])}: ${compactify(
							obj[keys[i]],
							indentLevel + 1,
						)}`;
					}
				}
				s += " }";
				return s;
			}
	}
};
