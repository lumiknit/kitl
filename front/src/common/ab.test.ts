import { test, expect } from "vitest";
import { str2ab, ab2str } from "./ab";

const str2ab2str2ab = (str: string) => {
	const ab = str2ab(str);
	const str2 = ab2str(ab);
	const ab2 = str2ab(str2);
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
