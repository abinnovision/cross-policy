export const createErrorMessageForCause = (
	type: string,
	cause: any,
): string => {
	if (cause instanceof Error) {
		return `${cause.message}`;
	} else {
		return `${String(cause)}`;
	}
};
