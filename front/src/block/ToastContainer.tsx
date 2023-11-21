import { Component, For, createSignal } from "solid-js";

import { Wrap, ef } from "@/common";

export enum ToastType {
	Success = 0,
	Warning = 1,
	Error = 2,
	Progress = 3,
}

const toastIcons = ["✅", "⚠️", "🚫", "⏳"];

export type ToastOptions = {
	type?: ToastType;
	ttl?: number;
};

export type ToastCreationFn = (message: string, options?: ToastOptions) => void;

const globalToastCreation: Wrap<ToastCreationFn> = [ef];
export const toast = (message: string, options?: ToastOptions) => {
	globalToastCreation[0](message, options);
};
export const toastSuccess = (message: string) =>
	toast(message, { type: ToastType.Success });
export const toastWarning = (message: string) =>
	toast(message, { type: ToastType.Warning });
export const toastError = (message: string) =>
	toast(message, { type: ToastType.Error });
export const toastProgress = (message: string) =>
	toast(message, { type: ToastType.Progress });

type ToastContainerProps = {
	creation?: Wrap<ToastCreationFn>;
};

type Toast = {
	id: number;
	type?: ToastType;
	class: string;
	message: string;
	timeout: number;
};

type ToastContainerState = {
	cnt: number;
	toasts: Toast[];
};

const ToastContainer: Component<ToastContainerProps> = props => {
	const creation = props.creation ?? globalToastCreation;
	const [state, setState] = createSignal<ToastContainerState>({
		cnt: 0,
		toasts: [],
	});
	creation[0] = (message: string, options?: ToastOptions) => {
		setState(s => {
			const toasts = s.toasts,
				id = s.cnt,
				ttl = Math.max(400, options?.ttl ?? 2000),
				timeout = (f: (ts: Toast[]) => Toast[], t: number) =>
					window.setTimeout(
						() => setState(s => ({ ...s, toasts: f(s.toasts) })),
						t,
					),
				to = timeout(
					toasts => toasts.filter(toast => toast.id !== id),
					ttl,
				);
			timeout(
				toasts =>
					toasts.map(toast =>
						toast.id === id
							? { ...toast, class: "toast-a-out" }
							: toast,
					),
				ttl - 200,
			);
			toasts.push({
				id,
				type: options?.type,
				class: "toast-a-in",
				message,
				timeout: to,
			});
			return {
				cnt: s.cnt + 1,
				toasts,
			};
		});
	};
	return (
		<div class="toast-container">
			<For each={state().toasts}>
				{item => (
					<div class={`toast ${item.class}`}>
						{item.type !== undefined
							? `${toastIcons[item.type]} `
							: ""}
						{item.message}
					</div>
				)}
			</For>
		</div>
	);
};

export default ToastContainer;
