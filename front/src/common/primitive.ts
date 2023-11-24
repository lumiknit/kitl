// Primitive helpers

// Array Buffer

export const str2arr = (str: string): Uint8Array =>
	new TextEncoder().encode(str);

export const ab2str = (buf: ArrayBuffer) => new TextDecoder().decode(buf);

export const bufferToBase64 = async (buffer: ArrayBuffer) => {
	const base64url = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
		reader.readAsDataURL(new Blob([buffer]));
	});
	return base64url.slice(base64url.indexOf(",") + 1);
};

export const downloadArray = (filename: string, arr: Uint8Array) => {
	const url = URL.createObjectURL(
		new Blob([arr], { type: "application/octet-stream" }),
	);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
};

// Math

export const clamp = (x: number, min: number, max: number) =>
	x < min ? min : x > max ? max : x;

// Data to String

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

// Functions

// empty function: Any -> Bottom
export const ef = (): never => {
	throw "Empty function invoked";
};
