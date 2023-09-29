/* Types */

export type Position = {
	x: number;
	y: number;
};

export type Size = {
	w: number;
	h: number;
};

export type Rect = Position & Size;

/* Helpers */

export const distSquare = (dx: number, dy: number) => dx * dx + dy * dy;
export const dist = (dx: number, dy: number) => Math.sqrt(distSquare(dx, dy));

export const transposeRect = (rect: Rect): Rect => ({
	x: rect.y,
	y: rect.x,
	w: rect.h,
	h: rect.w,
});

export const nearestPointInHPill = (
	// External point
	px: number,
	py: number,
	rect: Rect,
): [number, number, number, number] => {
	// NOTE: it only covers width > height
	const hw = rect.w / 2,
		hh = rect.h / 2,
		cx = rect.x + hw,
		cy = rect.y + hh,
		m = hw - hh;
	let ox = px - cx,
		oy = py - cy,
		vx = 0,
		vy = 0;
	if (ox < -hw) (ox = -hw), (vx = -1);
	if (ox > hw) (ox = hw), (vx = 1);
	if (oy < -hh) (oy = -hh), (vy = -1);
	if (oy > hh) (oy = hh), (vy = 1);
	// If the point is outsize of rounded rectangle, filter
	if (Math.abs(ox) > m) {
		const z = ox > 0 ? 1 : -1,
			x = ox - z * m,
			d = dist(x, oy) / hh;
		ox = z * m + x / d;
		oy /= d;
		// Calculate normal vector
		vx = x / hh;
		vy = oy / hh;
	}
	return [cx + ox, cy + oy, vx, vy];
};

export const nearestPointInPill = (
	// External point
	px: number,
	py: number,
	rect: Rect,
): [number, number, number, number] => {
	if (rect.w > rect.h) return nearestPointInHPill(px, py, rect);
	else {
		const [y, x, vy, vx] = nearestPointInHPill(py, px, transposeRect(rect));
		return [x, y, vx, vy];
	}
};
