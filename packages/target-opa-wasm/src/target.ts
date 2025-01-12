import * as opa from "@open-policy-agent/opa-wasm";
import * as fsp from "node:fs/promises";

import type { PolicyTargetFactory } from "@cross-policy/core";

interface OpaWasmPolicyTargetOptions {
	policyPath: string;
	policyResult?: string;
}

/**
 * Provides the policy to use based on the current config.
 */
async function getPolicy(path: string): Promise<opa.LoadedPolicy> {
	// Decide which policy to use.
	try {
		let policyFile: ArrayBuffer;
		policyFile = await fsp.readFile(path);

		return await opa.loadPolicy(policyFile);
	} catch (e) {
		throw new Error("Failed to load policy file");
	}
}

/**
 * Evaluates the given policy with the provided context.
 * The context must be a valid object, according to the schema.
 */
async function evaluatePolicy(
	policy: opa.LoadedPolicy,
	policyResult: string | undefined,
	input: Record<string, unknown>,
): Promise<boolean> {
	let evaluationResult;
	try {
		evaluationResult = policy.evaluate(input);
	} catch (error) {
		throw new Error("Failed to evaluate policy");
	}

	let result = evaluationResult[0]?.result;

	// The result must be a boolean. Undefined indicates an invalid policy.
	if (result === undefined) {
		throw new Error("Policy did not return a result");
	}

	result = result[policyResult ?? "allow"];

	if (result === undefined) {
		throw new Error("Policy result is undefined");
	}

	return result;
}

export const createOpaWasmPolicyTarget = (
	opts: OpaWasmPolicyTargetOptions,
): PolicyTargetFactory => {
	return async () => {
		const policy = await getPolicy(opts.policyPath);

		return {
			name: "opa-wasm",
			evaluate: async (ctx) => {
				const input = {
					input: ctx.input,
					static: ctx.staticInput ?? {},
				};

				return await evaluatePolicy(policy, opts.policyResult, input);
			},
		};
	};
};
