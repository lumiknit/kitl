import { test, expect } from "vitest";
import {
	PathString,
	isAbsolutePath,
	joinPath,
	refinePath,
	splitPath,
} from "./path";

test("splitTest", () => {
	expect(splitPath("")).toEqual([]);
	expect(splitPath("a/b")).toEqual(["a", "b"]);
	expect(splitPath("a/b/")).toEqual(["a", "b"]);
	expect(splitPath("/a/b")).toEqual(["", "a", "b"]);
	expect(splitPath("hello\\world")).toEqual(["hello", "world"]);
	expect(splitPath("/./test/boom")).toEqual(["", "test", "boom"]);
	expect(splitPath("/./test/../boom")).toEqual(["", "boom"]);
	expect(splitPath("/./test/../../boom")).toEqual(["", "boom"]);
	expect(splitPath("/./test/../../../boom")).toEqual(["", "boom"]);
});

test("joinTest", () => {
	expect(joinPath([])).toEqual(".");
	expect(joinPath([""])).toEqual("/");
	expect(joinPath(["a", "b"])).toEqual("a/b");
	expect(joinPath(["", "a", "b"])).toEqual("/a/b");
	expect(joinPath(["hello", "world"])).toEqual("hello/world");
	expect(joinPath(["", "test", "boom"])).toEqual("/test/boom");
	expect(joinPath(["", "boom"])).toEqual("/boom");
});

const testRefine = (path: PathString, expected: PathString) => {
	const [p, chunks] = refinePath(path);
	expect(p).toEqual(expected);
	expect(chunks).toEqual(splitPath(expected));
};

test("refineTest", () => {
	testRefine("", ".");
	testRefine("a/b", "a/b");
	testRefine("/a\\bcd/../test", "/a/test");
});

test("isAbsolutePathTest", () => {
	expect(isAbsolutePath([])).toEqual(false);
	expect(isAbsolutePath([""])).toEqual(true);
	expect(isAbsolutePath(["a"])).toEqual(false);
	expect(isAbsolutePath(["", "a"])).toEqual(true);
});
