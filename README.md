# Sitecore Cloud SDK

The open-source Sitecore Cloud SDK lets JavaScript/TypeScript developers integrate capabilities from Sitecore CDP, Sitecore Personalize, and Sitecore Search into [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) and [JSS](https://doc.sitecore.com/xmc/en/developers/jss/22/jss-xmc/sitecore-javascript-services-sdk--jss--for-xm-cloud.html) applications connected to XM Cloud.

This repository manages the following Cloud SDK packages:

- `core` – a package for initializing the Cloud SDK and its other packages in your app. For more information, refer to the package [README](./packages/core/README.md).
- `events` - provides browser- and server-side functions to ​capture events in your app and send them to Sitecore. Events are for collecting behavioral data about your users as they interact with your app. For more information, refer to the package [README](./packages/events/README.md).
- `personalize` - provides browser- and server-side functions to run personalizations in your app. Personalization is for showing the most relevant content to your users. For more information, refer to the package [README](./packages/personalize/README.md).
- `search` - provides browser- and server-side functions to ​build search experiences and capture events that occur inside them. Search experiences include search results pages, content and product recommendations, search suggestions, and more. The events that occur inside them are sent to Sitecore, and they help track the performance of your search experiences so you can refine and improve them. For more information, refer to the package [README](./packages/search/README.md).
- `utils` – an internal package used by other Cloud SDK packages.

The packages expose uniform, type-safe, and developer-friendly APIs to speed up your development work.

## Getting started

### Use the SDK in your app

To use the Cloud SDK in your app, start by installing the required `core` package, and any other SDK package you want to use:

```bash
npm install @sitecore-cloudsdk/core
npm install @sitecore-cloudsdk/events
npm install @sitecore-cloudsdk/personalize
npm install @sitecore-cloudsdk/search
```

Then, initialize the SDK in a component. This example shows initialization in a Next.js App Router app:

```typescript
'use client';

import { useEffect } from 'react';
// Import SDK modules ->
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import '@sitecore-cloudsdk/personalize/browser';
import '@sitecore-cloudsdk/search/browser';

// <- Import SDK modules

export default function CloudSDKComponent() {
  useEffect(() => {
    CloudSDK({
      sitecoreEdgeContextId: '<YOUR_SITECORE_EDGE_CONTEXT_ID>',
      siteName: '<YOUR_SITE_NAME>',
      enableBrowserCookie: true
    })
      .addEvents() // Initialize the events package
      .addPersonalize({ enablePersonalizeCookie: true, webPersonalization: true }) // Initialize the personalize package
      .addSearch() // Initialize the search package
      .initialize(); // Run the initialization logic and set cookies
  }, []);

  return null;
}
```

Finally, add the component to your layout. This example shows this in a Next.js App Router app:

```typescript
import CloudSDKComponent from '../components/CloudSDK';

// ...

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CloudSDKComponent />
        {children}
      </body>
    </html>
  );
}
```

To continue development, refer to the official [Cloud SDK developer documentation](https://doc.sitecore.com/sdk/en/developers/latest/cloud-sdk/sitecore-cloud-sdk-for-javascript.html) and the [reference documentation](https://doc.sitecore.com/sdk/en/developers/latest/cloud-sdk/cloud-sdk-reference.html).

## [License](./LICENSE.md)

The Sitecore Cloud SDK is licensed under the Apache 2.0 License. Refer to the [LICENSE](./LICENSE.md) file in the repository root.

## Status

The Sitecore Cloud SDK is actively maintained.

## [Contributions](CONTRIBUTING.md)

We are very grateful to the community for contributing bug fixes and improvements. We welcome all efforts to evolve and improve the Sitecore Cloud SDK.

### [Code of Conduct](CODE_OF_CONDUCT.md)

Sitecore has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.
