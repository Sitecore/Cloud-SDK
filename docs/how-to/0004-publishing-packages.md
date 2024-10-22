# How to Publish All Libraries to NPM

Publishing should be done in coordination with all the stakeholders of our project.
Some of the steps require elevated permissions to be completed. It is highly advised to run this workflow in `dry run` first to check if everything goes according to our plans and the workflow is able to complete without any issues.

## Steps

### Trigger the Workflow:

1. Navigate to the "Actions" tab in the GitHub repository [cloud SDK actions](https://github.com/Sitecore-PD/sitecore.cloudsdk.js/actions) .
2. Find the workflow named "Publish all libraries to NPM".
3. Click on the "Run workflow" button.

### Configure Inputs:

- **Release Type**: Select the type of release from the dropdown. Options include:

  - `major`
  - `minor`
  - `patch`
  - `premajor`
  - `preminor`
  - `prepatch`
  - `prerelease`

  Some details about the release type options are:

  - If you need to release a normal version (non rc), then you need to pick one of `major`,`minor` or `patch` options no matter what is the current version.
  - If you need to release a release candidate (rc) and the current version is a normal one (non rc), then you need to pick one of `premajor`,`preminor` or `prepatch` options.
  - If you need to release a release candidate (rc) and the current version is a release candidate (rc) already, then you need to pick the `prerelease` option. This will increment the current version of the rc, eg if the current is 0.4.0-rc.**1** then the next one will be 0.4.0-rc.**2**

  This option has to be in coordination with the stakeholders.

- **Dry Run**: Choose whether to perform a dry run. The default is `true`.
- Click the "Run workflow" button to start the process.

### Merge the created Pull Request

After the publishing is complete we have to merge the Pull Request that was created by the process. This will include the updated package.json files, updated CHANGELOG.md files and git tags.

1. Click on the "Pull requests" tab or navigate to [Pull requests](https://github.com/Sitecore-PD/sitecore.cloudsdk.js/pulls).
2. Locate and open the Pull request with the title "Update libraries to <RELEASE_TYPE> version <RELEASED_VERSION>"
3. **IMPORTANT!!!** **Select the "Create a merge commit" option**
4. Click the button to merge

### After the completion

With all the previous steps completed you have successfully published the packages to [npmjs.com](https://www.npmjs.com/search?q=%40sitecore-cloudsdk) and created [github releases](https://github.com/Sitecore-PD/sitecore.cloudsdk.js/releases).

## Workflow Details

The workflow consists following but not limited jobs and steps:

### Job: `bump-and-build`

#### Steps:

- **Build all the publishable packages**

- **Clean CHANGELOG.md Files**

- **Bump Version for Each Package**:

  - Runs `npx nx run <package>:version` for each publishable package with the specified release type and other options.

- **Create a new branch for that will hold all the changes**

- **Run a script that updates the internal dependencies**

- **Create a github release**

- **Push the branch**

- **Create a Pull Request with all the changes**

### Job: `publish-npm-packages`

#### Steps:

- **Publish the packages**
- **Log the results**

### Job: `cleanup-github`

Runs the required cleanup processes if something went wrong in the workflow.

#### Steps:

- **Cleanup GitHub releases**
- **Close the Pull Request**

## Notes

- The `release_type` input determines the type of version bump (e.g., major, minor, patch).
- The `dryRun` input allows you to perform a dry run without making actual changes.

By following these steps, you can successfully publish all libraries to NPM using the defined GitHub Actions workflow.
