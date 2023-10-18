export const parseKeyEvent = (event: KeyboardEvent): string => {
	let s = "";
	if (event.getModifierState("Control")) s += "C-";
	if (event.getModifierState("Alt")) s += "A-";
	if (event.getModifierState("Shift")) s += "S-";
	if (event.getModifierState("Meta")) s += "M-";
	return s + event.key;
};
