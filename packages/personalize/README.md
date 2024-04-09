# personalize

This package provides browser- and server-side functions to run personalization in your app. Personalization is for showing the most relevant content to your users.

## Prerequisites

To use the Sitecore Cloud SDK, you need an XM Cloud project. This project has to be created from the [XM Cloud foundation template](https://github.com/sitecorelabs/xmcloud-foundation-head) and deployed on XM Cloud.

The foundation template contains an XM Cloud JSS Next.js app. You use the Sitecore Cloud SDK in this app. To be able to use the Sitecore Cloud SDK, you need JSS version 21.6.0 or newer.

## Installation

```bash
npm install @sitecore-cloudsdk/personalize
```

## Usage

1. Initialize the package using the `init()` function.
2. Run personalization using the `personalize()` function.

## Code examples

---

**NOTE**

These code examples illustrate how the Sitecore Cloud SDK works in a standalone Next.js app. In production, you implement Sitecore Cloud SDK functionality differently, in a JSS Next.js app. See code examples for that environment in the official documentation.

---

Run personalization from the browser side:

```ts
'use client';
import { useEffect } from 'react';
import { init, personalize } from '@sitecore-cloudsdk/personalize/browser';

export default function Home() {
  useEffect(() => {
    initPersonalize();
  }, []);

  const initPersonalize = async () => {
    await init({
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
      siteName: process.env.NEXT_PUBLIC_SITENAME || '',
      enableBrowserCookie: true,
    });

    console.log(`Initialized "@sitecore-cloudsdk/personalize/browser".`);
  };

  const runPersonalization = async () => {
    const personalizationData = {
      friendlyId: 'personalize_test',
    };

    await personalize(personalizationData);

    console.log('Ran personalization.');
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
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { init, personalize } from '@sitecore-cloudsdk/personalize/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  await init(req, res, {
    sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
    siteName: process.env.NEXT_PUBLIC_SITENAME || '',
    enableServerCookie: true,
  });

  console.log(`Initialized "@sitecore-cloudsdk/personalize/server".`);

  const personalizationData = {
    friendlyId: 'personalize_test',
  };

  await personalize(req, personalizationData);

  console.log('Ran personalization.');

  return res;
}
```

## Documentation

[Official Sitecore Cloud SDK documentation](https://doc.sitecore.com/xmc/en/developers/sdk/latest/cloud-sdk/index.html)
