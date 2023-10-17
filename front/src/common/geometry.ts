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

export type ShapedRect = Rect & {
	angular?: boolean; // If true, rectangle, otherwise, pill
};

/* Constant */

export const origin: Position = { x: 0, y: 0 };

/* Helpers */

export const distSquare = (dx: number, dy: number) => dx * dx + dy * dy;
export const dist = (dx: number, dy: number) => Math.sqrt(distSquare(dx, dy));

// Nearest point helper

export const nearestPointInRect = (
	// External point
	px: number,
	py: number,
	rect: ShapedRect,
): [number, number, number, number] => {
	/* Find nearest point in the rectanble */
	const hw = rect.w / 2,
		hh = rect.h / 2,
		cx = rect.x + hw,
		cy = rect.y + hh,
		m = Math.abs(hw - hh);
	let ox = px - cx,
		oy = py - cy,
		vx = 0,
		vy = 0;
	if (ox < -hw) (ox = -hw), (vx = -1);
	if (ox > hw) (ox = hw), (vx = 1);
	if (oy < -hh) (oy = -hh), (vy = -1);
	if (oy > hh) (oy = hh), (vy = 1);
	if (rect.angular) {
		if (vx * vy !== 0) {
			// Direction
			const d = dist(ox, oy);
			return [cx + ox - 1.4 * vx, cy + oy - 1.4 * vy, ox / d, oy / d];
		}
	} else {
		// If point is in the corner of pill, find nearest point.
		if (hw > hh && Math.abs(ox) > m) {
			const z = ox > 0 ? m : -m,
				x = ox - z,
				d = dist(x, oy) / hh;
			return [cx + z + x / d, cy + oy / d, x / hh, oy / (d * hh)];
		}
		if (hh > hw && Math.abs(oy) > m) {
			const z = oy > 0 ? m : -m,
				y = oy - z,
				d = dist(ox, y) / hw;
			return [cx + ox / d, cy + z + y / d, ox / (d * hw), y / hw];
		}
	}
	return [cx + ox, cy + oy, vx, vy];
};

export const pathBetweenRects = (
	srcRect: ShapedRect,
	sinkRect: ShapedRect,
	off: number,
) => {
	const [x2, y2, vx2, vy2] = nearestPointInRect(
			sinkRect.x + sinkRect.w / 2,
			sinkRect.y + sinkRect.h / 2,
			srcRect,
		),
		[x1, y1, vx1, vy1] = nearestPointInRect(x2, y2, sinkRect),
		d = 0.2 * dist(x2 - x1, y2 - y1);
	return `M ${x1 - off * vx1} ${y1 - off * vy1} C ${x1 + vx1 * d} ${
		y1 + vy1 * d
	}, ${x2 + vx2 * d} ${y2 + vy2 * d}, ${x2 - off * vx2} ${y2 - off * vy2}`;
};

export const pathSelf = (srcRect: Rect, sinkRect: Rect) => {
	const DIST = 30,
		cx1 = srcRect.x + srcRect.w / 2,
		cx2 = sinkRect.x + sinkRect.w / 2;
	return `M ${cx1} ${srcRect.y} C ${cx1} ${srcRect.y - DIST}, ${cx2} ${
		sinkRect.y - DIST
	}, ${cx2} ${sinkRect.y}`;
};
