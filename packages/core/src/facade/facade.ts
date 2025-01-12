import { initPolicyTarget } from "./utils.js";

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

	// Holds the static input.
	let staticInput: S;

	if (opts.createStaticInput) {
		if (typeof opts.createStaticInput === "function") {
			staticInput = opts.createStaticInput();
		} else {
			staticInput = opts.createStaticInput;
		}
	}

	return {
		evaluate: async (input: z.infer<I>) => {
			// Initialize the target if it is not already initialized.
			if (!target) {
				target = await initPolicyTarget(opts.target);
			}

			try {
				// Validate the input against the schema.
				await opts.schema.parseAsync(input);
			} catch (err) {
				// TODO: Handle validation errors.
				throw new Error("Invalid input");
			}

			return await target.evaluate({ input, staticInput });
		},
	};
};
