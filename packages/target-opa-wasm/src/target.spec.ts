import {
	createCrossPolicy,
	PolicyTargetInitError,
	PolicyTargetPolicyError,
} from "@cross-policy/core";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { opaWasmPolicyTarget } from "./target.js";

const policyPath = path.join(
	import.meta.dirname,
	"../test/__fixtures__/allow_org_wide.wasm",
);
const policyPathInvalid = path.join(
	import.meta.dirname,
	"../test/__fixtures__/allow_org_wide_invalid.wasm",
);

describe("target-opa-wasm", () => {
	it('should create "opa-wasm" policy target', async () => {
		const cp = createCrossPolicy({
			target: opaWasmPolicyTarget({
				policyPath,
			}),
			schema: z.object({
				config: z.object({ organization: z.string().optional() }),
				caller: z.object({ owner: z.string() }),
				target: z.object({ owner: z.string() }),
			}),
		});

		expect(
			await cp.evaluate({
				config: { organization: "test-org" },
				caller: { owner: "test-org" },
				target: { owner: "test-org" },
			}),
		).toBe(true);

		expect(
			await cp.evaluate({
				config: { organization: "foo-org" },
				caller: { owner: "test-org" },
				target: { owner: "test-org" },
			}),
		).toBe(false);
	});

	it("should throw exception if policy does not exist", async () => {
		const cp = createCrossPolicy({
			target: opaWasmPolicyTarget({
				policyPath: policyPathInvalid,
			}),
			schema: z.object({}),
		});

		await expect(cp.evaluate({})).rejects.toThrowError(PolicyTargetInitError);
	});

	it("should throw exception if policy target is invalid", async () => {
		const cp = createCrossPolicy({
			target: opaWasmPolicyTarget({
				policyPath,
				policyResult: "invalid",
			}),
			schema: z.object({}),
		});

		await expect(cp.evaluate({})).rejects.toThrowError(PolicyTargetPolicyError);
	});
});
