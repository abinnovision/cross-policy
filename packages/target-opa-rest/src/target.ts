import {
	buildPolicyTarget,
	PolicyTargetEvaluationError,
} from "@cross-policy/core";

interface OpaWasmPolicyTargetOptions {
	opaUrl: string;
	opaPolicyPath: string;
}

export const opaRestPolicyTarget = buildPolicyTarget({
	name: "opa-rest",
	init: async (opts: OpaWasmPolicyTargetOptions) => {
		const url = new URL(opts.opaUrl);
		url.pathname = `/v1/data/${opts.opaPolicyPath}`;

		return {
			resultUrl: url.toString(),
		};
	},
	createEvaluate: (data) => {
		return async (ctx) => {
			const response = await fetch(data.resultUrl, {
				method: "POST",
				body: JSON.stringify({ input: ctx.input }),
				headers: { "content-type": "application/json" },
			});

			if (!response.ok) {
				throw new PolicyTargetEvaluationError(
					`Failed to evaluate policy: ${response.statusText}`,
				);
			}

			const result = await response.json();
			if (result.result === undefined) {
				throw new PolicyTargetEvaluationError(
					`Policy did not return object with "result" property`,
				);
			}

			if (typeof result.result !== "boolean") {
				throw new PolicyTargetEvaluationError(
					`Policy result is not a boolean: \`${String(result.result)}\``,
				);
			}

			return result.result;
		};
	},
});
