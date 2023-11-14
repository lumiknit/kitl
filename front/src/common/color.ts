export type HSL = {
	h: number;
	s: number;
	l: number;
};

export const RGB2GRAY = (r: number, g: number, b: number): number => {
	return 0.299 * r + 0.587 * g + 0.114 * b;
};

const hue2rgb = (p: number, q: number, t: number): number => {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	let v;
	if (t < 1 / 2) {
		v = q;
		if (t < 1 / 6) v = p + (q - p) * 6 * t;
	} else {
		v = p;
		if (t < 2 / 3) v = p + (q - p) * (2 / 3 - t) * 6;
	}
	return Math.round(v * 255);
};

export const HSL2RGB = (
	h: number,
	s: number,
	l: number,
): [number, number, number] => {
	if (s === 0) {
		return [l, l, l];
	}
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
		p = 2 * l - q;
	return [
		hue2rgb(p, q, h + 1 / 3),
		hue2rgb(p, q, h),
		hue2rgb(p, q, h - 1 / 3),
	];
};

export const RGB2HSL = (
	r: number,
	g: number,
	b: number,
): [number, number, number] => {
	(r /= 255), (g /= 255), (b /= 255);
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		sm = max + min,
		dm = max - min;
	if (max === min) return [0, 0, max];
	const s = sm > 1 ? dm / (2 - 2 * sm) : dm / sm;
	switch (max) {
		case r:
			return [((g - b) / dm + (g < b ? 6 : 0)) / 6, s, sm / 2];
		case g:
			return [((b - r) / dm + 2) / 6, s, sm / 2];
		default:
			return [((r - g) / dm + 4) / 6, s, sm / 2];
	}
};

export const hslCss = (h: number, s: number, l: number): string =>
	`hsl(${h}, ${s * 100}%, ${l * 100}%)`;
