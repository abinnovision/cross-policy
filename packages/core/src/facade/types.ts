import type {
	PolicyTarget,
	PolicyTargetFactory,
} from "../policy-target/index.js";
import type { z } from "zod";

export interface CrossPolicyOpts<
	I extends z.SomeZodObject,
	S extends Record<string, any> = never,
> {
	/**
	 * The target to evaluate against.
	 */
	target: PolicyTarget | PolicyTargetFactory;

	/**
	 * Defines the schema of the input.
	 */
	schema: I;

	/**
	 * Defines the static input which will be added to every evaluation.
	 * This can be used to define configuration options for the policy.
	 */
	createStaticInput?: S | (() => S);
}

/**
 * Describes a callable policy.
 */
export interface CrossPolicy<I extends Record<string, any>> {
	/**
	 * Evaluates the policy against the target.
	 *
	 * @param input The input to the policy evaluation.
	 * @returns A promise that resolves to a boolean indicating whether the policy is allowed or not.
	 */
	evaluate: (input: I) => Promise<boolean>;
}
