export type Values<T> = T | T[];

export const makeArray = <T>(
	value: undefined | Values<T>,
	defaultValue: T,
	length?: number,
): T[] => {
	const isLengthUnd = length === undefined;
	if (value === undefined) {
		if (isLengthUnd) {
			return [defaultValue];
		}
		return Array(length).fill(defaultValue);
	} else if (Array.isArray(value)) {
		if (isLengthUnd || length < value.length) {
			return value;
		}
		return value.concat(Array(length - value.length).fill(defaultValue));
	} else {
		if (isLengthUnd) {
			return [value];
		}
		return Array(length).fill(value);
	}
};
