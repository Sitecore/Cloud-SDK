# events

© Sitecore Corporation A/S. All rights reserved. Sitecore© is a registered trademark of Sitecore Corporation A/S.

This package provides browser- and server-side functions to ​capture events in your app and send them to Sitecore. Events are for collecting behavioral and transactional data about your users as they interact with your app.

## Prerequisites

To use the Sitecore Cloud SDK, you need:

- A Next.js 13 app deployed on Sitecore XM Cloud.
- An XM Cloud Plus subscription.

## Installation

```bash
npm install @sitecore-cloudsdk/events
```

## Usage

1. Initialize the package using the `init()` function.
2. Send events using the following functions:
   - `pageView()` - send a VIEW event.
   - `identity()` - send an IDENTITY event.
   - `form()` - send a FORM event (browser-side only).
   - `event()` - send a custom event.

## Code examples

Capture and send a VIEW event from the browser side:

```ts
"use client";
import { useEffect } from "react";
import { init, pageView } from "@sitecore-cloudsdk/events/browser";

export default function Home() {
  useEffect(() => {
    initEvents();
  }, []);

  const initEvents = async () => {
    await init({
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || "",
      siteName: process.env.NEXT_PUBLIC_SITENAME || "",
      enableBrowserCookie: true,
    });

    console.log(`Initialized "@sitecore-cloudsdk/events/browser".`);
  };

  const sendPageViewEvent = async () => {
    let eventData: any = {
      channel: "WEB",
      currency: "EUR",
    };

    let extensionData: any = {
      customKey: "customValue",
    };

    await pageView(eventData, extensionData);

    console.log("Sent VIEW event.");
  };

  return (
    <div>
      <button onClick={sendPageViewEvent}>send VIEW event</button>
    </div>
  );
}
```

Capture and send a VIEW event from the server side:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { init, pageView } from "@sitecore-cloudsdk/events/server";

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

  console.log(`Initialized "@sitecore-cloudsdk/events/server".`);

  let eventData: any = {
    channel: "WEB",
    currency: "EUR",
  };

  let extensionData: any = {
    customKey: "customValue",
  };

  const pageViewRes = await pageView(eventData, req, extensionData);

  console.log("Sent VIEW event.");

  return res;
}
```

## Documentation

Coming soon.

### License

The Sitecore Cloud SDK uses the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).