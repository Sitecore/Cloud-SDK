# How to use/configure mutation testing with StrykerJS

## Configuration

A stryker config file per package had to be created to support StrykerJS:

- A [stryker.config.js](../../packages/events/stryker.conf.js) file
  - Includes all the required configuration for StrykerJS

Scripts added to [package.json](../../package.json):

- "mutation-tests"
- "mutation-local"

## Usage

To run the mutation tests for the affected packages run

```
npm run mutation-tests
```

To run the mutation tests all the packages run

```
npm run mutation-local
```

> **_Note:_** The CI pipeline will fail if a mutation test fails.
