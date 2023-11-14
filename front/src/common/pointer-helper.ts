/* Types and constants */

import { distSquare } from "./geometry";

const MOVE_THRESHOLD = 6,
	DOUBLE_CLICK_TIME = 250,
	DOUBLE_CLICK_THRESHOLD = 16,
	LONG_PRESS_TIME = 750;

const st = window.setTimeout,
	ct = window.clearTimeout;

export type PointerID = number;

type Pointer = {
	id: PointerID;
	// Current position
	x: number;
	y: number;
	moved: boolean;
	timestamp: number;
};

type LongPress = {
	id: PointerID;
	x: number;
	y: number;
	u: number; // Timeout
};

export type BaseEvent = {
	id: PointerID;
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
	dragged?: boolean;
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

export type Props = {
	capture?: boolean;
	// Enter events
	onEnter?: (id: PointerID) => void;
	onLeave?: (id: PointerID) => void;
	onCancel?: (id: PointerID) => void;
	// Down/move/up events
	onDown?: (e: ClickEvent) => void;
	onMove?: (e: BaseEvent) => void;
	onUp?: (e: ClickEvent) => void;
	// Click events
	onClick?: (e: ClickEvent) => void;
	onDoubleClick?: (e: ClickEvent) => void;
	onLongPress?: (e: BaseEvent) => void;
	// Drag events
	onDrag?: (e: DragEvent) => void;
};

type LastClick = {
	x: number;
	y: number;
	timestamp: number;
};

type State = {
	pointers: Map<PointerID, Pointer>;
	longPress?: LongPress;
	maxPointers: number;
	lastClick: LastClick;
};

/* Functions */

const pdsp = (e: any) => {
	e.preventDefault();
	e.stopPropagation();
};

export const addEventListeners = (handlers: Props, el: Element) => {
	const s: State = {
		pointers: new Map(),
		maxPointers: 0,
		lastClick: {
			x: 0,
			y: 0,
			timestamp: 0,
		},
	};
	const cancelPointer = (id: PointerID) => {
		if (s.longPress && s.longPress.id === id) {
			ct(s.longPress.u);
			s.longPress = undefined;
		}
		s.pointers.delete(id);
	};
	const events = {
		pointerenter: (e: PointerEvent) => {
			handlers.onEnter?.(e.pointerId);
		},
		pointercancel: (e: PointerEvent) => {
			cancelPointer(e.pointerId);
			handlers.onCancel?.(e.pointerId);
		},
		pointerleave: (e: PointerEvent) => {
			cancelPointer(e.pointerId);
			handlers.onLeave?.(e.pointerId);
		},
		pointerdown: (e: PointerEvent) => {
			pdsp(e);
			const id = e.pointerId;
			handlers.onDown?.({
				id,
				x: e.clientX,
				y: e.clientY,
				pointers: s.pointers.size,
				modifiers: modifiersFromHTMLEvent(e),
			});
			(e.target as any).releasePointerCapture(id);
			if (handlers.capture) {
				(e.currentTarget as any).setPointerCapture(id);
			} else {
				(e.currentTarget as any).releasePointerCapture(id);
			}
			const p: Pointer = {
				id,
				x: e.clientX,
				y: e.clientY,
				moved: false,
				timestamp: Date.now(),
			};
			cancelPointer(e.pointerId);
			s.pointers.set(id, p);
			s.maxPointers = Math.max(s.maxPointers, s.pointers.size);
			if (s.pointers.size === 1) {
				// Start long press
				s.longPress = {
					id,
					x: e.clientX,
					y: e.clientY,
					u: st(() => {
						if (
							s.longPress &&
							s.pointers.size === 1 &&
							s.pointers.has(id) &&
							!s.pointers.get(id)!.moved
						) {
							s.longPress = undefined;
							handlers.onLongPress?.({
								id,
								x: e.clientX,
								y: e.clientY,
							});
							s.pointers.delete(id);
						}
					}, LONG_PRESS_TIME),
				};
			}
		},
		pointermove: (e: PointerEvent) => {
			pdsp(e);
			const id = e.pointerId;
			handlers.onMove?.({
				id,
				x: e.clientX,
				y: e.clientY,
			});
			const p = s.pointers.get(id);
			if (!p) return;
			const dx = e.clientX - p.x,
				dy = e.clientY - p.y;
			if (!p.moved && distSquare(dx, dy) < MOVE_THRESHOLD) {
				return;
			}
			if (handlers.onDrag) {
				const event: DragEvent = {
						id,
						x: e.clientX,
						y: e.clientY,
						ox: p.x,
						oy: p.y,
						dx,
						dy,
					},
					[a, b] = s.pointers.keys();
				if (b) {
					event.pivot = s.pointers.get(a === id ? b : a);
				}
				handlers.onDrag(event);
			}
			p.moved = true;
			p.x = e.clientX;
			p.y = e.clientY;
		},
		pointerup: (e: PointerEvent) => {
			pdsp(e);
			const id = e.pointerId;
			const pointer = s.pointers.get(id);
			const event: ClickEvent = {
				id,
				x: e.clientX,
				y: e.clientY,
				pointers: s.maxPointers,
				modifiers: modifiersFromHTMLEvent(e),
				dragged: s.pointers.get(id)?.moved,
			};
			handlers.onUp?.(event);
			if (!pointer) return;
			cancelPointer(e.pointerId);
			const now = Date.now();
			if (s.pointers.size === 0) {
				// Click
				handlers.onClick?.(event);
				if (
					now - s.lastClick.timestamp < DOUBLE_CLICK_TIME &&
					distSquare(
						event.x - s.lastClick.x,
						event.y - s.lastClick.y,
					) <
						DOUBLE_CLICK_THRESHOLD ** 2
				) {
					handlers.onDoubleClick?.(event);
				}
				s.lastClick = {
					x: e.clientX,
					y: e.clientY,
					timestamp: now,
				};
				s.maxPointers = 0;
			}
		},
	};

	for (const [k, v] of Object.entries(events)) {
		el.addEventListener(k, v as any, { passive: false });
	}
};
