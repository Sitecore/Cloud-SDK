# 3. Server set cookies from npm package

Date: 2024-01-01

## Status

Accepted

## Context

There is a need to alleviate ITP constraints.

## Decision

In order bypass the ITP constraints, we provide the developer with additional functionality for the creation of server set cookies.

With the use of the `init` function we can:

- check if there is a cookie in the page
- create a new cookie if it doesn't exists
- update the TTL of the cookie if it exists

## Consequences

By implementing the bellow code at the middleware of a NextJs app, the developer can set the cookie from the server.

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { init } from '@sitecore-cloudsdk/events/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  await init(
    {
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
      siteName: process.env.NEXT_PUBLIC_SITENAME || '',
      enableServerCookie: true,
    },
    req,
    res
  );

  return res;
}
```

> **_Note:_** In order for the above code to work the `enableServerCookie` property must be set to `true` as show in the bellow code.
