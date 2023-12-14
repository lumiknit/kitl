import { Component, For, JSXElement, createEffect } from "solid-js";

import { TbZoomIn, TbZoomInArea, TbZoomOut, TbZoomReset } from "solid-icons/tb";

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
	let viewRef: HTMLDivElement | undefined;
	let paneRef: HTMLDivElement | undefined;
	createEffect(() => {
		props.g.viewRef = viewRef;
	});
	const tr = (dx: number, dy: number, dz: number) =>
		props.g.transform[1](s => ({
			x: s.x * dz + dx,
			y: s.y * dz + dy,
			z: s.z * dz,
		}));

	type Control =
		| [JSXElement, () => any]
		| [JSXElement, () => any, HTMLButtonElement | undefined];
	const dz = 1.2;
	const controls: Control[] = [
		[
			<TbZoomIn />,
			() =>
				tr(
					((paneRef?.offsetWidth ?? 0) * (1 - dz)) / 2,
					((paneRef?.offsetHeight ?? 0) * (1 - dz)) / 2,
					dz,
				),
		],
		[
			<TbZoomOut />,
			() =>
				tr(
					((paneRef?.offsetWidth ?? 0) * (1 - 1 / dz)) / 2,
					((paneRef?.offsetHeight ?? 0) * (1 - 1 / dz)) / 2,
					1 / dz,
				),
		],
		[
			<TbZoomReset />,
			() => props.g.transform[1](() => ({ x: 0, y: 0, z: 1 })),
		],
		[<TbZoomInArea />, () => props.g.zoomAll()],
	];

	createEffect(() => {
		if (!paneRef) return;
		addEventListeners(
			{
				capture: true,
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
		for (const [, onClick, ref] of controls) {
			if (!ref) continue;
			addEventListeners(
				{
					capture: true,
					onClick: onClick,
				},
				ref,
			);
		}
	});

	return (
		<div ref={paneRef} class="no-user-select hrm-pane abs-parent">
			<div
				class="hrm-view"
				ref={viewRef}
				style={{
					transform: transformToStyle(props.g.transform[0]()),
				}}>
				{props.children}
			</div>
			<div class="hrm-pane-controls">
				<For each={controls}>
					{c => <button ref={c[2]}>{c[0]}</button>}
				</For>
			</div>
		</div>
	);
};

export default HrmPane;
