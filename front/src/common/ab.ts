// Array buffer helpers

export const str2ab = (str: string) => {
	const te = new TextEncoder();
	const encoded = te.encode(str);
	const buf = new ArrayBuffer(encoded.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0; i < encoded.length; ++i) {
		bufView[i] = encoded[i];
	}
	return buf;
};

export const ab2str = (buf: ArrayBuffer) => {
	const td = new TextDecoder();
	return td.decode(buf);
};
