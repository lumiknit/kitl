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
