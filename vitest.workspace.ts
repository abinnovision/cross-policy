import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	"packages/*/vitest.config.{m,}ts",
	"packages/*/test/integration/vitest.config.{m,}ts",
]);
