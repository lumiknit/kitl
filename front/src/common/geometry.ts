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

export const pathBetweenPills = (srcRect: Rect, sinkRect: Rect) => {
	const [x2, y2, vx2, vy2] = nearestPointInPill(
		sinkRect.x + sinkRect.w / 2,
		sinkRect.y + sinkRect.h / 2,
		srcRect,
	);
	const [x1, y1, vx1, vy1] = nearestPointInPill(x2, y2, sinkRect);
	const dist = 0.2 * Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	return `M ${x1 - 0.5 * vx1} ${y1 - 0.5 * vy1} C ${x1 + vx1 * dist} ${
		y1 + vy1 * dist
	}, ${x2 + vx2 * dist} ${y2 + vy2 * dist}, ${x2 - 0.5 * vx2} ${
		y2 - 0.5 * vy2
	}`;
};
