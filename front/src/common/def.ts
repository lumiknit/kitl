export enum DefType {
	Value,
	Tag,
}

export type Def = {
	type: DefType;
	name: string;
	module: string;
	fullName: string;
};

export type Defs = { [fullName: string]: Def };

export const newDef = (type: DefType, name: string, module: string): Def => ({
	type,
	name,
	module,
	fullName: name + "@" + module,
});

export const emptyDefs = (): Defs => ({});

export const addDefs = (defs: Defs, defArr: Def[]): Defs => {
	const newDefs = { ...defs };
	defArr.forEach(def => {
		newDefs[def.fullName] = def;
	});
	return newDefs;
};

export const newDefs = (defArr?: Def[]): Defs =>
	addDefs(emptyDefs(), defArr || []);
