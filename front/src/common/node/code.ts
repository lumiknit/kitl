import * as jasen from "@/jasen";
import { NodeData, NodeType } from "./base";

// Node editing helpers

// Detector

export enum CodeType {
	Empty,
	Literal,
	Beta,
	Lambda,
}

const lambdaStarts = new Set(["\\", "λ"]);
const jsonStarts = new Set([
	'"',
	"{",
	"[",
	"'",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"0",
]);
export const detectCodeType = (s: string): CodeType => {
	let p = 0;
	// Skip whitespace
	while (p < s.length && s.charCodeAt(p) <= 32) p++;
	// Extract the first character
	const first = s[p];
	if (first === undefined) return CodeType.Empty;
	if (lambdaStarts.has(first)) return CodeType.Lambda;
	if (jsonStarts.has(first)) return CodeType.Literal;
	// Otherwise, try to parse as json
	try {
		jasen.parse(s);
		return CodeType.Literal;
	} catch (e) {
		// Ignore
	}
	return CodeType.Beta;
};

// Parser

export const stringifyNodeData = (x: NodeData): string => {
	switch (x.type) {
		case NodeType.Alpha:
			return JSON.stringify(x.val, null, 2);
		case NodeType.Beta:
			return `,${x.args.length}`;
		case NodeType.Delta:
			return `${x.comment}`;
		case NodeType.Lambda:
			return `λ`;
		case NodeType.Nu: {
			const name = x.name;
			const ns = name.module ? `@${name.module}` : "";
			const lhs = x.lhs;
			let rhs = x.args.length - lhs;
			if (rhs < 0) rhs = 0;
			return `${name.name}${ns},${lhs},${rhs}`;
		}
		case NodeType.Pi: {
			const name = x.name;
			const args = x.elems;
			return `λ ${name.name}@${name.module},${args}`;
		}
	}
};

export const parseNodeData = (s: string): NodeData => {
	const trimmed = s.trim();
	// Try to parse as JSON
	try {
		return {
			type: NodeType.Alpha,
			val: jasen.parse(trimmed),
		};
	} catch (e) {
		// Ignore
	}
	// Check the first character
	const first = trimmed[0];
	switch (first) {
		case "λ":
		case "\\": {
			// Lambda or Pi node
			const splitted = trimmed.slice(1).split(","),
				names = splitted[0].split("@");
			if (names[0]) {
				const name = names[0] ? names[0].toString().trim() : "",
					module = names[1] ? names[1].toString().trim() : "";
				let elems = parseInt(splitted[1]);
				if (isNaN(elems)) elems = 0;
				return {
					type: NodeType.Pi,
					name: { name, module },
					elems,
				};
			} else {
				return {
					type: NodeType.Lambda,
				};
			}
		}
		default: {
			// Beta / Nu node
			const splitted = trimmed.split(","),
				names = splitted[0].split("@"),
				name = names[0] ? names[0].toString().trim() : "",
				module = names[1] ? names[1].toString().trim() : "";
			let lhs = parseInt(splitted[1]),
				rhs = parseInt(splitted[2]);
			if (!name) {
				// Beta node
				const args = (isNaN(lhs) ? 0 : lhs) + (isNaN(rhs) ? 0 : rhs);
				return {
					type: NodeType.Beta,
					args: new Array(args).fill({ id: "" }),
				};
			} else {
				if (isNaN(lhs)) lhs = 0;
				if (isNaN(rhs)) {
					rhs = lhs;
					lhs = 0;
				}
				// Nu node
				return {
					type: NodeType.Nu,
					name: { name, module },
					lhs,
					args: new Array(lhs + rhs).fill({ id: "" }),
				};
			}
		}
	}
};
