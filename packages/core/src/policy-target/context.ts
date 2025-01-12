/**
 * Describes an input to a policy evaluation.
 */
export type PolicyTargetInput = Record<string, unknown>;

export interface PolicyTargetEvaluationContext {
	/**
	 * The input to the policy evaluation.
	 */
	input: PolicyTargetInput;

	/**
	 * The static input to the policy evaluation.
	 * It's up to the policy how to merge this with the input.
	 */
	staticInput?: PolicyTargetInput;
}
