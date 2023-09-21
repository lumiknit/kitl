import {
	Accessor,
	Component,
	JSXElement,
	Setter,
	createEffect,
	createSignal,
} from "solid-js";

import { Box2 } from "../common";

const MOVE_THRESHOLD = 4;
const DOUBLE_CLICK_TIME = 300;
const MULTI_TAP_TIME = 100;

export type HrmTransform = {
	x: number; // x offset
	y: number; // y offset
	z: number; // zoom
};

const transformToStyle = (t: HrmTransform) =>
	`translate(${t.x}px, ${t.y}px) scale(${t.z})`;

type ButtonState = number;
const BSReleased = 0;
const BSPressed = 1;
const BSMoved = 2;

type PointerID = number;

type PointerState = {
	id: PointerID;
	// Current position
	x: number;
	y: number;
	b: ButtonState;
	// Click count
	c: number;
	// Timestamp
	ts: number;
};

const emptyState = {
	id: -1,
	x: 0,
	y: 0,
	b: BSReleased,
	c: 0,
	ts: 0,
};

type DelayedTap = {
	x: number;
	y: number;
	c: number; // Count
	ts: number; // Timestamp
	to: number; // Timeout
};

type PointerStates = {
	tc: Map<PointerID, PointerID>; // Touches
	c: Map<PointerID, PointerState>; // Current
	o: Map<PointerID, PointerState>; // Old
	dt?: DelayedTap; // Delayed tap
	cf?: number; // Clean Functino
};

const mapTouch = (s: PointerStates, id: PointerID): PointerID => {
	const v = s.tc.get(id);
	if (v !== undefined) return v;
	// From 0 find smallest unused number
	const ids = new Set(s.tc.values());
	for(let i = 0;; i++)
		if(!ids.has(i)) {
			s.tc.set(id, i);
			return i;
		}
};

const distSquare = (dx: number, dy: number) => dx * dx + dy * dy;

type HrmPaneProps = {
	children: JSXElement;
	t: HrmTransform;
	u?: Box2<Accessor<HrmTransform>, Setter<HrmTransform>>;

	onClick?: (x: number, y: number, count: number) => void;
	onDoubleClick?: (x: number, y: number) => void;
};

const HrmPane: Component<HrmPaneProps> = props => {
	let paneRef: HTMLDivElement | undefined, viewRef: HTMLDivElement | undefined;
	const [t, setT] = createSignal<HrmTransform>(props.t);
	const [pss, setPss] = createSignal<PointerStates>(
		{
			tc: new Map(),
			c: new Map(),
			o: new Map(),
		},
		{
			equals: false,
		},
	);

	if (props.u) {
		props.u[0] = t;
		props.u[1] = setT;
	}

	const activatePointer = (id: number, x: number, y: number) => {
		// Button Down / Touch Start event
		// Try to get old state
		const oPs = pss();
		const p: PointerState | undefined = oPs.o.get(id) ?? emptyState;
		oPs.o.delete(id);
		const now = Date.now();
		oPs.c.set(id, {
			...p,
			id,
			x,
			y,
			b: BSPressed,
			c: p.c === 1 && now - p.ts <= DOUBLE_CLICK_TIME ? 2 : 1,
			ts: now,
		});
		setPss(oPs);
	};

	const updatePointer = (id: number, x: number, y: number) => {
		// Move event
		const oPs = pss();
		const p = oPs.c.get(id);
		if (!p) return false;
		// Update pointers
		const dx = x - p.x, dy = y - p.y;
		if (p.b !== BSMoved && distSquare(dx, dy) < MOVE_THRESHOLD) {
			return false;
		}
		// Update view
		const firstTwo = [...oPs.c.keys()].slice(0, 2);
		const l = firstTwo.length;
		if(l === 1 && firstTwo[0] === id) {
			setT(s => ({
				...s,
				x: s.x + dx,
				y: s.y + dy,
			}));
		} 
		if(l === 2) {
			const fixed = oPs.c.get(
				firstTwo[firstTwo[0] === id ? 1 : 0],
			);
			if (fixed) {
				const newZ = Math.sqrt(
					distSquare(fixed.x - x, fixed.y - y) /
						distSquare(fixed.x - p.x, fixed.y - p.y),
				);
				setT(s => ({
					x: s.x + dx / 2,
					y: s.y + dy / 2,
					z: s.z * newZ,
				}));
			}
		}
		p.b = BSMoved;
		p.x = x;
		p.y = y;
		return true;
	};

	const deactivatePointer = (id: number) => {
		const ct = window.clearTimeout, st = window.setTimeout;
		// Button Up / Touch End event
		const oPs = pss();
		const p = oPs.c.get(id);
		oPs.c.delete(id);
		setPss(oPs);
		if (!p) return;
		oPs.o.set(id, p);
		const oldB = p.b;
		p.b = BSReleased;
		if (oldB === BSMoved) {
			p.c = 0;
			return;
		}
		if (p.c === 2) {
			props.onDoubleClick?.(p.x, p.y);
		} else if (oPs.dt || oPs.c.size > 0) {
			let cnt = 1;
			if (oPs.dt) {
				ct(oPs.dt.to);
				cnt = oPs.dt.c + 1;
			}
			oPs.dt = {
				x: p.x,
				y: p.y,
				c: cnt,
				ts: Date.now(),
				to: st(() => {
					const oPs = pss();
					const p = oPs.dt;
					if (!p) return;
					oPs.dt = undefined;
					props.onClick?.(p.x, p.y, p.c);
				}, MULTI_TAP_TIME),
			};
		} else {
			props.onClick?.(p.x, p.y, 1);
		}
		if (oPs.cf) ct(oPs.cf);
		oPs.cf = st(() => {
			const oPs = pss();
			oPs.o.clear();
			oPs.cf = undefined;
		}, DOUBLE_CLICK_TIME);
	};

	const cancelPointer = (id: number) => {
		// Cancel event
		if(pss().c.has(id)) {
			pss().c.delete(id);
			setPss(pss());
		}
	};

	const mapTouchEvent = (f: (id: number, x: number, y: number) => void, del: Boolean = false) => (e: TouchEvent) => {
		if(e.target !== paneRef) return;
		for (let touch of e.changedTouches) {
			f(mapTouch(pss(), touch.identifier), touch.clientX, touch.clientY);
			if(del) pss().tc.delete(touch.identifier);
		}
		e.preventDefault();
	};

	const eventHandlers: any = {
		mousedown: (e: MouseEvent) => {
			if (e.target === paneRef && e.button === 0) {
				activatePointer(-1, e.screenX, e.screenY);
				e.preventDefault();
			}
		},
		mousemove: (e: MouseEvent) => {
			if ((e.buttons & 1) !== 0 && updatePointer(-1, e.screenX, e.screenY)) {
				e.preventDefault();
			}
		},
		mouseup: (e: MouseEvent) => {
			if (e.button === 0) {
				deactivatePointer(-1);
			}
		},
		mouseleave: (e: MouseEvent) => {
			if (e.target === paneRef) {
				cancelPointer(-1);
			}
		},
		touchstart: mapTouchEvent(activatePointer),
		touchmove: mapTouchEvent(updatePointer),
		touchend: mapTouchEvent(deactivatePointer, true),
		touchcancel: mapTouchEvent(cancelPointer, true),
		wheel: (e: WheelEvent) => {
			e.preventDefault();
			const dz = Math.pow(2, -e.deltaY / 100);
			setT(s => ({
				x: s.x + (e.clientX - s.x) * (1 - dz),
				y: s.y + (e.clientY - s.y) * (1 - dz),
				z: s.z * dz,
			}));
		},
	};

	createEffect(() => {
		if (paneRef) {
			for (let k in eventHandlers) {
				paneRef.addEventListener(k, eventHandlers[k]);
			}
			return () => {
				if (paneRef)
					for (let k in eventHandlers) {
						paneRef.removeEventListener(k, eventHandlers[k]);
					}
			};
		}
	});

	return (
		<div ref={paneRef} class="hrm-pane">
			<div
				class="hrm-view"
				ref={viewRef}
				style={{
					transform: transformToStyle(t()),
				}}>
				{props.children}
			</div>
		</div>
	);
};

export default HrmPane;
