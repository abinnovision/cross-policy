import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		name: "@cross-policy/target-opa-rest#unit",
		include: ["src/**/*.spec.ts"],
		environment: "node",
		coverage: {
			provider: "v8",
			all: true,
			include: ["src/**/*.{ts,tsx}"],
			reporter: [["lcovonly"], "text"],
		},
	},
});
