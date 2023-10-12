import { test, expect } from "vitest";
import { dist, distSquare, transposeRect } from "./geometry";

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

test(`transposeRect`, () => {
	expect(transposeRect({ x: 1, y: 2, w: 3, h: 4 })).toEqual({
		x: 2,
		y: 1,
		w: 4,
		h: 3,
	});
	expect(transposeRect({ x: 1, y: 2, w: 3, h: 3 })).toEqual({
		x: 2,
		y: 1,
		w: 3,
		h: 3,
	});
});
