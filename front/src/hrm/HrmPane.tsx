import {
	Accessor,
	Component,
	JSXElement,
	Setter,
	createEffect,
	createSignal,
} from "solid-js";

import { Box2 } from "../common";
import { s } from "../locales";

export type HrmTransform = {
	x: number; // x offset
	y: number; // y offset
	z: number; // zoom
};

const transformToStyle = (t: HrmTransform) =>
	`translate(${t.x}px, ${t.y}px) scale(${t.z})`;

export enum ButtonState {
	Released,
	Pressed,
	Moved,
}

type PointerID = number;

type PointerState = {
	id: PointerID;
	// Last position
	lx?: number;
	ly?: number;
	// Current position
	x: number;
	y: number;
	b: ButtonState;
	// Click count
	c: number;
	// Timestamp
	ts: number; 
};

type PointerStates = [
	Map<PointerID, PointerState>, // Current state
	Map<PointerID, PointerState>, // Old state
];

const takeTwoPointerIDs = (ps: Map<PointerID, PointerState>) => {
	const keys = ps.keys();
	let a = keys.next();
	if(a.done) return [];
	const ids = [a.value];
	a = keys.next();
	if(!a.done) ids.push(a.value);
	return ids;
};

const distSquare = (dx: number, dy: number) => dx * dx + dy * dy;

type HrmPaneProps = {
	children: JSXElement;
	t: HrmTransform;
	u?: Box2<Accessor<HrmTransform>, Setter<HrmTransform>>;
};

const HrmPane: Component<HrmPaneProps> = props => {
	let paneRef: HTMLDivElement | undefined = undefined;
	let viewRef: HTMLDivElement | undefined = undefined;
	const [t, setT] = createSignal<HrmTransform>(props.t);
	const [pss, setPss] = createSignal<PointerStates>([
		new Map(),
		new Map(),
	], {
		"equals": false,
	});

	if (props.u) {
		props.u[0] = t;
		props.u[1] = setT;
	}

	const activatePointer = (
		id: number,
		x: number,
		y: number,
	) => {
		// Button Down / Touch Start event
		// Try to get old state
		const oPs = pss();
		let p: PointerState | undefined = oPs[1].get(id);
		if(!p) {
			p = {
				id: id,
				x: 0,
				y: 0,
				b: ButtonState.Pressed,
				ts: 0,
				c: 0,
			};
			oPs[0].set(id, p);
		} else {
			oPs[1].delete(id);
		}
		// Update position
		p.x = x;
		p.y = y;
		p.lx = undefined;
		p.ly = undefined;
		const now = Date.now();
		p.c = now - p.ts > 1000 ? 1 : p.c + 1;
		p.ts = now;
		console.log(oPs);
		setPss(oPs);
	};

	const updatePointer = (
		id: number,
		x: number,
		y: number,
	) => {
		// Move event
		const oPs = pss();
		const p = oPs[0].get(id);
		if(!p) return false;
		// Update pointers
		const dx = x - p.x;
		const dy = y - p.y;
		console.log(x, p.x, y, p.y);
		if(p.b !== ButtonState.Moved && distSquare(dx, dy) < 4) {
			return false;
		}
		// Update view
		const firstTwo = takeTwoPointerIDs(oPs[0]);
		switch(firstTwo.length) {
			case 1: {
				const f = firstTwo[0];
				if(f === id) {
					setT((s) => ({
						...s,
						x: s.x + dx,
						y: s.y + dy,
					}));
				}
			} break;
			case 2: {
				const fixed = oPs[0].get(firstTwo[firstTwo[0] === id ? 1 : 0]);
				if(!fixed) break;
				const newZ = Math.sqrt(
					distSquare(fixed.x - x, fixed.y - y) /
					distSquare(fixed.x - p.x, fixed.y - p.y));
				setT((s) => ({
					x: s.x + (x - p.x) / 2,
					y: s.y + (y - p.y) / 2,
					z: s.z * newZ,
				}));
			} break;
		}
		p.b = ButtonState.Moved;
		p.x = x;
		p.y = y;
		return true;
	};

	const deactivatePointer = (
		id: number,
	) => {
		// Button Up / Touch End event
		const oPs = pss();
		const p = oPs[0].get(id);
		oPs[0].delete(id);
	};

	const handleMouseDown = (e: MouseEvent) => {
		if (e.target !== paneRef) return;
		if (e.button !== 0) return;
		activatePointer(-1, e.screenX, e.screenY);
		e.preventDefault();
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (e.target !== paneRef) return;
		if ((e.buttons & 1) === 0) return;
		if (updatePointer(-1, e.screenX, e.screenY)) {
			e.preventDefault();
		}
	};
	const handleMouseUp = (e: MouseEvent) => {
		if (e.button !== 0) return;
		deactivatePointer(-1);
	};
	const handleMouseLeave = (e: MouseEvent) => {
		if (e.target !== paneRef) return;
		deactivatePointer(-1);
	};
	const handleTouchStart = (e: TouchEvent) => {
		if (e.target !== paneRef) return;
		for (let touch of e.changedTouches) {
			activatePointer(touch.identifier, touch.clientX, touch.clientY);
		}
		e.preventDefault();
	};
	const handleTouchMove = (e: TouchEvent) => {
		e.preventDefault();
		for (let touch of e.changedTouches) {
			updatePointer(touch.identifier, touch.clientX, touch.clientY);
		}
	};
	const handleTouchEnd = (e: TouchEvent) => {
		for (let touch of e.changedTouches) {
			deactivatePointer(touch.identifier);
		}
		e.preventDefault();
	};
	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();
		const x = e.clientX;
		const y = e.clientY;
		const dz = Math.pow(2, -e.deltaY / 100);
		setT(s => ({
			x: s.x + (x - s.x) * (1 - dz),
			y: s.y + (y - s.y) * (1 - dz),
			z: s.z * dz,
		}));
	};

	createEffect(() => {
		paneRef?.addEventListener("wheel", handleWheel, { passive: false });
		paneRef?.addEventListener("touchstart", handleTouchStart, { passive: false });
		paneRef?.addEventListener("touchmove", handleTouchMove, { passive: false });
		paneRef?.addEventListener("touchend", handleTouchEnd, { passive: false });
		paneRef?.addEventListener("touchcancel", handleTouchEnd, { passive: false });
		return () => {
			paneRef?.removeEventListener("wheel", handleWheel);
			paneRef?.removeEventListener("touchstart", handleTouchStart);
			paneRef?.removeEventListener("touchmove", handleTouchMove);
			paneRef?.removeEventListener("touchend", handleTouchEnd);
			paneRef?.removeEventListener("touchcancel", handleTouchEnd);
		};
	});

	return (
		<div
			ref={paneRef}
			class="hrm-pane"
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}>
			<div
				class="hrm-view"
				ref={viewRef}
				style={{
					transform: transformToStyle(t())
				}}
			>
				{props.children}
			</div>
		</div>
	);
};

export default HrmPane;
