# cross-policy

Cross-Policy is a TypeScript library designed to simplify policy evaluation by
providing a **unified interface** for multiple policy target runtimes.
With support for defining policies in Open Policy Agent (OPA),
Common Expression Language (CEL), and more, Cross-Policy streamlines policy
evaluation and decision-making in applications.

**Key Features:**

- **Single Interface:** Interact with different policy engines through one
  consistent API.
- **Flexible and Extensible:** Add support for additional policy targets or
  customize behavior as needed.

## Getting Started

cross-policy is split into several packages, but to get started, you only need
to install the `@cross-policy/core` package.

### Installation

To install the library, run the following command:

```bash
yarn add cross-policy
```

### Usage

To create a callable policy, you need to create a `CrossPolicy` instance.
This instance provides a `evaluate` method that takes an input and returns a
promise that resolves to a boolean indicating whether the policy is allowed or
not.

```typescript
import { createCrossPolicy } from "@cross-policy/core";
import { opaWasmPolicyTarget } from "@cross-policy/target-opa-wasm";

const crossPolicy = createCrossPolicy({
  target: opaWasmPolicyTarget({
    // The path to the WASM policy file.
    policyPath: "path/to/policy.wasm",
  }),
  schema: z.object({ input: z.string() }),
});

const result = await crossPolicy.evaluate({ input: "test" });
```

This example demonstrates how to create a callable policy using the OPA WASM
policy target. The policy is defined in a WASM file and loaded at runtime.

## Available Policy Targets

This is just a collection of policy targets which are included in this
repository:

- [**Open Policy Agent (OPA) with WASM:**](packages/target-opa-wasm) Evaluate
  policies using the OPA WASM
  runtime.
- [**Open Policy Agent (OPA) with REST API:**](packages/target-opa-rest)
  Evaluate policies using the OPA
  REST API.
- [**Common Expression Language (CEL):**](packages/target-cel) Evaluate policies
  using the CEL (cel-js)
  library.
