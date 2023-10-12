import { test, expect } from "vitest";
import { loadStrings, s, getLocale } from "./s";

test(`load strings`, async () => {
	await loadStrings("en");
	expect(getLocale()).toEqual("en");
	expect(s("not-existing-string.value")).toEqual("not-existing-string.value");
	expect(s("nodeEditor.toast.saved")).toEqual("Node data saved!");
});
