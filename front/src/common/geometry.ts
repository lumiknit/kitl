/* Types */

export type Position = {
	x: number;
	y: number;
};

export type Size = {
	w: number;
	h: number;
};

/* Helpers */

export const nearestPointInHPill = (
	// External point
	px: number,
	py: number,
	// Pill
	left: number,
	top: number,
	width: number,
	height: number,
): [number, number, number, number] => {
	// NOTE: it only covers width > height
	const hw = width / 2,
		hh = height / 2,
		cx = left + hw,
		cy = top + hh,
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
			d = Math.sqrt(x * x + oy * oy) / hh;
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
	// Pill
	left: number,
	top: number,
	width: number,
	height: number,
): [number, number, number, number] => {
	if (width > height)
		return nearestPointInHPill(px, py, left, top, width, height);
	else {
		const [x, y, vx, vy] = nearestPointInHPill(
			py,
			px,
			top,
			left,
			height,
			width,
		);
		return [y, x, vy, vx];
	}
};
