import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createCrossPolicy } from "./facade.js";

import type {
	PolicyTarget,
	PolicyTargetFactory,
} from "../policy-target/index.js";

const evaluateFn = vi.fn(() => Promise.resolve(true));

const syncDummyPolicyTarget: PolicyTarget = {
	name: "dummy-policy",
	evaluate: evaluateFn,
};

const asyncDummyPolicyTarget: PolicyTargetFactory = vi.fn(() =>
	Promise.resolve(syncDummyPolicyTarget),
);

describe("facade/facade", () => {
	afterEach(() => {
		evaluateFn.mockReset();
	});

	it("should initialize with sync policy target", async () => {
		const crossPolicy = createCrossPolicy({
			target: syncDummyPolicyTarget,
			schema: z.object({ foo: z.string() }),
		});

		await crossPolicy.evaluate({ foo: "bar" });

		expect(evaluateFn).toHaveBeenCalledWith({ input: { foo: "bar" } });
	});

	it("should initialize with factory policy target", async () => {
		const crossPolicy = createCrossPolicy({
			target: asyncDummyPolicyTarget,
			schema: z.object({ foo: z.string() }),
		});

		// The factory should not be called yet.
		expect(asyncDummyPolicyTarget).toHaveBeenCalledTimes(0);

		// Execute the policy multiple times to test policy target initialization.
		await crossPolicy.evaluate({ foo: "bar" });
		await crossPolicy.evaluate({ foo: "bar" });

		expect(asyncDummyPolicyTarget).toHaveBeenCalledOnce();
		expect(evaluateFn).toHaveBeenCalledWith({ input: { foo: "bar" } });
	});

	it("should provide static input with factory", async () => {
		const crossPolicy = createCrossPolicy({
			target: asyncDummyPolicyTarget,
			schema: z.object({ foo: z.string() }),
			createStaticInput: () => ({ bar: "baz" }),
		});

		await crossPolicy.evaluate({ foo: "bar" });

		expect(evaluateFn).toHaveBeenCalledWith({
			input: { foo: "bar" },
			staticInput: { bar: "baz" },
		});
	});

	it("should provide static input with static object", async () => {
		const crossPolicy = createCrossPolicy({
			target: syncDummyPolicyTarget,
			schema: z.object({ foo: z.string() }),
			createStaticInput: { bar: "baz" },
		});

		await crossPolicy.evaluate({ foo: "bar" });

		expect(evaluateFn).toHaveBeenCalledWith({
			input: { foo: "bar" },
			staticInput: { bar: "baz" },
		});
	});
});
