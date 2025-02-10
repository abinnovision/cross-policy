import { createErrorMessageForCause } from "./utils.js";

import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Formats an issue for the ConfigxError.
 *
 * @param issue The issue to format.
 * @returns The formatted issue.
 */
const formatIssue = (issue: StandardSchemaV1.Issue): string => {
	let result = "";

	if ((issue.path?.length ?? 0) > 0) {
		// If there is a path, the issue is a nested issue.
		result += issue.path?.join(".") + ": ";
	} else {
		// If there is no path, the issue is a root issue.
		result += "@: ";
	}

	// Add the message.
	result += issue.message;

	return result;
};

/**
 * Represents an error that occurred during input validation.
 */
export class PolicyTargetValidationError extends Error {
	/**
	 * Creates a new PolicyTargetValidationError from a cause.
	 *
	 * @param cause The cause of the error.
	 */
	public static fromCause(cause: any): PolicyTargetValidationError {
		return new PolicyTargetValidationError(
			createErrorMessageForCause("PolicyTargetValidationError", cause),
			cause,
		);
	}

	/**
	 * Creates a new PolicyTargetValidationError from an array of schema issues.
	 *
	 * @param issues The schema issues.
	 */
	public static fromSchemaIssues(
		issues: readonly StandardSchemaV1.Issue[],
	): PolicyTargetValidationError {
		const messageHeader = "Invalid input:\n";

		const messageBody = issues.map((it) => `- ${formatIssue(it)}`).join("\n");

		return new PolicyTargetValidationError(`${messageHeader}${messageBody}`);
	}

	public constructor(message: string, cause?: any) {
		super(message);
		this.name = "PolicyTargetValidationError";
		this.cause = cause;
	}
}
