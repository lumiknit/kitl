export const parseKeyEvent = (event: KeyboardEvent): string =>
	[
		event.ctrlKey ? "C" : "",
		event.altKey ? "A" : "",
		event.shiftKey ? "S" : "",
		event.metaKey ? "M" : "",
		event.key,
	].join("-");
