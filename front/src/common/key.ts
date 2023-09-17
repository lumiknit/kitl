export const shortRandom = () => {
	return Math.random().toString(36).substring(7);
};

export const longRandom = () => {
	// Generate long random string
	const a = Math.random().toString(36).slice(2);
	const b = Math.random().toString(36).slice(2);
	return `${a}${b}`;
};

export const timeString = () => {
	const now = new Date();
	const offset = now.getTimezoneOffset() * 60 * 1000;
	const utcMS = now.getTime() + offset;
	const utcSec = Math.round(utcMS / 1000);
	return utcSec.toString(36);
};

export const genID = () => {
	return `${timeString()}-${shortRandom()}`;
};
