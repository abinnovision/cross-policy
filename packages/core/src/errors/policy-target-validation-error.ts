/**
 * Represents an error that occurred during input validation.
 */
export class PolicyTargetValidationError extends Error {
	public constructor(message: string, cause?: any) {
		super(message);
		this.name = "PolicyTargetValidationError";
		this.cause = cause;
	}
}
