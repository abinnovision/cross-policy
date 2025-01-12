import {
	PolicyTargetEvaluationError,
	PolicyTargetPolicyError,
} from "@cross-policy/core";
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
	return await opa.loadPolicy(await fsp.readFile(path));
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
		// Generic error when evaluating the policy.
		throw new PolicyTargetEvaluationError("Failed to evaluate policy", error);
	}

	let result = evaluationResult[0]?.result;

	// The result must be a boolean. Undefined indicates an invalid policy.
	if (result === undefined) {
		throw new PolicyTargetPolicyError("Policy did not return a result");
	}

	result = result[policyResult ?? "allow"];

	if (result === undefined) {
		throw new PolicyTargetPolicyError("Policy result is undefined");
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
				return await evaluatePolicy(policy, opts.policyResult, ctx.input);
			},
		};
	};
};
