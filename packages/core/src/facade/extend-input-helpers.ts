import type { CrossPolicySchema, ExtendInputFunction } from "./types.js";

/**
 * Helper function for the {@link CrossPolicyOpts.extendInput} option.
 * This function can be used to extend the input with static input.
 *
 * @param staticInput The static input to extend the input with.
 * @returns The extend input function.
 *
 * @example
 * const crossPolicy = createCrossPolicy({
 *   target: {
 *     name: "test",
 *     evaluate: evaluateFn,
 *   },
 *   schema: z.object({ foo: z.string() }),
 *   extendInput: withStaticInput({ bar: "baz" }),
 * });
 */
export const withStaticInput =
	<S extends CrossPolicySchema, I extends Record<string, any>>(
		staticInput: I,
	): ExtendInputFunction<S, I> =>
	({ input }) => ({ ...input, ...staticInput });
