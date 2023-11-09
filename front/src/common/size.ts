export const bytesToString = (bytes: number): string => {
	const units = " KMGTPE";
	let i = 0;
	if (bytes < 1024) return `${bytes} B`;
	while (bytes >= 1024 && i < units.length) {
		bytes /= 1024;
		++i;
	}
	return `${bytes.toFixed(2)} ${units[i]}B`;
};
