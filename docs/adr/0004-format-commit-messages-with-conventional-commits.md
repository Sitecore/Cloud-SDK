# 4. Format Commit Messages with conventional commits

Date: 2024-01-01

## Status

Accepted

## Context

There is a need to follow specific formatting to the commit messages

## Decision

In order to support specific formatting in commit messages.
We will use "The Conventional Commit" specification which helps us support this format.

---

The commit message should be structured as follows:

`<type>`[optional scope]: `<description>`

[optional body]

[optional footer(s)]

---

### Working Example:

feat: :sparkles: Add identity event

- remove common interface
- remove export @ identity events
- mapping at send

CDK-100-identity-events-to-identify-users-browsing-the-sites

## Consequences

In order to check the validity of the commit message. A git hook needed to be installed (husky).
This tool checks if the commit message follow the above guidelines and if all checks pass then the commit is forwarded to the github
else an alert prompts the user to correct the commit message.
