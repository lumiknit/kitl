import { fassertArrayOf, fassertString } from "../assert";
import { Node, loadNode } from "../node";

export const VERSION = "0.0";

export const DEF_TYPES = ["value", "tag", "type", "alias"];

export type DefValue = {
	type: "value";
	value: Node[];
};

export type DefTag = {
	type: "tag";
	elems: string[];
};

export type DefType = {
	type: "type";
	unions: string[];
};

export type DefAlias = {
	type: "alias";
	origin: string;
};

export type Definition = DefValue | DefTag | DefType | DefAlias;

export const emptyDefFns = {
	value: (): DefValue => ({
		type: "value",
		value: [],
	}),
	tag: (): DefTag => ({
		type: "tag",
		elems: [],
	}),
	type: (): DefType => ({
		type: "type",
		unions: [],
	}),
	alias: (): DefAlias => ({
		type: "alias",
		origin: "",
	}),
};

const loadDefFns: any = {
	value: (a: any): DefValue => ({
		type: "value",
		value: fassertArrayOf(loadNode)(a.value),
	}),
	tag: (a: any): DefTag => ({
		type: "tag",
		elems: fassertArrayOf(fassertString)(a.elems),
	}),
	type: (a: any): DefType => ({
		type: "type",
		unions: fassertArrayOf(fassertString)(a.unions),
	}),
	alias: (a: any): DefAlias => ({
		type: "alias",
		origin: fassertString(a.origin),
	}),
};

export type Definitions = { [k: string]: Definition };

const loadDefs = (a: any): Definitions => {
	const o: Definitions = {};
	for (const k in a) {
		o[k] = loadDefFns[a[k].type](a[k]);
	}
	return o;
};

export type Root = {
	version: string;
	defs: Definitions;
};

export const loadRoot = (a: any): Root => ({
	version: fassertString(a.version),
	defs: loadDefs(a.defs),
});

export const newRoot = (defs: Definitions): Root => ({
	version: VERSION,
	defs,
});
