import {
	createCrossPolicy,
	PolicyTargetEvaluationError,
} from "@cross-policy/core";
import * as path from "node:path";
import { GenericContainer, Wait } from "testcontainers";
import { beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import { opaRestPolicyTarget } from "../../../src/index.js";

describe("target-opa-rest", () => {
	let opaUrl: string;

	beforeAll(async () => {
		const container = await new GenericContainer("openpolicyagent/opa:1.0.0")
			.withExposedPorts(8181)
			.withCommand([
				"run",
				"--server",
				"--addr=http://0.0.0.0:8181",
				"/policies",
			])
			.withBindMounts([
				{
					source: path.join(import.meta.dirname, "../../__fixtures__"),
					target: "/policies",
				},
			])
			.withWaitStrategy(Wait.forLogMessage("Initializing server"))
			.start();

		opaUrl = `http://localhost:${container.getMappedPort(8181)}`;

		return () => container.stop();
	});

	it("should evaluate policy", async () => {
		const cp = createCrossPolicy({
			target: opaRestPolicyTarget({
				opaUrl,
				opaPolicyPath: "allow_org_wide/allow",
			}),
			schema: z.object({
				config: z.object({ organization: z.string().optional() }),
				caller: z.object({ owner: z.string() }),
				target: z.object({ owner: z.string() }),
			}),
		});

		expect(
			await cp.evaluate({
				config: { organization: "test-org" },
				caller: { owner: "test-org" },
				target: { owner: "test-org" },
			}),
		).toBe(true);

		expect(
			await cp.evaluate({
				config: { organization: "invalid-org" },
				caller: { owner: "test-org" },
				target: { owner: "test-org" },
			}),
		).toBe(false);
	});

	it("should throw exception if the policy path does not point to var", async () => {
		const cp = createCrossPolicy({
			target: opaRestPolicyTarget({
				opaUrl,
				opaPolicyPath: "allow_org_wide",
			}),
			schema: z.object({}),
		});

		await expect(cp.evaluate({})).rejects.toThrowError(
			PolicyTargetEvaluationError,
		);
	});
});
