/**
 * Represents an error that occurred during policy evaluation.
 */
export class PolicyTargetEvaluationError extends Error {
	public constructor(message: string, cause?: any) {
		super(message);
		this.name = "PolicyTargetEvaluationError";
		this.cause = cause;
	}
}
