import { test, expect } from "vitest";
import { str2arr, ab2str, clamp, ef } from "./primitive";

const str2ab2str2ab = (str: string) => {
	const ab = str2arr(str);
	const str2 = ab2str(ab);
	const ab2 = str2arr(str2);
	expect(ab2).toEqual(ab);
	expect(str2).toEqual(str);
};

test(`str2ab2str2ab`, () => {
	str2ab2str2ab("");
	str2ab2str2ab("Hello, world!");
	str2ab2str2ab("中文");
	str2ab2str2ab("적당한 한국어 문장\r\n두번째 줄");
	str2ab2str2ab("日本語の文章\r\n二行目");
});

test(`clamp`, () => {
	expect(clamp(0, 0, 0)).toEqual(0);
	expect(clamp(1, -1, 4)).toEqual(1);
	expect(clamp(0, 1, 2)).toEqual(1);
	expect(clamp(-3, 2, 5)).toEqual(2);
	expect(clamp(0, -5, -3)).toEqual(-3);
	expect(clamp(4, 1, 2)).toEqual(2);
	expect(clamp(0, -2, 2)).toEqual(0);
});

test(`empty function`, () => {
	expect(() => ef()).toThrow("Empty function invoked");
});
