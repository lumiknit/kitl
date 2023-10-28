// Array buffer helpers

export const str2ab = (str: string) => {
	const encoded = new TextEncoder().encode(str),
		buf = new ArrayBuffer(encoded.length),
		bufView = new Uint8Array(buf);
	for (let i = 0; i < encoded.length; ++i) {
		bufView[i] = encoded[i];
	}
	return buf;
};

export const ab2str = (buf: ArrayBuffer) => new TextDecoder().decode(buf);
