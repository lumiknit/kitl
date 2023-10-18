import { Getter, Updater } from "@/common";
import { createSignal } from "solid-js";

export const createDelayedSignal = <T>(
	delay: number,
	value: T,
): [Getter<T>, Updater<T>] => {
	const [get, set] = createSignal<T>(value);
	let stored: T = value;
	let timeout: number | undefined;
	const wrapGet = () => {
		// Trigger to track
		get();
		// Return current value
		return stored;
	};
	const wrapSet: Updater<T> = u => {
		if (typeof u === "function") {
			// Update value
			stored = (u as (v: T) => T)(stored);
		} else {
			// Set value
			stored = u;
		}
		// If timeout is set, just wait.
		if (timeout !== undefined) {
			return;
		}
		// Set timeout
		timeout = window.setTimeout(() => {
			// Clear timeout
			timeout = undefined;
			// Set value
			set(stored as any);
		}, delay);
		//set(stored as any);
	};
	return [wrapGet, wrapSet];
};
