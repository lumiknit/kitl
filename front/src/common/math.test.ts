import { test, expect } from "vitest";
import { clamp } from "./math";

test(`clamp`, () => {
	expect(clamp(0, 0, 0)).toEqual(0);
	expect(clamp(1, -1, 4)).toEqual(1);
	expect(clamp(0, 1, 2)).toEqual(1);
	expect(clamp(-3, 2, 5)).toEqual(2);
	expect(clamp(0, -5, -3)).toEqual(-3);
	expect(clamp(4, 1, 2)).toEqual(2);
	expect(clamp(0, -2, 2)).toEqual(0);
});
