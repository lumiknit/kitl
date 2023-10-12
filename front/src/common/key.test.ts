import { test, expect } from "vitest";
import { longRandom, genID } from "./key";

test(`long random`, () => {
	expect(longRandom().length).toBeGreaterThanOrEqual(10);
});

test(`genID`, async () => {
	expect(genID().length).toBeGreaterThanOrEqual(10);
	const set = new Set();
	const N = 100;
	for (let i = 0; i < N; i++) {
		expect(set.has(genID())).toBe(false);
		set.add(genID());
		// Sleep
		await new Promise(resolve => setTimeout(resolve, 1));
	}
});
