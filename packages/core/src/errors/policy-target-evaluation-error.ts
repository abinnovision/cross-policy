import { createErrorMessageForCause } from "./utils.js";

/**
 * Represents an error that occurred during policy evaluation.
 */
export class PolicyTargetEvaluationError extends Error {
	public static fromCause(cause: any): PolicyTargetEvaluationError {
		return new PolicyTargetEvaluationError(
			createErrorMessageForCause("PolicyTargetEvaluationError", cause),
			cause,
		);
	}

	public constructor(message: string, cause?: any) {
		super(message);
		this.name = "PolicyTargetEvaluationError";
		this.cause = cause;
	}
}
