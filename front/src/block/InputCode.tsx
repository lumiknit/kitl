import { create } from "domain";
import { Component, Ref, type JSX, createEffect } from "solid-js";

type TATarget = {
	target: Element;
	currentTarget: HTMLTextAreaElement;
};

const C_NEWLINE = 10; // \n

const lineStart = (content: string, p: number) => {
	while (p > 0 && content.charCodeAt(p - 1) !== C_NEWLINE) p--;
	return p;
};

const indentTextareaContent = (
	content: string,
	start: number,
	end: number,
): [string, number, number] => {
	// Indent selection and return new value and range
	const s = lineStart(content, start),
		lines = content.slice(s, end).split("\n");
	return [
		content.slice(0, s) + "  " + lines.join("\n  ") + content.slice(end),
		start + 2,
		end + 2 * lines.length,
	];
};

const outdentTextareaContent = (
	content: string,
	originalStart: number,
	originalEnd: number,
): [string, number, number] => {
	// Outdent selection and return new value and start and end
	const s = lineStart(content, originalStart);
	const lines = content.slice(s, originalEnd).split("\n");
	let start = originalStart,
		end = originalEnd;
	for (let i = 0; i < lines.length; i++) {
		const c = lines[i].startsWith("  ")
			? 2
			: lines[i].startsWith("\t")
			? 1
			: 0;
		if (i === 0) start -= c;
		end -= c;
		lines[i] = lines[i].slice(c);
	}
	return [
		content.slice(0, s) + lines.join("\n") + content.slice(originalEnd),
		start,
		end,
	];
};

export type CodeProps = {
	autofocus?: boolean;
	autoresize?: boolean;
	class?: string;
	disabled?: boolean;
	placeholder?: string;
	value?: string;
	ref?: Ref<HTMLTextAreaElement>;

	onChange?: (e: TATarget & Event) => boolean | undefined;
	onInput?: (e: TATarget & InputEvent) => boolean | undefined;
	onKeyDown?: (e: TATarget & KeyboardEvent) => boolean | undefined;
};

const InputCode: Component<CodeProps> = props => {
	let taRef: HTMLTextAreaElement | undefined;
	let hiddenRef: HTMLTextAreaElement | undefined;

	const hackRef = (ref: HTMLTextAreaElement) => {
		taRef = ref;
		if (typeof props.ref === "function") props.ref(ref);
	};

	const resizeTextarea = (textarea: HTMLTextAreaElement) => {
		if (!props.autoresize || !hiddenRef) return;
		hiddenRef.value = textarea.value;
		hiddenRef.style.width = textarea.style.width;
		textarea.style.height = hiddenRef.scrollHeight + "px";
	};

	createEffect(() => {
		if (props.autoresize) {
			resizeTextarea(taRef!);
		}
	});

	const onKeyDown: JSX.EventHandlerUnion<
			HTMLTextAreaElement,
			KeyboardEvent
		> = event => {
			if (props.onKeyDown && props.onKeyDown(event)) return;
			switch (event.key) {
				// Tab key
				case "Tab":
					{
						event.preventDefault();
						const target = event.currentTarget,
							indentResult = (
								event.shiftKey
									? outdentTextareaContent
									: indentTextareaContent
							)(
								target.value,
								target.selectionStart,
								target.selectionEnd,
							);
						target.value = indentResult[0];
						target.selectionStart = indentResult[1];
						target.selectionEnd = indentResult[2];
					}
					break;
				case "Enter":
					{
						// Enter key
						event.preventDefault();
						const target = event.currentTarget;
						const start = target.selectionStart;
						const value = target.value;
						// Get previous line indent
						const re = /[ \t]*/y;
						re.lastIndex = lineStart(value, start - 1);
						const indent = re.exec(value)?.[0] ?? "";
						target.value =
							value.slice(0, start) +
							"\n" +
							indent +
							value.slice(target.selectionEnd);
						target.selectionStart = target.selectionEnd =
							start + 1 + indent.length;
					}
					break;
			}
			resizeTextarea(event.target as HTMLTextAreaElement);
		},
		onInput: JSX.InputEventHandler<
			HTMLTextAreaElement,
			InputEvent
		> = event => {
			if (props.onInput) props.onInput(event);
		},
		onChange: JSX.ChangeEventHandler<
			HTMLTextAreaElement,
			Event
		> = event => {
			if (props.onChange) props.onChange(event);
		},
		onFocus: JSX.EventHandler<HTMLTextAreaElement, Event> = event => {
			resizeTextarea(event.currentTarget as HTMLTextAreaElement);
		};

	return (
		<div class="code-area">
			<textarea
				ref={hackRef}
				autofocus={props.autofocus}
				disabled={props.disabled}
				class={`form-control ${props.class ?? ""}`}
				placeholder={props.placeholder}
				value={props.value}
				onFocus={onFocus}
				onChange={onChange}
				onInput={onInput}
				onKeyDown={onKeyDown}
			/>
			<textarea
				ref={hiddenRef}
				disabled={true}
				class={`form-control abs-lt ${
					props.class ?? ""
				} code-area-hidden no-pointer-events no-user-select`}
			/>
		</div>
	);
};

export default InputCode;
