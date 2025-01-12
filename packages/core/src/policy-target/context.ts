/**
 * Describes an input to a policy evaluation.
 */
export type PolicyTargetInput = Record<string, unknown>;

export interface PolicyTargetEvaluationContext {
	/**
	 * The input to the policy evaluation.
	 */
	input: PolicyTargetInput;
}
