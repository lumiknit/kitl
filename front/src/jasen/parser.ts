import { JArray, JObject, Value } from "./types";

const c = (s: string) => s.charCodeAt(0),
	stringToCodeSet = (input: string): Set<number> => {
		const set = new Set<number>();
		for (let i = 0; i < input.length; i++) {
			set.add(input.charCodeAt(i));
		}
		return set;
	},
	CODE_NEWLINE = c("\n"), // 10
	CODE_OPEN_BRACKET = c("["), // 91 [
	CODE_CLOSE_BRACKET = c("]"), // 93 ]
	CODE_OPEN_BRACE = c("{"), // 123 {
	CODE_CLOSE_BRACE = c("}"), // 125 }
	CODE_QUOTE = c('"'), // 34 "
	CODE_APOSTROPHE = c("'"), // 39 '
	CODE_BACKSLASH = c("\\"), // 92 \
	CODE_u = c("u"), // 117 u
	CODE_x = c("x"), // 120 x
	reservedSet = stringToCodeSet("[]{},\"':\n"),
	signdigitdot = stringToCodeSet("+-0123456789."),
	quotes = stringToCodeSet("\"'"),
	ESCAPE_MAP: Map<number, string> = new Map([
		[c("b"), "\b"],
		[c("f"), "\f"],
		[c("n"), "\n"],
		[c("r"), "\r"],
		[c("t"), "\t"],
	]),
	reNumber = /[-+]?((0x[0-9a-fA-F]+)|([0-9]+(\.[0-9]+)?))([eE][-+]?[0-9]+)?/y,
	reKeyword = /(false|true|null)\b/iy,
	mapKeyword = new Map([
		["false", false],
		["true", true],
		["null", null],
	]),
	reTaste = /\s*([[{'"]|[-+]?\.?\d)/y,
	reTasteLong = /\s*([[{'"])/y,
	reWhite = /\s*/y,
	reWhiteComma = /[\s,]*/y,
	reWhiteColon = /[\s:]*/y;

export const taste = (input: string) => {
	reTaste.lastIndex = 0;
	return !!reTaste.exec(input);
};

export const tasteLong = (input: string) => {
	/* If the input is some long JSON (string, array, object), return true */
	reTasteLong.lastIndex = 0;
	return !!reTasteLong.exec(input);
};

type State = {
	s: string;
	p: number;
	l: number;
};

const v = (state: State) => state.s.charCodeAt(state.p);

class ParseError extends Error {
	s: string;
	p: number;
	line: number;
	column: number;

	constructor(state: State, message: string) {
		// Find line and column
		let line = 1,
			column = 1;
		for (let i = 0; i < state.p; i++) {
			if (state.s.charCodeAt(i) === CODE_NEWLINE) {
				// \n
				line++;
				column = 0;
			}
			column++;
		}
		super(`${line}:${column}: ${message}`);
		this.name = "ParseError";
		this.s = state.s;
		this.p = state.p;
		this.line = line;
		this.column = column;
	}
}

const execRE = (state: State, re: RegExp) => {
	re.lastIndex = state.p;
	return re.exec(state.s);
};

const skipRE = (state: State, re: RegExp) => {
	const match = execRE(state, re);
	if (match) {
		state.p += match[0].length;
	}
};

const parseArray = (state: State): JArray => {
	state.p++;
	skipRE(state, reWhiteComma);
	const arr: JArray = [];
	while (state.p < state.l && v(state) !== CODE_CLOSE_BRACKET) {
		arr.push(parseValue(state));
		skipRE(state, reWhiteComma);
	}
	state.p++;
	return arr;
};

const parseObject = (state: State): JObject => {
	state.p++;
	skipRE(state, reWhiteComma);
	const obj: JObject = {};
	while (state.p < state.l && v(state) !== CODE_CLOSE_BRACE) {
		let key;
		if (quotes.has(v(state))) {
			key = parseString(state);
		} else {
			// Try to find colon
			const s = state.p;
			state.p = state.s.indexOf(":", state.p);
			if (state.p === -1) state.p = state.l;
			key = state.s.slice(s, state.p).trim();
		}
		skipRE(state, reWhiteColon);
		obj[key] = parseValue(state);
		skipRE(state, reWhiteComma);
	}
	state.p++;
	return obj;
};

const parseHexEscape = (state: State, l: number) => {
	const s = state.s.slice(state.p + 1, state.p + l + 1);
	const code = parseInt(s, 16);
	state.p += l;
	if (isNaN(code)) {
		throw new ParseError(state, `Invalid unicode escape '${s}'`);
	}
	return String.fromCharCode(code);
};

const parseString = (state: State): string => {
	const open = v(state);
	state.p++;
	let s = "";
	for (; state.p < state.l; state.p++) {
		const c = v(state);
		if (c === open) {
			state.p++;
			return s;
		}
		if (c === CODE_BACKSLASH) {
			// \
			state.p++;
			const c2 = v(state);
			switch (c2) {
				case CODE_u: // u
					s += parseHexEscape(state, 4);
					break;
				case CODE_x: // x
					s += parseHexEscape(state, 2);
					break;
				default:
					s += ESCAPE_MAP.get(c2) || String.fromCharCode(c2);
			}
		} else {
			s += String.fromCharCode(c);
		}
	}
	return s;
};

// Regexp number including base

const parseNumber = (state: State): number => {
	const match = execRE(state, reNumber),
		s = match ? match[0] : "",
		n = s ? Number(s) : NaN;
	state.p += s.length;
	if (isNaN(n)) {
		throw new ParseError(state, `Invalid number '${s}'`);
	}
	return n;
};

const parseKeyword = (state: State, isRoot?: boolean): Value => {
	const match = execRE(state, reKeyword);
	if (match !== null) {
		state.p += match[0].length;
		return mapKeyword.get(match[0].toLowerCase()) as Value;
	}
	if (isRoot) {
		throw new ParseError(
			state,
			`Unexpected character '${state.s[state.p]}'`,
		);
	}
	// Try to parse as a string
	const s = state.p;
	while (state.p < state.l && !reservedSet.has(v(state))) {
		state.p++;
	}
	return state.s.slice(s, state.p).trim();
};

const parses = {
	[CODE_QUOTE]: parseString,
	[CODE_APOSTROPHE]: parseString,
	[CODE_OPEN_BRACKET]: parseArray,
	[CODE_OPEN_BRACE]: parseObject,
};

const parseValue = (state: State, isRoot?: boolean): Value => {
	skipRE(state, reWhite);
	const c = v(state);
	if (c in parses) {
		return parses[c](state);
	}
	if (reservedSet.has(c)) {
		throw new ParseError(
			state,
			`Unexpected character '${state.s[state.p]}' for value`,
		);
	}
	return signdigitdot.has(c)
		? parseNumber(state)
		: parseKeyword(state, isRoot);
};

export const parse = (input: string) => {
	const state: State = {
			s: input,
			p: 0,
			l: input.length,
		},
		result = parseValue(state, true);
	skipRE(state, reWhite);
	if (state.p < state.l) {
		throw new ParseError(
			state,
			`Unexpected character '${state.s[state.p]}', expect EOF`,
		);
	}
	return result;
};
