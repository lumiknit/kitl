import { test, expect } from "vitest";
import { dist, distSquare } from "./geometry";

test(`dist`, () => {
	expect(dist(0, 0)).toEqual(0);
	expect(dist(1, 0)).toEqual(1);
	expect(dist(0, 1)).toEqual(1);
	expect(dist(1, 1)).toEqual(Math.sqrt(2));
	expect(dist(3, 4)).toEqual(5);
	expect(dist(-3, -4)).toEqual(5);
	expect(dist(3, -4)).toEqual(5);
	expect(dist(-3, 4)).toEqual(5);
	expect(dist(5, -12)).toEqual(13);
});

test(`distSquare`, () => {
	expect(distSquare(0, 0)).toEqual(0);
	expect(distSquare(1, 0)).toEqual(1);
	expect(distSquare(0, 1)).toEqual(1);
	expect(distSquare(1, 1)).toEqual(2);
	expect(distSquare(3, 4)).toEqual(25);
	expect(distSquare(-3, -4)).toEqual(25);
	expect(distSquare(3, -4)).toEqual(25);
	expect(distSquare(-3, 4)).toEqual(25);
	expect(distSquare(5, -12)).toEqual(169);
});
