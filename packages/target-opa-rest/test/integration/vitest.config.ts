import { defineProject } from "vitest/config";

export default defineProject({
	test: {
		name: "@cross-policy/target-opa-rest#integration",
		include: ["**/*.integration-spec.ts"],
		environment: "node",
		sequence: {
			hooks: "stack",
		},
	},
});
