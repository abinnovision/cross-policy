import { createErrorMessageForCause } from "./utils.js";

/**
 * Represents an error that occurred during policy target initialization.
 */
export class PolicyTargetInitError extends Error {
	public static fromCause(cause: any): PolicyTargetInitError {
		return new PolicyTargetInitError(
			createErrorMessageForCause("PolicyTargetInitError", cause),
			cause,
		);
	}

	public constructor(message: string, cause?: any) {
		super(message);
		this.name = "PolicyTargetInitError";
		this.cause = cause;
	}
}
