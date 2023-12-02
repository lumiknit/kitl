import * as jasen from "@/jasen";
import { NodeData, NodeType } from "./base";
import { Name } from "../name";

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

const parseIntOrZero = (s: string): number => {
	const n = parseInt(s);
	return isNaN(n) ? 0 : n;
};

const parseName = (s: string): Name => {
	const splitted = s.split("@", 2);
	return {
		name: splitted[0].trim(),
		module: splitted[1] ? splitted[1].trim() : "",
	};
};

export const stringifyNodeData = (x: NodeData): string => {
	console.log(x);
	switch (x.type) {
		case NodeType.Alpha:
			return JSON.stringify(x.val, null, 2);
		case NodeType.Beta: {
			const name = x.name,
				ns = name.module ? ` @ ${name.module}` : "",
				argc =
					x.args.length <= 0
						? ""
						: x.lhs <= 0
						  ? ` , ${x.args.length}`
						  : ` , ${x.lhs} , ${Math.max(
									0,
									x.args.length - x.lhs,
						    )}`;
			return `${name.name}${ns}${argc}`;
		}
		case NodeType.Delta:
			return `${x.comment}`;
		case NodeType.Lambda:
			return x.params.map(x => "\\" + x).join(" ");
		case NodeType.Pi: {
			const name = x.name,
				ns = name.module ? ` @ ${name.module}` : "",
				argc = x.elems <= 0 ? "" : `,${x.elems}`;
			return `? ${name.name}${ns}${argc}`;
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
		case "\\": {
			// Lambda node
			const splitted: string[] = trimmed
				.slice(1)
				.split("\\")
				.reduce((acc: string[], x) => {
					const trimmed = x.trim();
					if (trimmed) acc.push(trimmed);
					return acc;
				}, []);
			return {
				type: NodeType.Lambda,
				params: splitted.length < 1 ? ["x"] : splitted,
			};
		}
		case "?": {
			// Pi node
			const splitted = trimmed.slice(1).split(",");
			const name = parseName(splitted[0]);
			const elems = parseIntOrZero(splitted[1]);
			return {
				type: NodeType.Pi,
				name,
				elems,
			};
		}
		default: {
			// Beta node
			const splitted = trimmed.split(","),
				name = parseName(splitted[0]);
			let lhs = parseIntOrZero(splitted[1]),
				rhs = parseInt(splitted[2]);
			if (isNaN(rhs)) {
				rhs = lhs;
				lhs = 0;
			}
			// Nu node
			return {
				type: NodeType.Beta,
				name,
				lhs,
				args: new Array(lhs + rhs).fill({ id: "" }),
			};
		}
	}
};
