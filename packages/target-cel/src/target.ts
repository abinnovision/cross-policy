import { PolicyTargetPolicyError } from "@cross-policy/core";
import { parse, evaluate } from "cel-js";

import type { PolicyTargetFactory } from "@cross-policy/core";

interface CelTargetOptions {
	expression: string;
}

export const createCelPolicyTarget = (
	opts: CelTargetOptions,
): PolicyTargetFactory => {
	return async () => {
		const parsedExpression = parse(opts.expression);
		if (!parsedExpression.isSuccess) {
			throw new Error(
				"Unable to parse expression:\n" + parsedExpression.errors.join("\n"),
			);
		}

		return {
			name: "opa-wasm",
			evaluate: async (ctx) => {
				const result = evaluate(parsedExpression.cst, ctx.input);
				if (typeof result !== "boolean") {
					throw new PolicyTargetPolicyError(
						"Expression did not evaluate to a boolean",
					);
				}

				return result;
			},
		};
	};
};
