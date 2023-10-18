import { test, expect } from "vitest";
import { newName, whitenName } from "./name";

test(`test1`, () => {
	const name = "My-awesome-name";
	const module = "test/main";
	const packed = newName(name, module);
	expect(packed.name).toEqual("My-awesome-name");
	expect(packed.module).toEqual("test/main");
});

test(`test1`, () => {
	const name = " guest__ print 30";
	const module = " test/main.dist boom  ";
	const packed = newName(name, module);
	expect(packed.name).toEqual("guest_print_30");
	expect(packed.module).toEqual("test/main.dist_boom");
});

test(`test1`, () => {
	const name = " guest__ print 30";
	const module = " test/main.dist boom  ";
	const packed = whitenName(newName(name, module));
	expect(packed.name).toEqual("guest print 30");
	expect(packed.module).toEqual("test/main.dist_boom");
});
