# @cross-policy/target-opa-rest

The `@cross-policy/target-opa-rest` package provides a policy target for
evaluating policies using the Open Policy Agent (OPA) REST API.

## Getting Started

### Installation

To install the `@cross-policy/target-opa-rest` package, run the following
command:

```bash
yarn add @cross-policy/target-opa-rest
```

### Usage

To create a callable policy using the OPA REST target, you need to create a
`CrossPolicy` instance with the `opaRestPolicyTarget` function from the
`@cross-policy/target-opa-rest` package.

```typescript
import { createCrossPolicy } from "@cross-policy/core";
import { opaRestPolicyTarget } from "@cross-policy/target-opa-rest";
import { z } from "zod";

const crossPolicy = createCrossPolicy({
  target: opaRestPolicyTarget({
    opaUrl: "http://localhost:8181",
    opaPolicyPath: "main/allow",
  }),
  schema: z.object({ input: z.string() }),
});

const result = await crossPolicy.evaluate({ input: "test" });
```

This example demonstrates how to create a callable policy using the OPA REST
target.
