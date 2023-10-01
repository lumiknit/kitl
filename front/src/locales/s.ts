let locale: string = "";
let strings: Map<string, string> = new Map();

export const getLocale = () => locale;

const objToFlatMap = (
	dst: Map<string, string>,
	prefix: string,
	obj: { [key: string]: any },
) => {
	for (const key in obj) {
		const val = obj[key];
		const newKey = prefix ? `${prefix}.${key}` : key;
		if (typeof val === "object") {
			objToFlatMap(dst, newKey, val);
		} else {
			dst.set(newKey, val);
		}
	}
};

export const loadStrings = async (l?: string) => {
	for (const lang of [l, ...navigator.languages, "en"]) {
		if (lang) {
			try {
				const data = await import(`./strings/${lang}.json`);
				const map = new Map();
				objToFlatMap(map, "", data);
				locale = lang;
				strings = map;
				return true;
			} catch (e) {
				continue;
			}
		}
	}
};

export const s = (key: string) => {
	return strings.get(key) || key;
};
