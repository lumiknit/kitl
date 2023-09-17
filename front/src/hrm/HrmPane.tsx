import {
	Accessor,
	Component,
	JSXElement,
	Setter,
	createSignal,
} from "solid-js";

import { Box2 } from "../common";
import { Position } from "./data";

export type HrmTransform = {
	x: number; // x offset
	y: number; // y offset
	z: number; // zoom
};

const transformToStyle = (t: HrmTransform) =>
	`translate(${t.x}px, ${t.y}px) scale(${t.z})`;

type HrmPaneProps = {
	children: JSXElement;
	t: HrmTransform;
	u?: Box2<Accessor<HrmTransform>, Setter<HrmTransform>>;
};

const HrmPane: Component<HrmPaneProps> = props => {
	let ref: HTMLDivElement | undefined = undefined;
	const [t, setT] = createSignal<HrmTransform>(props.t);
	if (props.u) {
		props.u[0] = t;
		props.u[1] = setT;
	}
	let state = t();

	let startMouse: Position | undefined;
	const handleMouseDown = (e: MouseEvent) => {
		if (ref === undefined) return;
		if (e.button !== 0) return;
		startMouse = {
			x: e.clientX,
			y: e.clientY,
		};
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (startMouse === undefined) return;
		if ((e.buttons & 1) === 0) return;
		const dx = e.clientX - startMouse!.x;
		const dy = e.clientY - startMouse!.y;
		if (ref) {
			const tt = t();
			state = {
				x: tt.x + dx,
				y: tt.y + dy,
				z: tt.z,
			};
			ref.style.transform = transformToStyle(state);
		}
	};
	const handleMouseUp = (e: MouseEvent) => {
		if (e.button !== 0) return;
		setT({ ...state });
	};

	let startTouch: Position | undefined = undefined;
	const handleTouchStart = (e: TouchEvent) => {
		if (ref === undefined) return;
		if (e.touches.length !== 1) return;
		startTouch = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY,
		};
	};
	const handleTouchMove = (e: TouchEvent) => {
		if (startTouch === undefined) return;
		if (e.touches.length !== 1) return;
		const dx = e.touches[0].clientX - startTouch!.x;
		const dy = e.touches[0].clientY - startTouch!.y;
		if (ref) {
			const tt = t();
			state = {
				x: tt.x + dx,
				y: tt.y + dy,
				z: tt.z,
			};
			ref.style.transform = transformToStyle(state);
		}
	};
	const handleTouchEnd = (e: TouchEvent) => {
		setT({ ...state });
	};
	const handleWheel = (e: WheelEvent) => {
		if (ref === undefined) return;
		e.preventDefault();
		const tt = t();
		const dz = Math.pow(2, -e.deltaY / 100);
		console.log(dz, state.z);
		state = {
			x: tt.x,
			y: tt.y,
			z: state.z * dz,
		};
		ref.style.transform = transformToStyle(state);
	};
	return (
		<div
			class="hrm-pane"
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onWheel={handleWheel}>
			<div class="hrm-view" ref={ref} style={transformToStyle(state)}>
				{props.children}
			</div>
		</div>
	);
};

export default HrmPane;
