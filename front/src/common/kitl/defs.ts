import { fassertArrayOf, fassertOptional, fassertString } from "../assert";
import { Node, Source, loadNode, loadSource } from "./base";

export const VERSION = "0.0";

export const DEF_TYPES = ["value", "tag", "type", "alias"];

export type ValueDef = {
	type: "value";
	nodes: Node[];
	val?: Source;
	comment: string;
};

export type TagDef = {
	type: "tag";
	elems: string[];
};

export type TypeDef = {
	type: "type";
	unions: string[];
};

export type AliasDef = {
	type: "alias";
	origin: string;
};

export type Definition = ValueDef | TagDef | TypeDef | AliasDef;

export const emptyDefFns = {
	value: (): ValueDef => ({
		type: "value",
		nodes: [],
		comment: "",
	}),
	tag: (): TagDef => ({
		type: "tag",
		elems: [],
	}),
	type: (): TypeDef => ({
		type: "type",
		unions: [],
	}),
	alias: (): AliasDef => ({
		type: "alias",
		origin: "",
	}),
};

export const loadDefFns = {
	value: (a: any): ValueDef => ({
		type: "value",
		nodes: fassertArrayOf(loadNode)(a.nodes),
		val: fassertOptional(loadSource)(a.val),
		comment: fassertString(a.comment),
	}),
	tag: (a: any): TagDef => ({
		type: "tag",
		elems: fassertArrayOf(fassertString)(a.elems),
	}),
	type: (a: any): TypeDef => ({
		type: "type",
		unions: fassertArrayOf(fassertString)(a.unions),
	}),
	alias: (a: any): AliasDef => ({
		type: "alias",
		origin: fassertString(a.origin),
	}),
};

export type Definitions = { [k: string]: Definition };

const loadDefs = (a: any): Definitions => {
	const o: Definitions = {};
	for (const k in a) {
		o[k] = (loadDefFns as any)[a[k].type](a[k]);
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

// Helpers

export const defsJsonPath = (name: string) => ["defs", name];
