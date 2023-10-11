import { JArray, JObject, Value } from "./types";

const c = (s: string) => s.charCodeAt(0),
	stringToCodeSet = (input: string): Set<number> => {
		const set = new Set<number>();
		for (let i = 0; i < input.length; i++) {
			set.add(input.charCodeAt(i));
		}
		return set;
	},
	isWhite = (code: number) => code <= 32;

const CODE_NEWLINE = c("\n"), // 10
	CODE_OPEN_BRACKET = c("["), // 91 [
	CODE_CLOSE_BRACKET = c("]"), // 93 ]
	CODE_OPEN_BRACE = c("{"), // 123 {
	CODE_CLOSE_BRACE = c("}"), // 125 }
	CODE_QUOTE = c('"'), // 34 "
	CODE_APOSTROPHE = c("'"), // 39 '
	CODE_COMMA = c(","), // 44 ,
	CODE_COLON = c(":"), // 58 :
	CODE_BACKSLASH = c("\\"), // 92 \
	CODE_u = c("u"), // 117 u
	CODE_x = c("x"), // 120 x
	reservedSet = stringToCodeSet("[]{},\"':\n"),
	jsonSet = stringToCodeSet("[{\"'0123456789"),
	digit = stringToCodeSet("0123456789"),
	sign = stringToCodeSet("+-"),
	signdigitdot = stringToCodeSet("+-0123456789."),
	digitdot = stringToCodeSet("0123456789."),
	hexdigit = stringToCodeSet("0123456789abcdefABCDEF"),
	quotes = stringToCodeSet("\"'"),
	ESCAPE_MAP: Map<number, string> = new Map([
		[c("b"), "\b"],
		[c("f"), "\f"],
		[c("n"), "\n"],
		[c("r"), "\r"],
		[c("t"), "\t"],
	]);

const firstNonWhite = (input: string) => {
	let pos = 0;
	while (isWhite(input.charCodeAt(pos))) {
		pos++;
	}
	return pos;
};

export const taste = (input: string) => {
	const p = firstNonWhite(input),
		c = input.charCodeAt(p),
		n = input.charCodeAt(p + 1);
	return jsonSet.has(c) || (sign.has(c) && digit.has(n));
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

const skipWhite = (state: State, code: number) => {
	let c;
	state.p--;
	do {
		state.p++;
		c = v(state);
	} while (isWhite(c) || c === code);
};

const parseArray = (state: State): JArray => {
	state.p++;
	skipWhite(state, CODE_COMMA);
	const arr: JArray = [];
	while (state.p < state.l && v(state) !== CODE_CLOSE_BRACKET) {
		arr.push(parseValue(state));
		skipWhite(state, CODE_COMMA);
	}
	state.p++;
	return arr;
};

const parseObject = (state: State): JObject => {
	state.p++;
	skipWhite(state, CODE_COMMA);
	const obj: JObject = {};
	while (state.p < state.l && v(state) !== CODE_CLOSE_BRACE) {
		let key;
		if (quotes.has(v(state))) {
			key = parseString(state);
		} else {
			// Try to find colon
			const s = state.p;
			while (state.p < state.l && v(state) !== CODE_COLON) {
				state.p++;
			}
			key = state.s.slice(s, state.p).trim();
		}
		skipWhite(state, CODE_COLON);
		obj[key] = parseValue(state);
		skipWhite(state, CODE_COMMA);
	}
	state.p++;
	return obj;
};

const parseHexEscape = (state: State, s: string) => {
	const code = parseInt(s, 16);
	if (isNaN(code)) {
		throw new ParseError(state, `Invalid unicode escape '${s}'`);
	}
	return String.fromCharCode(code);
};

const parseString = (state: State): string => {
	const open = v(state);
	state.p++;
	let s = "";
	while (state.p < state.l) {
		const c = v(state);
		if (c === open) {
			state.p++;
			return s;
		} else if (c === CODE_BACKSLASH) {
			// \
			state.p++;
			const c2 = v(state);
			switch (c2) {
				case CODE_u: // u
					s += parseHexEscape(
						state,
						state.s.slice(state.p + 1, state.p + 5),
					);
					state.p += 5;
					break;
				case CODE_x: // x
					s += parseHexEscape(
						state,
						state.s.slice(state.p + 1, state.p + 3),
					);
					state.p += 3;
					break;
				default:
					s += ESCAPE_MAP.get(c2) || String.fromCharCode(c2);
			}
		} else {
			s += String.fromCharCode(c);
		}
		state.p++;
	}
	return s;
};

const parseNumber = (state: State): number => {
	const s = state.p;
	if (sign.has(v(state))) {
		state.p++;
	}
	let set = digitdot;
	if ("0x" === state.s.slice(state.p, state.p + 2).toLowerCase()) {
		state.p += 2;
		set = hexdigit;
	}
	while (set.has(v(state))) {
		state.p++;
	}
	const n = Number(state.s.slice(s, state.p));
	if (isNaN(n)) {
		throw new ParseError(
			state,
			`Invalid number '${state.s.slice(s, state.p)}'`,
		);
	}
	return n;
};

const parseKeyword = (state: State, isRoot?: boolean): Value => {
	const slice5 = state.s.slice(state.p, state.p + 5).toLowerCase();
	if (slice5 === "false") {
		state.p += 5;
		return false;
	}
	const slice4 = slice5.slice(0, 4);
	if (slice4 === "true") {
		state.p += 4;
		return true;
	} else if (slice4 === "null") {
		state.p += 4;
		return null;
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

const parseValue = (state: State, isRoot?: boolean): Value => {
	skipWhite(state, 0);
	const c = v(state);
	switch (c) {
		case CODE_QUOTE: // "
		case CODE_APOSTROPHE: // '
			return parseString(state);
		case CODE_OPEN_BRACKET: // [
			return parseArray(state);
		case CODE_OPEN_BRACE: // {
			return parseObject(state);
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
	skipWhite(state, 0);
	if (state.p < state.l) {
		throw new ParseError(
			state,
			`Unexpected character '${state.s[state.p]}', expect EOF`,
		);
	}
	return result;
};
