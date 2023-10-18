import { test, expect } from "vitest";
import { ef } from "./functions";

test(`empty function`, () => {
	expect(() => ef()).toThrow("Empty function invoked");
});
