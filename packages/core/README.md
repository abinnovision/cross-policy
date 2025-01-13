# @cross-policy/core

The core package provides the core functionality for creating callable policies.
It includes the `CrossPolicy` interface, which defines the contract for
evaluating policies, and the `createCrossPolicy` function, which is used to
create a callable policy.

## Getting Started

### Installation

To install the core package, run the following command:

```bash
yarn add @cross-policy/core
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
  target: {
    name: "simple-policy",
    evaluate: async (ctx) => {
      // Your policy logic here.
      return true;
    },
  },
  schema: z.object({ input: z.string() }),
});

const result = await crossPolicy.evaluate({ input: "test" });
```

This example demonstrates how to create a callable policy using a simple policy
target.

## Policy Target

A policy target is defined by an object with a `name` property and an `evaluate`
method. The `evaluate` method takes a `PolicyTargetEvaluationContext` object as
input and returns a promise that resolves to a boolean indicating whether the
policy is allowed or not.

### Builder Functions

To create a policy target, you can use the `buildPolicyTarget` function from the
`@cross-policy/core` package.

```typescript
import { createCrossPolicy, buildPolicyTarget } from "@cross-policy/core";

interface SimplePolicyTargetOptions {
  // Your policy target options here.
  path: string;
}

// Creates a function which creates a policy target using the given options.
const simplePolicyTarget = buildPolicyTarget({
  name: "simple-policy",
  init: async (opts: SimplePolicyTargetOptions) => {
    // Initialize the policy target here.
    return {
      path: opts.path,
    };
  },
  createEvaluate: (data) => {
    // Creates a function that evaluates the policy.
    // data is the result of the init function.
    return async (ctx) => {
      // Your policy logic here.
      return true;
    };
  },
});

const crossPolicy = createCrossPolicy({
  // Use the policy target function to create the policy target.
  target: simplePolicyTarget({ path: "path/to/policy" }),
  schema: z.object({ input: z.string() }),
});
```

## Helper Functions

The `@cross-policy/core` package also provides some helper functions for
creating callable policies.

### Extending Input

You can use the `withStaticInput` function to extend the input with static
values.

```typescript
import { createCrossPolicy, withStaticInput } from "@cross-policy/core";

const crossPolicy = createCrossPolicy({
  target: {
    name: "simple-policy",
    evaluate: async (ctx) => {
      // Your policy logic here.
      return true;
    },
  },
  schema: z.object({ input: z.string() }),
  // Always adds the "input" property to the input of the policy evaluation.
  extendInput: withStaticInput({ input: "test" }),
});
```
