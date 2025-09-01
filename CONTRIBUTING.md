# Contributing to the Sitecore Cloud SDK

Want to contribute to the Sitecore Cloud SDK? Here’s what you need to know.

### Prerequisites

- node.js (Use an Active LTS version (cmd node -v to check your installed version)).
- npm (>= 9) installed (cmd npm -v to check your installed version).

### Developer tools

You can use any JavaScript/TypeScript IDE to contribute. We recommend using [Visual Studio](https://code.visualstudio.com/) Code because the SDK code contains recommended extensions for it.

### Get started

After forking the repository, run these commands:

- `npm install` # will install all the project dependencies

- `npm run build` # optional step to verify that all libraries can be built

#### Working on specific packages

The Sitecore Cloud SDK provides a variety of packages available on npm. This is an nx repository that hosts the source code of each package. Each package has its own tasks such as `lint`, `built` and `test`. To run a task for a package:

`nx run <scope>:<task>`

where scope can be `core`, `events`, `personalize` or `search`

and task can be `lint`, `build` , `test` or `stryker`.

Examples:

- `nx run search:test` # will execute unit tests for the search package

- `nx run personalize:build` # will build the personalize package

#### Available tasks

Every package includes the following tasks:

`lint`: Executes the linter analyzer.

`test`: Runs all the unit tests.

`build`: Builds the package in both CommonJS (`cjs`) and ESM (`esm`) formats.

### Developing

Because the Cloud SDK hosts multiple packages in the same repository, it’s important to work on one package at a time. To have a clean development process we encourage to work on one package at a time.

- Fork this repository to your own GitHub account and then clone it to your local device.

- Identify the package that will have the new feature (personalize, core , events, search).

- Create a new branch e.g. `git switch -c feature/<core | events | personalize | search>/my-cloudsdk-feature`

- Develop your changes. If applicable, write unit tests and make sure they all pass. Changes will only be merged if all tests pass.

- Run the unit tests locally using `nx run <core | events | personalize | search>:test`.

- After you finish developing and all unit tests pass, open a pull request targeting the `main` branch of the sitecore/sitecore-cloudsdk repository.
