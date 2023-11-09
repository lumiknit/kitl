// Array buffer helpers

export const str2arr = (str: string): Uint8Array => {
	return new TextEncoder().encode(str);
};

export const ab2str = (buf: ArrayBuffer) => new TextDecoder().decode(buf);

export const bufferToBase64 = async (buffer: ArrayBuffer) => {
	const base64url = await new Promise<string>(r => {
		const reader = new FileReader();
		reader.onload = () => {
			r(reader.result as string);
		};
		reader.readAsDataURL(new Blob([buffer]));
	});
	return base64url.slice(base64url.indexOf(",") + 1);
};

export const downloadArray = (filename: string, arr: Uint8Array) => {
	const blob = new Blob([arr], { type: "application/octet-stream" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
};
