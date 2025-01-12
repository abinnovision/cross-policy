import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { buildPolicyTarget } from "./policy-target-builder.js";
import { createCrossPolicy } from "../facade/index.js";

describe("builder/policy-target-builder", () => {
	it("should create config-less policy target", async () => {
		const initFn = vi.fn(() => Promise.resolve({}));
		const evaluateFn = vi.fn(() => Promise.resolve(true));
		const createEvaluateFn = vi.fn(() => evaluateFn);

		const policyTarget = buildPolicyTarget({
			name: "test",
			init: initFn,
			createEvaluate: createEvaluateFn,
		});

		const crossPolicy = createCrossPolicy({
			target: policyTarget(),
			schema: z.object({ foo: z.string() }),
		});

		expect(initFn).not.toHaveBeenCalled();
		expect(createEvaluateFn).not.toHaveBeenCalled();

		await crossPolicy.evaluate({ foo: "bar" });

		expect(initFn).toHaveBeenCalledOnce();
		expect(createEvaluateFn).toHaveBeenCalledOnce();
		expect(evaluateFn).toHaveBeenCalledWith({ input: { foo: "bar" } });
	});

	it("should create policy target with config", async () => {
		const initFn = vi.fn((_: { prod: boolean }) => Promise.resolve({}));
		const evaluateFn = vi.fn(() => Promise.resolve(true));
		const createEvaluateFn = vi.fn(() => evaluateFn);

		const policyTarget = buildPolicyTarget({
			name: "test",
			init: initFn,
			createEvaluate: createEvaluateFn,
		});

		const crossPolicy = createCrossPolicy({
			target: policyTarget({ prod: true }),
			schema: z.object({ foo: z.string() }),
		});

		await crossPolicy.evaluate({ foo: "bar" });

		expect(initFn).toHaveBeenCalledWith({ prod: true });
		expect(createEvaluateFn).toHaveBeenCalledWith({});
		expect(evaluateFn).toHaveBeenCalledWith({ input: { foo: "bar" } });
	});
});
