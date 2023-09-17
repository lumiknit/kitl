export type Values<T> = T | T[];

export const makeArray = <T>(
	value: undefined | Values<T>,
	defaultValue: T,
	length?: number,
): T[] => {
	if (value === undefined) {
		if (length === undefined) {
			return [defaultValue];
		}
		return Array(length).fill(defaultValue);
	} else if (Array.isArray(value)) {
		if (length === undefined || length < value.length) {
			return value;
		}
		return value.concat(Array(length - value.length).fill(defaultValue));
	} else {
		if (length === undefined) {
			return [value];
		}
		return Array(length).fill(value);
	}
};
