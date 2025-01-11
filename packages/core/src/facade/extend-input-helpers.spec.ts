import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { withStaticInput } from "./extend-input-helpers.js";
import { createCrossPolicy } from "./facade.js";

describe("facade/extend-input-helpers", () => {
	it("should extend input with static input", async () => {
		const evaluateFn = vi.fn(() => Promise.resolve(true));

		const crossPolicy = createCrossPolicy({
			target: {
				name: "test",
				evaluate: evaluateFn,
			},
			schema: z.object({ foo: z.string() }),
			extendInput: withStaticInput({ bar: "baz" }),
		});

		await crossPolicy.evaluate({ foo: "bar" });

		expect(evaluateFn).toHaveBeenCalledWith({
			input: { foo: "bar", bar: "baz" },
		});
	});
});
