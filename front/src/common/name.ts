import { fassertString } from "./assert";

export type Name = {
	module: string;
	name: string;
};

export const loadName = (d: Name): Name => ({
	module: fassertString(d.module),
	name: fassertString(d.name),
});

export const invalidChars = '()[]{},;\\@#"';
export const invalidCharMap = new Map<string, boolean>();
for (let i = 0; i < invalidChars.length; i++) {
	invalidCharMap.set(invalidChars[i], true);
}

export const containsInvalidChars = (name: string): boolean => {
	for (let i = 0; i < name.length; i++) {
		if (invalidCharMap.has(name[i])) return true;
	}
	return false;
};

export const removeInvalidChars = (name: string): string => {
	let s = "";
	for (let i = 0; i < name.length; i++) {
		if (!invalidCharMap.has(name[i])) s += name[i];
	}
	return s;
};

export const mergeWhitespace = (name: string): string => {
	// Convert consecutive whitespace to a single space
	let s = "";
	let lastIsWhitespace = false;
	let i = 0;
	while (i < name.length && (name.charCodeAt(i) <= 32 || name[i] === "_")) {
		i += 1;
	}
	for (; i < name.length; i++) {
		if (name.charCodeAt(i) <= 32 || name[i] === "_") {
			if (!lastIsWhitespace) {
				lastIsWhitespace = true;
			}
		} else {
			if (lastIsWhitespace) s += "_";
			s += name[i];
			lastIsWhitespace = false;
		}
	}
	return s;
};

export const normalizeName = (name: string): string =>
	removeInvalidChars(mergeWhitespace(name));

export const whitenNameString = (name: string): string =>
	name.replace(/_/g, " ");

export const normalizedWhitenName = (name: string): string =>
	whitenNameString(normalizeName(name));

export const newName = (name: string, module: string): Name => ({
	module: normalizeName(module),
	name: normalizeName(name),
});

export const cloneName = (name: Name): Name => newName(name.name, name.module);

export const whitenName = (name: Name): Name => ({
	module: normalizeName(name.module),
	name: whitenNameString(name.name),
});
