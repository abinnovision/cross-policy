import type {
	PolicyTarget,
	PolicyTargetFactory,
} from "../policy-target/index.js";

/**
 * Checks if the given value is a policy target factory.
 *
 * @param target The value to check.
 * @returns True if the value is a policy target factory, false otherwise.
 */
const isPolicyTargetFactory = (
	target: unknown,
): target is PolicyTargetFactory => {
	return typeof target === "function";
};

/**
 * Initializes the policy target.
 *
 * @param inputTarget The input target.
 * @returns The initialized policy target.
 */
export const initPolicyTarget = async (
	inputTarget: PolicyTarget | PolicyTargetFactory,
): Promise<PolicyTarget> => {
	let target: PolicyTarget;

	if (isPolicyTargetFactory(inputTarget)) {
		// If the target is a factory, call the create method to get the actual target instance.
		const result = inputTarget();

		// The create method can return a promise or the actual target instance.
		if (result instanceof Promise) {
			target = await result;
		} else {
			target = result;
		}
	} else {
		target = inputTarget;
	}

	return target;
};
