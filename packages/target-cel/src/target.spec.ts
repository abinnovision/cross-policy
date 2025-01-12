import { createCrossPolicy } from "@cross-policy/core";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { celPolicyTarget } from "./target.js";

describe("target-cel", () => {
	it('should create "cel" policy target', async () => {
		const cp = createCrossPolicy({
			target: celPolicyTarget({ expression: `sku == "sku-1"` }),
			schema: z.object({ sku: z.string() }),
		});

		expect(await cp.evaluate({ sku: "sku-1" })).toBe(true);
		expect(await cp.evaluate({ sku: "sku-2" })).toBe(false);
	});

	it("should throw exception on invalid expression", async () => {
		const cp = createCrossPolicy({
			target: celPolicyTarget({ expression: `"invalid"` }),
			schema: z.object({ sku: z.string() }),
		});

		await expect(cp.evaluate({ sku: "sku-1" })).rejects.toThrowError();
	});
});
