# events

This package provides browser- and server-side functions to ​capture events in your app and send them to Sitecore. Events are for collecting behavioral data about your users as they interact with your app.

## Prerequisites

To use the Sitecore Cloud SDK, you need an XM Cloud project. This project has to be created from the [XM Cloud foundation template](https://github.com/sitecorelabs/xmcloud-foundation-head) and deployed on XM Cloud.

The foundation template contains an XM Cloud JSS Next.js app. You use the Sitecore Cloud SDK in this app. To be able to use the Sitecore Cloud SDK, you need JSS version 21.6.0 or newer.

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

---

**NOTE**

These code examples illustrate how the Sitecore Cloud SDK works in a standalone Next.js app. In production, you implement Sitecore Cloud SDK functionality differently, in a JSS Next.js app. See code examples for that environment in the official documentation.

---

Capture and send a VIEW event from the browser side:

```ts
'use client';
import { useEffect } from 'react';
import { init, pageView } from '@sitecore-cloudsdk/events/browser';

export default function Home() {
  useEffect(() => {
    initEvents();
  }, []);

  const initEvents = async () => {
    await init({
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
      siteName: process.env.NEXT_PUBLIC_SITENAME || '',
      enableBrowserCookie: true,
    });

    console.log(`Initialized "@sitecore-cloudsdk/events/browser".`);
  };

  const sendPageViewEvent = async () => {
    await pageView();

    console.log('Sent VIEW event.');
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
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { init, pageView } from '@sitecore-cloudsdk/events/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  await init(req, res, {
    sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
    siteName: process.env.NEXT_PUBLIC_SITENAME || '',
    enableServerCookie: true,
  });

  console.log(`Initialized "@sitecore-cloudsdk/events/server".`);

  const pageViewRes = await pageView(req);

  console.log('Sent VIEW event.');

  return res;
}
```

## Documentation

[Official Sitecore Cloud SDK documentation](https://doc.sitecore.com/xmc/en/developers/sdk/latest/cloud-sdk/index.html)
