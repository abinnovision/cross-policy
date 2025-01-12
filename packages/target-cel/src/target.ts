import { buildPolicyTarget, PolicyTargetPolicyError } from "@cross-policy/core";
import { evaluate, parse } from "cel-js";

interface CelTargetOptions {
	expression: string;
}

export const celPolicyTarget = buildPolicyTarget({
	name: "cel",
	init: (opts: CelTargetOptions) => {
		const expression = parse(opts.expression);
		if (!expression.isSuccess) {
			throw new Error(
				"Unable to parse expression:\n" + expression.errors.join("\n"),
			);
		}

		return { expression };
	},
	createEvaluate: (data) => {
		return async (ctx) => {
			const result = evaluate(data.expression.cst, ctx.input);
			if (typeof result !== "boolean") {
				throw new PolicyTargetPolicyError(
					`Expression did not evaluate to a boolean. Result was: \`${String(result)}\` (Type: ${typeof result})`,
				);
			}

			return result;
		};
	},
});
