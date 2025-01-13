# @cross-policy/target-opa-wasm

The `@cross-policy/target-opa-wasm` package provides a policy target for
evaluating policies using the Open Policy Agent (OPA) WASM runtime.

## Getting Started

### Installation

To install the `@cross-policy/target-opa-wasm` package, run the following
command:

```bash
yarn add @cross-policy/target-opa-wasm
```

### Usage

To create a callable policy using the OPA WASM target, you need to create a
`CrossPolicy` instance with the `opaWasmPolicyTarget` function from the
`@cross-policy/target-opa-wasm` package.

```typescript
import { createCrossPolicy } from "@cross-policy/core";
import { opaWasmPolicyTarget } from "@cross-policy/target-opa-wasm";
import { z } from "zod";

const crossPolicy = createCrossPolicy({
  target: opaWasmPolicyTarget({
    policyPath: "path/to/policy.wasm",
  }),
  schema: z.object({ input: z.string() }),
});

const result = await crossPolicy.evaluate({ input: "test" });
```

This example demonstrates how to create a callable policy using the OPA WASM
target.
