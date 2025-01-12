/**
 * Represents an error that occurred during policy target initialization.
 */
export class PolicyTargetInitError extends Error {
	public constructor(message: string, cause?: any) {
		super(message);
		this.name = "PolicyTargetInitError";
		this.cause = cause;
	}
}
