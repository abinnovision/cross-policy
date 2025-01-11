import type { PolicyTargetEvaluationContext } from "./context.js";

export interface PolicyTarget {
	/**
	 * Provides the human-readable name of the target. Preferably, this is written in dashed-case.
	 * Example: `opa-wasm`, `opa-rest`
	 *
	 * @returns The name of the target.
	 */
	get name(): string;

	/**
	 * Evaluates the policy against the target.
	 *
	 * @param context The context of the evaluation.
	 * @returns A promise that resolves to a boolean indicating whether the policy is allowed or not.
	 * @throws {PolicyTargetEvaluationError} If an error occurs during evaluation.
	 */
	evaluate: (context: PolicyTargetEvaluationContext) => Promise<boolean>;
}

/**
 * Describes a factory that creates a policy target instance.
 * This is useful for async initialization of the target.
 */
export type PolicyTargetFactory = () => Promise<PolicyTarget> | PolicyTarget;
