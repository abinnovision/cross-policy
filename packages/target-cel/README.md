# @cross-policy/target-cel

The `@cross-policy/target-cel` package provides a policy target for evaluating
policies using the Common Expression Language (CEL).
This uses the [cel-js](https://www.npmjs.com/package/cel-js) library to evaluate
the policy.

For more information on **how to write CEL expressions**, please refer to the
[CEL documentation](https://github.com/google/cel-spec/blob/master/doc/intro.md).
Also make sure, check out
the [cel-js documentation](https://www.npmjs.com/package/cel-js)
for more information on which expressions are supported.

## Getting Started

### Installation

To install the `@cross-policy/target-cel` package, run the following command:

```bash
yarn add @cross-policy/target-cel
```

### Usage

To create a callable policy using the CEL target, you need to create a
`CrossPolicy` instance with the `celPolicyTarget` function from the
`@cross-policy/target-cel` package.

```typescript
import { createCrossPolicy } from "@cross-policy/core";
import { celPolicyTarget } from "@cross-policy/target-cel";
import { z } from "zod";

const crossPolicy = createCrossPolicy({
  target: celPolicyTarget({ expression: "input == 'test'" }),
  schema: z.object({ input: z.string() }),
});

const resultTest = await crossPolicy.evaluate({ input: "test" }); // true
const resultOther = await crossPolicy.evaluate({ input: "other" }); // false
```

This example demonstrates how to create a callable policy using the CEL target.
