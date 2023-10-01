import {
	Component,
	For,
	JSXElement,
	createEffect,
	createSignal,
} from "solid-js";

import { TbZoomIn, TbZoomOut, TbZoomReset } from "solid-icons/tb";

import "./HrmPane.scss";
import { Transform } from "./data";
import { State } from "./state";
import { distSquare } from "@/common";
import {
	BaseEvent,
	ClickEvent,
	addEventListeners,
} from "@/common/pointer-helper";

const transformToStyle = (t: Transform) =>
	`translate(${t.x}px, ${t.y}px) scale(${t.z})`;

type HrmPaneProps = {
	children: JSXElement;
	g: State;
	onClick: (e: ClickEvent) => void;
	onDoubleClick: (e: ClickEvent) => void;
	onLongPress: (e: BaseEvent) => void;
};

const HrmPane: Component<HrmPaneProps> = props => {
	let paneRef: HTMLDivElement | undefined;
	const [t, setT] = createSignal<Transform>({ x: 0, y: 0, z: 1 }),
		tr = (dx: number, dy: number, dz: number) =>
			setT(s => ({
				x: s.x * dz + dx,
				y: s.y * dz + dy,
				z: s.z * dz,
			}));
	props.g.transform[0] = t;
	props.g.transform[1] = setT;

	createEffect(() => {
		if (!paneRef) return;
		addEventListeners(
			{
				onClick: props.onClick,
				onDoubleClick: props.onDoubleClick,
				onLongPress: props.onLongPress,
				onDrag: e => {
					const pivot = e.pivot;
					if (pivot) {
						const newZ = Math.sqrt(
								distSquare(pivot.x - e.x, pivot.y - e.y) /
									distSquare(pivot.x - e.ox, pivot.y - e.oy),
							),
							mZ = newZ - 1;
						tr(
							(e.dx - (pivot.x + e.ox) * mZ) / 2,
							(e.dy - (pivot.y + e.oy) * mZ) / 2,
							newZ,
						);
					} else {
						tr(e.dx, e.dy, 1);
					}
				},
			},
			paneRef,
		);
	});

	type Control =
		| [JSXElement, () => any]
		| [JSXElement, () => any, HTMLButtonElement | undefined];
	const controls: Control[] = [
		[<TbZoomIn />, () => tr(0, 0, 1.1)],
		[<TbZoomOut />, () => tr(0, 0, 1 / 1.1)],
		[<TbZoomReset />, () => setT(s => ({ ...s, z: 1 }))],
	];

	createEffect(() => {
		if (!paneRef) return;
		paneRef.addEventListener(
			"wheel",
			e => {
				if (!paneRef) return;
				e.preventDefault();
				if (e.ctrlKey || e.metaKey) {
					// Zoom
					const newZ = Math.pow(2, e.deltaY / -100),
						rect = paneRef.getBoundingClientRect();
					tr(
						(e.clientX - rect.left) * (1 - newZ),
						(e.clientY - rect.top) * (1 - newZ),
						newZ,
					);
				} else {
					tr(-e.deltaX, -e.deltaY, 1);
				}
			},
			{ passive: false },
		);
		for (const [, , ref] of controls) {
			ref?.addEventListener("mousedown", e => {
				e.stopPropagation();
			});
		}
	});

	return (
		<div ref={paneRef} class="hrm-pane">
			<div class="hrm-pane-controls">
				<For each={controls}>
					{c => (
						<button ref={c[2]} onClick={c[1]}>
							{c[0]}
						</button>
					)}
				</For>
			</div>
			<div
				class="hrm-view"
				ref={props.g.viewRef}
				style={{
					transform: transformToStyle(t()),
				}}>
				{props.children}
			</div>
		</div>
	);
};

export default HrmPane;
