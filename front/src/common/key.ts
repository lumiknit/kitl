const randStr = (cutLen: number) => Math.random().toString(36).slice(cutLen);

export const shortRandom = () => randStr(7);

export const longRandom = () => randStr(2) + randStr(2);

export const timeString = () => {
	const now = new Date();
	return Math.round(
		now.getTime() / 1000 + now.getTimezoneOffset() * 60,
	).toString(36);
};

export const genID = () => {
	return `${timeString()}-${shortRandom()}`;
};
