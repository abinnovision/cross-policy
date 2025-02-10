import type {
	PolicyTarget,
	PolicyTargetFactory,
} from "../policy-target/index.js";
import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Describes the schema type for a CrossPolicy.
 * This is a StandardSchemaV1 schema, which restricts the output to a record.
 */
export type CrossPolicySchema = StandardSchemaV1<any, Record<string, any>>;

export interface ExtendInputContext<S extends CrossPolicySchema> {
	input: StandardSchemaV1.InferOutput<S>;
}

export type ExtendInputFunction<
	S extends CrossPolicySchema,
	I extends Record<string, any>,
> = (ctx: ExtendInputContext<S>) => I;

/**
 * Options for creating a CrossPolicy with the facade.
 */
export interface CrossPolicyOpts<
	S extends CrossPolicySchema,
	I extends Record<string, any> = StandardSchemaV1.InferInput<S>,
> {
	/**
	 * The target to evaluate against.
	 */
	target: PolicyTarget | PolicyTargetFactory;

	/**
	 * Defines the schema of the input.
	 */
	schema: S;

	/**
	 * Extends the input using a function.
	 */
	extendInput?: ExtendInputFunction<S, I>;
}

/**
 * Describes a callable policy.
 */
export interface CrossPolicy<I extends Record<string, any>> {
	/**
	 * Evaluates the policy against the target.
	 *
	 * @param input The input to the policy evaluation.
	 * @returns A promise that resolves to a boolean indicating whether the policy is allowed or not.
	 * @throws {PolicyTargetEvaluationError} If an error occurs during evaluation.
	 * @throws {PolicyTargetValidationError} If the input is invalid.
	 * @throws {PolicyTargetInitError} If the PolicyTarget fails to initialize.
	 */
	evaluate: (input: I) => Promise<boolean>;
}
