import type {
	PolicyTarget,
	PolicyTargetFactory,
} from "../policy-target/index.js";

interface BuildPolicyTargetOptions<I, C extends any | undefined = undefined> {
	name: string;
	init?: (config: C) => I | Promise<I>;
	createEvaluate: (initializeData: Awaited<I>) => PolicyTarget["evaluate"];
}

export const buildPolicyTarget = <I, C extends any | undefined = undefined>(
	opts: BuildPolicyTargetOptions<I, C>,
): ((...[config]: C extends undefined ? [] : [C]) => PolicyTargetFactory) => {
	return (...[config]) => {
		return async () => {
			const initializeData = await opts.init?.(config as C);

			return {
				name: opts.name,
				evaluate: opts.createEvaluate(initializeData as any),
			};
		};
	};
};
