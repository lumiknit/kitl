export const dateToShortString = (date: Date) => {
	// If date is same, return time
	const now = new Date();
	if (
		now.getDate() === date.getDate() &&
		now.getMonth() === date.getMonth() &&
		now.getFullYear() === date.getFullYear()
	) {
		return date.toLocaleTimeString();
	}
	return date.toLocaleDateString();
};
