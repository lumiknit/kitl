export const bytesToString = (bytes: number): string => {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let i = 0;
	while (bytes >= 1024 && i < units.length) {
		bytes /= 1024;
		++i;
	}
	return `${bytes.toFixed(2)} ${units[i]}`;
};
