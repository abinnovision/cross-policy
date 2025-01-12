import type {
	PolicyTarget,
	PolicyTargetFactory,
} from "../policy-target/index.js";
import type { z } from "zod";

export interface ExtendInputContext<S extends z.SomeZodObject> {
	input: z.infer<S>;
}

export type ExtendInputFunction<
	S extends z.SomeZodObject,
	I extends Record<string, any>,
> = (ctx: ExtendInputContext<S>) => I;

/**
 * Options for creating a CrossPolicy with the facade.
 */
export interface CrossPolicyOpts<
	S extends z.SomeZodObject,
	I extends Record<string, any> = z.infer<S>,
> {
	/**
	 * The target to evaluate against.
	 */
	target: PolicyTarget | PolicyTargetFactory;

	/**
	 * Defines the schema of the input.
	 */
	schema: S;

	/**
	 * Extends the input using a function.
	 */
	extendInput?: ExtendInputFunction<S, I>;
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
	 * @throws {PolicyTargetEvaluationError} If an error occurs during evaluation.
	 * @throws {PolicyTargetValidationError} If the input is invalid.
	 * @throws {PolicyTargetInitError} If the PolicyTarget fails to initialize.
	 */
	evaluate: (input: I) => Promise<boolean>;
}
