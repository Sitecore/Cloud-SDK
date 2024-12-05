# Step by step guide on adding an E2E test

## Step 1: Create a feature file

Create a new .feature file inside `integration-tests/<YOUR_E2E_APP>/src/integration` folder e.g., `integration-tests/events-e2e/src/integration/send-view-event.feature`. This is where you will add your [Gherkin](https://cucumber.io/docs/gherkin/) steps.

> Note: In case the tests you wish to add belong to an existing feature, you should not create a new file but add the tests to its respective .feature one instead.

### Write your Gherkin steps

Inside the feature file, you will need to write the BDD steps of your test cases.

A simple feature file contains the following:

**Feature** − Name of the feature under test, e.g., Feature: Developer sends a checkout event

**Scenario** / **Scenario Outline** − Name of the scenario we are testing. A feature file can contain multiple scenarios

**Given** − What needs to be done/loaded before we trigger an event/call the api

**When** − The actions needed to trigger the event

**Then** − The assertions that we need to make

**Examples** − In case of a Scenario Outline, we need to provide the examples

A simple example of a feature file:

```gherkin
Feature: Send clear cart event to an organization
Scenario: Developer creates a clear cart event
    Given the '/cart' page is loaded
    When the 'clearCart' event is triggered
    Then the event is sent with 'CLEAR_CART' type
```

> Note: Remember to add the proper tags like ‘@RestartServer-Middleware and ‘@Smoke-Test-Events tags to your features, scenarios or example tables to link them with the respective suites. You can find more info [here](https://stylelabs.atlassian.net/wiki/spaces/MAP/pages/4089282837/Cucumber+guide#Tags)

### Reuse steps and make steps reusable

When writing your steps, have reusability in mind. Remember to check if what you wish to do, an action or an assertion, is already added to our project and also consider of how something you add could be used by a future test.
Always check your common.ts file to find if your steps have already been defined so you can reuse them.

Let’s say we need to load the /checkout page with query parameters. Common.ts already contains a stepDef that visits a page with query parameters.

When the steps you wish to add to your tests aren’t already in common.ts, then you might consider parameterizing them, whenever applicable, by using the Cucumber features we have described in our [Cucumber guide](https://stylelabs.atlassian.net/wiki/spaces/MAP/pages/4089282837/Cucumber+guide).

## Step 2: Create your step definitions

Once you’re finished with the BDD layer of your tests, you can proceed with creating a new .ts file with the respective step definitions (stepDefs). In case you have only used steps that are already defined in common.ts, there is no need for a new stepDef file.

However, if you have introduced new steps to our code, to create their definitions, create a new .ts file, with the same name as your feature file, inside `integration-tests/<YOUR_E2E_APP>/src/integration/step_definitions` folder e.g., `integration-tests/events-e2e/src/integration/step_definitions/send-view-event.ts`

### Utilize custom commands

If you notice that a set of cypress commands, assertions etc are repeatedly used, consider of creating a custom command in `integration-tests/<YOUR_E2E_APP>/src/support/commands.ts` file.

```javascript
Cypress.Commands.add('waitForRequest', (alias) => {
  cy.wait(alias);
  cy.get(`${alias}.last`)
    .its('request')
    .then((request) => {
      return cy.wrap(request);
    });
});
```

For example, we have created the `cy.waitForRequest` custom command that includes all the commands needed for us to wait for an alias and access the request of its last occurrence. Now we can easily use this set of cy commands by simply calling cy.waitForRequest

## Step 3: Run your tests

It is essential to locally run your tests using the Cypress Runner UI so you can easily check for false positives and debug them if needed.

The command to run the tests is:

```
npx nx run <YOUR_E2E_APP>:<YOUR_TARGET> --watch
```

For example:

```
npx nx run integration-tests/events-e2e:events-e2e --watch
```

From the Cypress Runner you can choose which feature file’s tests you wish to run specifically.

You can learn more on running the tests and debugging [here](https://stylelabs.atlassian.net/wiki/spaces/MAP/pages/4091052241/Cypress+guide#Running-the-tests-locally).

## Step 4: Checks before and after your PR

### Regression testing

Once your feature’s tests have successfully passed and before you open a PR, make sure that all the other tests have passed too, so make sure you run the whole suite to check whether the changes you are introducing break any existing logic.

For example:

```
npx nx run integration-tests/events-e2e:events-smoke-test
```

Cypress will headlessly run all the available tests and will print the test results on your terminal.

### Flakiness on CI

When you open your PR, and every time you push a new commit to it, E2E tests will run again as part of our Github Checks. It is not uncommon for tests to have a flaky behaviour when running in the pipeline, even if they pass with flying colours when you run them locally. A flaky test is a test that fails under conditions that are not related to our logic e.g., your test makes an assertion on an API response from your backend service, the response is as we expected but Cypress command timed out before we where able to test it.

Please make sure you eliminate this flakiness as part of your implementation. Untreated flakiness will affect the whole team as manual retries of the workflows might be needed before merging future commits.

The fix for a flaky test could be as simple as wrapping an assertion with a cy.waitUntil, as the majority of the flaky tests we’ve seen in the past had to do with time out issues. You can find more on flakiness and its source [here](https://stylelabs.atlassian.net/wiki/spaces/MAP/pages/4091052241/Cypress+guide#Cypress-Asynchronous-Nature).

---

Find out more about our E2E test project [here](https://stylelabs.atlassian.net/wiki/spaces/MAP/pages/4088334343/Cypress+E2E+Test+Suite)
