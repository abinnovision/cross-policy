import { initPolicyTarget } from "./utils.js";
import { PolicyTargetEvaluationError } from "../errors/policy-target-evaluation-error.js";
import { PolicyTargetInitError } from "../errors/policy-target-init-error.js";
import { PolicyTargetPolicyError } from "../errors/policy-target-policy-error.js";
import { PolicyTargetValidationError } from "../errors/policy-target-validation-error.js";

import type { CrossPolicy, CrossPolicyOpts } from "./types.js";
import type { PolicyTarget } from "../policy-target/index.js";
import type { z } from "zod";

/**
 * Creates a callable policy.
 *
 * @param opts The options for the policy.
 * @returns The callable policy.
 */
export const createCrossPolicy = <
	I extends z.SomeZodObject,
	S extends Record<string, any> = never,
>(
	opts: CrossPolicyOpts<I, S>,
): CrossPolicy<z.infer<I>> => {
	// Holds the initialized target.
	// This is lazily initialized when the evaluate method is called.
	let target: PolicyTarget;

	return {
		evaluate: async (input: z.infer<I>) => {
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

			let parsedInput;
			try {
				// Validate the input against the schema.
				parsedInput = await opts.schema.parseAsync(input);
			} catch (err) {
				throw PolicyTargetValidationError.fromCause(err);
			}

			let evaluationInput = parsedInput;
			if (opts.extendInput) {
				evaluationInput = opts.extendInput({ input });
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
