import type { Options } from "tsup";

const env = process.env.NODE_ENV;

export const tsup: Options = {
	splitting: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm"],
	bundle: false,
	minify: false,
	skipNodeModulesBundle: true,
	target: "es2020",
	outDir: "dist",
	entry: ["src/**/!(*.spec).ts"],
};
