# 2. Mutation testing using StrykerJS

Date: 2024-01-01

## Status

Accepted

## Context

There is a need to validate the unit tests in the repo.

## Decision

To validate the unit tests we use [StrykerJS](https://stryker-mutator.io/).

With the use of StrykerJS we can:

- identify weakly tested pieces of code (those for which mutants are not killed)
- identify weak tests (those that never kill mutants)
- compute the mutation score, the mutation score is the number of mutants killed / total number of mutants

## Consequences

During development and before pushing the code to the repo, we can run

```
npm run mutation-tests
```

to initiate the mutation testing.

This command is included in the CI pipeline.

> **_Note:_** To find more info for about the implementation read [how-to-mutation-testing-using-strykerjs](../how-to/0001-how-to-mutation-testing-using-strykerjs.md)
