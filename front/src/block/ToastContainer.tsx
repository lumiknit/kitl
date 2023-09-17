import { Component, For, createSignal } from "solid-js";

export enum ToastType {
	Success,
	Warning,
	Error,
}

const toastIcon = (type?: ToastType) => {
	switch (type) {
		case ToastType.Success:
			return "✅";
		case ToastType.Warning:
			return "⚠️";
		case ToastType.Error:
			return "🚫";
	}
};

export type ToastOptions = {
	type?: ToastType;
	seconds?: number;
};

export type ToastCreation = {
	run?: (message: string, options?: ToastOptions) => void;
};

let globalToastCreation: ToastCreation = {};
export const toast = (message: string, options?: ToastOptions) => {
	globalToastCreation.run?.(message, options);
};

type ToastContainerProps = {
	creation?: ToastCreation;
};

type Toast = {
	id: number;
	type?: ToastType;
	class: string;
	message: string;
	timeout: number;
};

type ToastContainerState = {
	counter: number;
	toasts: Toast[];
};

const ToastContainer: Component<ToastContainerProps> = props => {
	const creation = props.creation ?? globalToastCreation;
	const [state, setState] = createSignal<ToastContainerState>({
		counter: 0,
		toasts: [],
	});
	creation.run = (message: string, options?: ToastOptions) => {
		setState(s => {
			let ttl = options?.seconds ?? 2;
			if (ttl < 0.2) {
				ttl = 0.2;
			}
			const toasts = s.toasts;
			const id = s.counter;
			const timeout = window.setTimeout(() => {
				setState(s => ({
					...s,
					toasts: s.toasts.filter(toast => toast.id !== id),
				}));
			}, ttl * 1000);
			window.setTimeout(
				() => {
					setState(s => ({
						...s,
						toasts: s.toasts.map(toast =>
							toast.id === id
								? {
										...toast,
										class: "toast-animation-out",
								  }
								: toast,
						),
					}));
				},
				ttl * 1000 - 100,
			);
			console.log(options?.type);
			toasts.push({
				id,
				type: options?.type,
				class: "toast-animation-in",
				message,
				timeout,
			});
			return {
				counter: s.counter + 1,
				toasts,
			};
		});
	};
	return (
		<div class="toast-container">
			<For each={state().toasts}>
				{item => (
					<div class={`toast ${item.class}`}>
						{toastIcon(item.type)}
						{item.message}
					</div>
				)}
			</For>
		</div>
	);
};

export default ToastContainer;
