import { initPolicyTarget } from "./utils.js";
import { PolicyTargetEvaluationError } from "../errors/policy-target-evaluation-error.js";
import { PolicyTargetInitError } from "../errors/policy-target-init-error.js";
import { PolicyTargetPolicyError } from "../errors/policy-target-policy-error.js";
import { PolicyTargetValidationError } from "../errors/policy-target-validation-error.js";

import type {
	CrossPolicy,
	CrossPolicyOpts,
	CrossPolicySchema,
} from "./types.js";
import type { PolicyTarget } from "../policy-target/index.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Creates a callable policy.
 *
 * @param opts The options for the policy.
 * @returns The callable policy.
 */
export const createCrossPolicy = <
	I extends CrossPolicySchema,
	S extends Record<string, any> = never,
>(
	opts: CrossPolicyOpts<I, S>,
): CrossPolicy<StandardSchemaV1.InferInput<I>> => {
	// Holds the initialized target.
	// This is lazily initialized when the evaluate method is called.
	let target: PolicyTarget;

	return {
		evaluate: async (input: StandardSchemaV1.InferInput<I>) => {
			// Initialize the target if it is not already initialized.
			if (!target) {
				try {
					target = await initPolicyTarget(opts.target);
				} catch (err) {
					if (!(err instanceof PolicyTargetInitError)) {
						throw PolicyTargetInitError.fromCause(err);
					} else {
						throw err;
					}
				}
			}

			// Parse the given input using the schema and use the result of the validation.
			// It's possible that the schema transforms the input.
			let parseResult;
			try {
				// Validate the input against the schema.
				parseResult = await opts.schema["~standard"].validate(input);
			} catch (err) {
				throw PolicyTargetValidationError.fromCause(err);
			}

			// If there are issues, throw an error.
			if (parseResult.issues) {
				throw PolicyTargetValidationError.fromSchemaIssues(parseResult.issues);
			}

			let evaluationInput = parseResult.value;
			if (opts.extendInput) {
				evaluationInput = opts.extendInput({ input: evaluationInput });
			}

			try {
				return await target.evaluate({ input: evaluationInput });
			} catch (err) {
				if (
					!(err instanceof PolicyTargetEvaluationError) &&
					!(err instanceof PolicyTargetPolicyError)
				) {
					throw PolicyTargetEvaluationError.fromCause(err);
				} else {
					throw err;
				}
			}
		},
	};
};
