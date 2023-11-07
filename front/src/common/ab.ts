// Array buffer helpers

export const str2arr = (str: string): Uint8Array => {
	const encoded = new TextEncoder().encode(str),
		arr = new Uint8Array(encoded.length);
	for (let i = 0; i < encoded.length; ++i) {
		arr[i] = encoded[i];
	}
	return arr;
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
