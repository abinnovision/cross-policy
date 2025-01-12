/**
 * Represents an error that occurred during policy evaluation, due to an invalid/malfunctioning policy or configuration.
 */
export class PolicyTargetPolicyError extends Error {
	public constructor(message: string, cause?: Error) {
		super(message);
		this.name = "PolicyTargetPolicyError";
		this.cause = cause;
	}
}
