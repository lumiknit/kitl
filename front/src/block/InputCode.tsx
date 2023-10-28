import { Component, Ref, type JSX } from "solid-js";

type TATarget = {
	target: Element;
	currentTarget: HTMLTextAreaElement;
};

const C_NEWLINE = 10; // \n

const lineStart = (content: string, p: number) => {
	for (; p > 0 && content.charCodeAt(p - 1) !== C_NEWLINE; p--);
	return p;
};

const indentTextareaContent = (content: string, start: number, end: number) => {
	// Indent selection and return new value and range
	const s = lineStart(content, start),
		lines = content.substring(s, end).split("\n");
	return {
		value:
			content.substring(0, s) +
			"  " +
			lines.join("\n  ") +
			content.substring(end),
		start: start + 2,
		end: end + 2 * lines.length,
	};
};

const outdentTextareaContent = (
	content: string,
	start: number,
	end: number,
) => {
	// Outdent selection and return new value and start and end
	const s = lineStart(content, start);
	const lines = content.substring(s, end).split("\n");
	let newStart = start;
	let newEnd = end;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].startsWith("  ")) {
			if (i === 0) newStart -= 2;
			newEnd -= 2;
			lines[i] = lines[i].substring(2);
		} else if (lines[i].startsWith("\t")) {
			if (i === 0) newStart -= 1;
			newEnd -= 1;
			lines[i] = lines[i].substring(1);
		}
	}
	return {
		value:
			content.substring(0, s) + lines.join("\n") + content.substring(end),
		start: newStart,
		end: newEnd,
	};
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
	let hiddenRef: HTMLTextAreaElement | undefined;

	const resizeTextarea = (textarea: HTMLTextAreaElement) => {
		if (!props.autoresize) return;
		if (hiddenRef) {
			hiddenRef.value = textarea.value;
			hiddenRef.style.width = textarea.style.width;
			textarea.style.height = hiddenRef.scrollHeight + "px";
		}
	};

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
					target.value = indentResult.value;
					target.selectionStart = indentResult.start;
					target.selectionEnd = indentResult.end;
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
						value.substring(0, start) +
						"\n" +
						indent +
						value.substring(target.selectionEnd);
					target.selectionStart = start + 1 + indent.length;
					target.selectionEnd = start + 1 + indent.length;
				}
				break;
		}
		resizeTextarea(event.target as HTMLTextAreaElement);
	};

	const onInput: JSX.InputEventHandler<
		HTMLTextAreaElement,
		InputEvent
	> = event => {
		if (props.onInput) props.onInput(event);
	};

	const onChange: JSX.ChangeEventHandler<
		HTMLTextAreaElement,
		Event
	> = event => {
		if (props.onChange) props.onChange(event);
	};

	const onFocus: JSX.EventHandler<HTMLTextAreaElement, Event> = event => {
		resizeTextarea(event.currentTarget as HTMLTextAreaElement);
	};

	return (
		<div class="code-area">
			<textarea
				ref={props.ref}
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
