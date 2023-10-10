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

/* Constant */

export const origin: Position = { x: 0, y: 0 };

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
		const z = ox > 0 ? m : -m,
			x = ox - z,
			d = dist(x, oy) / hh;
		ox = z + x / d;
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

export const pathBetweenPills = (srcRect: Rect, sinkRect: Rect) => {
	const [x2, y2, vx2, vy2] = nearestPointInPill(
			sinkRect.x + sinkRect.w / 2,
			sinkRect.y + sinkRect.h / 2,
			srcRect,
		),
		[x1, y1, vx1, vy1] = nearestPointInPill(x2, y2, sinkRect),
		d = 0.2 * dist(x2 - x1, y2 - y1);
	return `M ${x1 - vx1 / 2} ${y1 - vy1 / 2} C ${x1 + vx1 * d} ${
		y1 + vy1 * d
	}, ${x2 + vx2 * d} ${y2 + vy2 * d}, ${x2 - vx2 / 2} ${y2 - vy2 / 2}`;
};

export const pathSelf = (srcRect: Rect, sinkRect: Rect) => {
	const DIST = 30,
		cx1 = srcRect.x + srcRect.w / 2,
		cx2 = sinkRect.x + sinkRect.w / 2;
	return `M ${cx1} ${srcRect.y} C ${cx1} ${srcRect.y - DIST}, ${cx2} ${
		sinkRect.y - DIST
	}, ${cx2} ${sinkRect.y}`;
};
