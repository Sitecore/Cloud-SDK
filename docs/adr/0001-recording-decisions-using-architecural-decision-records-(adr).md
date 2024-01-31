# 1. Recording decisions using architecural decision records (ADR)

Date: 2024-01-01

## Status

Accepted

## Context

We need a way to document technical decisions in our code repo and within our solution

## Decision

We will use [ADRs](https://adr.github.io/) to capture our decisions using this template. Any ADR CLI tool may be used for this, like [adr-tools](https://github.com/npryce/adr-tools) or [adr-dotnet](https://github.com/endjin/dotnet-adr), or alternatively you may manually create the next decision file under \docs\adr.

> **_Note:_** Please ensure that you're following the template and file naming convention.

**What could be included as a decision record:**

- A non-trivial choice of framework/tool/library.
- A certain architectural approach (e.g. using microfrontends).
- The use of a certain coding pattern or approach.
- If in doubt, ask the team!

## Consequences

It will be easy to find records of previous technical decisions or decision threads (e.g. when reverting or amending a decision) without worrying about access to an external wiki or application.
