# personalize

© Sitecore Corporation A/S. All rights reserved. Sitecore© is a registered trademark of Sitecore Corporation A/S.

This package provides browser- and server-side functions to run personalization in your app. Personalization is for showing the most relevant content to your users.

## Prerequisites

To use the Sitecore Cloud SDK, you need:

- A Next.js 13 app deployed on Sitecore XM Cloud.
- An XM Cloud Plus subscription.

## Installation

```bash
npm install @sitecore-cloudsdk/personalize
```

## Usage

1. Initialize the package using the `init()` function.
2. Run personalization using the `personalize()` function.

## Code examples

Run personalization from the browser side:

```ts
"use client";
import { useEffect } from "react";
import { init, personalize } from "@sitecore-cloudsdk/personalize/browser";

export default function Home() {
  useEffect(() => {
    initPersonalize();
  }, []);

  const initPersonalize = async () => {
    await init({
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || "",
      siteName: process.env.NEXT_PUBLIC_SITENAME || "",
      enableBrowserCookie: true,
    });

    console.log(`Initialized "@sitecore-cloudsdk/personalize/browser".`);
  };

  const runPersonalization = async () => {
    const personalizationData = {
      channel: "WEB",
      currency: "USD",
      friendlyId: "personalize_test",
      language: "EN",
    };

    await personalize(personalizationData);

    console.log("Ran personalization.");
  };

  return (
    <div>
      <button onClick={runPersonalization}>run personalization</button>
    </div>
  );
}
```

Run personalization from the server side:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { init, personalize } from "@sitecore-cloudsdk/personalize/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  await init(
    {
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || "",
      siteName: process.env.NEXT_PUBLIC_SITENAME || "",
      enableServerCookie: true,
    },
    req,
    res
  );

  console.log(`Initialized "@sitecore-cloudsdk/personalize/server".`);

  const personalizationData = {
    channel: "WEB",
    currency: "EUR",
    friendlyId: "personalize_test",
    language: "EN",
  };

  const personalizeRes = await personalize(personalizationData, req);

  console.log("personalizeResponse:", personalizeRes);

  return res;
}
```

## Documentation

Coming soon.

### License

The Sitecore Cloud SDK uses the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).