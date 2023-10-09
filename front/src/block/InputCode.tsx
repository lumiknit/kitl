import { Component, Ref, type JSX } from "solid-js";

const indentTextareaContent = (content: string, start: number, end: number) => {
	// Indent selection and return new value and range
	let s = start;
	while (s > 0 && content[s - 1] !== "\n") {
		s--;
	}
	const lines = content.substring(s, end).split("\n");
	const indentedLines = lines.map(line => "  " + line);
	const indentedValue = indentedLines.join("\n");
	const newValue =
		content.substring(0, s) + indentedValue + content.substring(end);
	return {
		value: newValue,
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
	let s = start;
	while (s > 0 && content[s - 1] !== "\n") {
		s--;
	}
	const lines = content.substring(s, end).split("\n");
	let newStart = start;
	let newEnd = end;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].startsWith("  ")) {
			if (i === 0) newStart -= 2;
			newEnd -= 2;
			lines[i] = lines[i].substring(2);
		}
	}
	const unindented = lines.join("\n");
	const newValue =
		content.substring(0, s) + unindented + content.substring(end);
	return {
		value: newValue,
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

	onChange?: JSX.ChangeEventHandler<HTMLTextAreaElement, Event>;
	onKeyDown?: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent>;
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
		if (props.onKeyDown) props.onKeyDown(event);
		switch (event.key) {
			// Tab key
			case "Tab":
				{
					event.preventDefault();
					const target = event.currentTarget;
					const start = target.selectionStart;
					const end = target.selectionEnd;
					const value = target.value;
					let indentResult;
					if (event.shiftKey) {
						// Unindent
						indentResult = outdentTextareaContent(
							value,
							start,
							end,
						);
					} else {
						// Indent
						indentResult = indentTextareaContent(value, start, end);
					}
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
					const end = target.selectionEnd;
					const value = target.value;
					// Get previous line indent
					let i = start - 1;
					while (i > 0 && value[i - 1] !== "\n") {
						i--;
					}
					// Find whitespace and copy it
					let j = i;
					while (
						j < start &&
						(value[j] === " " || value[j] === "\t")
					) {
						j++;
					}
					const indent = value.substring(i, j);
					const newValue =
						value.substring(0, start) +
						"\n" +
						indent +
						value.substring(end);
					target.value = newValue;
					target.selectionStart = start + 1 + indent.length;
					target.selectionEnd = start + 1 + indent.length;
				}
				break;
		}
		resizeTextarea(event.target as HTMLTextAreaElement);
	};

	const onChange: JSX.ChangeEventHandler<
		HTMLTextAreaElement,
		Event
	> = event => {
		if (props.onChange) props.onChange(event);
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
				onChange={onChange}
				onKeyDown={onKeyDown}
			/>
			<textarea
				ref={hiddenRef}
				disabled={true}
				class={`form-control ${
					props.class ?? ""
				} code-area-hidden no-pointer-events no-user-select`}
			/>
		</div>
	);
};

export default InputCode;
