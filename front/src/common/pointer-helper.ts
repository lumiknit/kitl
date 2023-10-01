/* Types and constants */

import { distSquare } from "./geometry";

const MOVE_THRESHOLD = 4,
	DOUBLE_CLICK_TIME = 300,
	MULTI_TAP_TIME = 100,
	LONG_PRESS_TIME = 750;

const st = window.setTimeout,
	ct = window.clearTimeout;

type ButtonState = number;
const BSReleased = 0,
	BSPressed = 1,
	BSMoved = 2;

type PointerID = number;

type Pointer = {
	id: PointerID;
	// Current position
	x: number;
	y: number;
	b: ButtonState;
	// Click count
	c: number;
	// Timestamp
	t: number;
};

type DelayedTap = {
	x: number;
	y: number;
	c: number; // Count
	t: number; // Timestamp
	u: number; // Timeout
};

type LongPress = {
	id: PointerID;
	x: number;
	y: number;
	u: number; // Timeout
};

export type BaseEvent = {
	x: number;
	y: number;
};

export type Modifiers = {
	shift: boolean;
	ctrl: boolean;
	alt: boolean;
	meta: boolean;
};

const modifiersFromHTMLEvent = (e: MouseEvent | TouchEvent): Modifiers => ({
	shift: e.shiftKey,
	ctrl: e.ctrlKey,
	alt: e.altKey,
	meta: e.metaKey,
});

export type ClickEvent = BaseEvent & {
	pointers: number;
	modifiers: Modifiers;
};

export type DragEvent = BaseEvent & {
	ox: number;
	oy: number;
	dx: number;
	dy: number;
	pivot?: {
		x: number;
		y: number;
	};
};

export type Handlers = {
	onPress?: (e: ClickEvent) => void;
	onClick?: (e: ClickEvent) => void;
	onDoubleClick?: (e: ClickEvent) => void;
	onLongPress?: (e: BaseEvent) => void;
	onDrag?: (e: DragEvent) => void;
	onRelease?: (e: BaseEvent) => void;
};

type State = {
	t: Map<PointerID, PointerID>; // Touches
	c: Map<PointerID, Pointer>; // Current
	o: Map<PointerID, Pointer>; // Old
	d?: DelayedTap; // Delayed tap
	l?: LongPress; // Long press timeout
	k?: number; // Clean Function Timeout
	handlers: Handlers;
};

/* Functions */

let idCounter = 0;
const mapID = (s: State, id: PointerID): PointerID => {
	let v = s.t.get(id);
	if (v === undefined) {
		idCounter = (idCounter + 1) % 0x7fffffff;
		s.t.set(id, idCounter);
		v = idCounter;
	}
	return v;
};

export const addEventListeners = (handles: Handlers, el: Element) => {
	const s: State = {
		t: new Map(),
		c: new Map(),
		o: new Map(),
		handlers: handles,
	};

	const updatePointer = (id: PointerID, x: number, y: number): boolean => {
		// Move event
		const p = s.c.get(id);
		if (!p) return false;
		const dx = x - p.x,
			dy = y - p.y;
		if (p.b !== BSMoved && distSquare(dx, dy) < MOVE_THRESHOLD) {
			return false;
		}
		// Update view
		const event: DragEvent = {
				x,
				y,
				ox: p.x,
				oy: p.y,
				dx,
				dy,
			},
			[a, b] = s.c.keys();
		if (b) {
			event.pivot = s.c.get(a === id ? b : a);
		}
		p.b = BSMoved;
		p.x = x;
		p.y = y;
		s.handlers.onDrag?.(event);
		return true;
	};

	const deactivatePointer = (id: PointerID, ce: ClickEvent): void => {
		// Button Up / Touch End event
		const p = s.c.get(id);
		s.c.delete(id);
		if (!p) return;
		s.o.set(id, p);
		const oldB = p.b;
		p.b = BSReleased;
		if (oldB === BSMoved) {
			p.c = 0;
			s.handlers.onRelease?.(ce);
			return;
		}
		if (p.c === 2) {
			// Double Click
			s.handlers.onDoubleClick?.(ce);
		} else if (s.d || s.c.size > 0) {
			let cnt = 1;
			if (s.d) {
				ct(s.d.u);
				cnt = s.d.c + 1;
			}
			s.d = {
				x: p.x,
				y: p.y,
				c: cnt,
				t: Date.now(),
				u: st(() => {
					const p = s.d;
					if (!p) return;
					s.d = undefined;
					s.handlers.onClick?.({
						...ce,
						pointers: cnt,
					});
				}, MULTI_TAP_TIME),
			};
		} else {
			s.handlers.onClick?.({
				...ce,
				pointers: 1,
			});
		}
		if (s.k) ct(s.k);
		s.k = st(() => {
			s.k = undefined;
			s.d = undefined;
			s.o.clear();
		}, DOUBLE_CLICK_TIME);
		ct(s.l?.u);
		s.l = undefined;
		if (s.c.size === 0) {
			for (const k in HANDLERS) {
				window.removeEventListener(k, HANDLERS[k]);
			}
		}
	};

	const HANDLERS: { [k: string]: any } = {
		mousemove: (e: MouseEvent) => {
			if (e.buttons & 1) {
				updatePointer(-1, e.clientX, e.clientY);
			}
		},
		mouseup: (e: MouseEvent) => {
			if (e.button === 0) {
				deactivatePointer(-1, {
					pointers: 1,
					x: e.clientX,
					y: e.clientY,
					modifiers: modifiersFromHTMLEvent(e),
				});
			}
		},
		mouseleave: () => {
			s.c.delete(-1);
		},
		touchmove: (e: TouchEvent) => {
			for (const t of e.changedTouches) {
				updatePointer(mapID(s, t.identifier), t.clientX, t.clientY);
			}
		},
		touchend: (e: TouchEvent) => {
			for (const t of e.changedTouches) {
				deactivatePointer(mapID(s, t.identifier), {
					pointers: e.touches.length,
					x: t.clientX,
					y: t.clientY,
					modifiers: modifiersFromHTMLEvent(e),
				});
				s.t.delete(t.identifier);
			}
		},
		touchcancel: (e: TouchEvent) => {
			for (const t of e.changedTouches) {
				s.t.delete(t.identifier);
			}
		},
	};

	const activatePointer = (id: PointerID, ce: ClickEvent): void => {
		// Button Down / Touch Start event
		// Try to get old state
		const now = Date.now(),
			p = s.o.get(id),
			cnt =
				p && // Pointer still exists
				p.c === 1 && // Already clicked once
				now - p.t <= DOUBLE_CLICK_TIME // Within double click time
					? 2
					: 1;
		s.o.delete(id);
		s.c.set(id, {
			id,
			x: ce.x,
			y: ce.y,
			b: BSPressed,
			c: cnt,
			t: now,
		});
		if (s.l) {
			ct(s.l.u);
		}
		s.l = {
			id,
			x: ce.x,
			y: ce.y,
			u: st(() => {
				const p = s.c.get(id);
				if (
					p && // Pointer still exists
					s.l && // Long press still exists
					p.id === s.l.id && // Pointer is the same
					p.b === BSPressed && // Pointer is not moved
					s.c.size === 1 // Only one pointer
				) {
					s.handlers.onLongPress?.({ x: ce.x, y: ce.y });
					s.c.delete(id);
				}
				s.l = undefined;
			}, LONG_PRESS_TIME),
		};
		if (s.c.size === 1) {
			for (const k in HANDLERS) {
				window.addEventListener(k, HANDLERS[k]);
			}
		}
		ce.pointers = s.c.size;
		s.handlers.onPress?.(ce);
	};

	const START_HANDLERS: { [k: string]: any } = {
		mousedown: (e: MouseEvent) => {
			if (e.button !== 0) return;
			activatePointer(-1, {
				pointers: 1,
				x: e.clientX,
				y: e.clientY,
				modifiers: modifiersFromHTMLEvent(e),
			});
			e.stopPropagation();
		},
		touchstart: (e: TouchEvent) => {
			for (const t of e.changedTouches) {
				activatePointer(mapID(s, t.identifier), {
					pointers: 1,
					x: t.clientX,
					y: t.clientY,
					modifiers: modifiersFromHTMLEvent(e),
				});
			}
			e.preventDefault();
			e.stopPropagation();
		},
	};
	for (const k in START_HANDLERS) {
		el.addEventListener(k, START_HANDLERS[k]);
	}
	return () => {
		for (const k in START_HANDLERS) {
			el.removeEventListener(k, START_HANDLERS[k]);
		}
	};
};
