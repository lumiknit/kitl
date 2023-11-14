export const fassertType =
	(t: string) =>
	(a: any): any => {
		if (typeof a !== t) {
			throw new Error(`Expected ${t}, got ${typeof a}`);
		}
		return a;
	};

export const fassertObject = fassertType("object");
export const fassertString = fassertType("string");
export const fassertNumber = fassertType("number");

export const fassertOptional = (f: (a: any) => any) => (a: any) => {
	if (a === undefined) {
		return undefined;
	}
	return f(a);
};

export const fassertArrayOf = (f: (a: any) => any) => (a: any) => {
	if (!Array.isArray(a)) {
		throw new Error(`Expected array, got ${typeof a}`);
	}
	return a.map(f);
};

export const fassertObjectOf = (f: (a: any) => any) => (a: any) => {
	if (typeof a !== "object") {
		throw new Error(`Expected object, got ${typeof a}`);
	}
	const o: any = {};
	for (const k in a) {
		o[k] = f(a[k]);
	}
	return o;
};
