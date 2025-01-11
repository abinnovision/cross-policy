import {
	buildPolicyTarget,
	PolicyTargetEvaluationError,
	PolicyTargetPolicyError,
} from "@cross-policy/core";
import * as opa from "@open-policy-agent/opa-wasm";
import * as fsp from "node:fs/promises";

interface OpaWasmPolicyTargetOptions {
	policyPath: string;
	policyResult?: string;
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

export const opaWasmPolicyTarget = buildPolicyTarget({
	name: "opa-wasm",
	init: async (opts: OpaWasmPolicyTargetOptions) => ({
		policy: await opa.loadPolicy(await fsp.readFile(opts.policyPath)),
		policyResult: opts.policyResult,
	}),
	createEvaluate: (data) => {
		return async (ctx) => {
			return await evaluatePolicy(data.policy, data.policyResult, ctx.input);
		};
	},
});
