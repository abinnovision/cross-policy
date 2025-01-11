import { ZodError } from "zod";
import { generateError } from "zod-error";

import { createErrorMessageForCause } from "./utils.js";

/**
 * Represents an error that occurred during input validation.
 */
export class PolicyTargetValidationError extends Error {
	public static fromCause(cause: any): PolicyTargetValidationError {
		if (cause instanceof ZodError) {
			const message = generateError(cause);
			return new PolicyTargetValidationError(
				`PolicyTargetValidationError: ${message}`,
				cause,
			);
		} else {
			return new PolicyTargetValidationError(
				createErrorMessageForCause("PolicyTargetValidationError", cause),
				cause,
			);
		}
	}

	public constructor(message: string, cause?: any) {
		super(message);
		this.name = "PolicyTargetValidationError";
		this.cause = cause;
	}
}
