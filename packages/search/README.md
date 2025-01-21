# search

This package provides browser- and server-side functions to ​build search experiences and capture events that occur inside them. Search experiences include search results pages, content and product recommendations, search suggestions, and more. The events that occur inside them are sent to Sitecore, and they help track the performance of your search experiences so you can refine and improve them.

## Installation

```bash
npm install @sitecore-cloudsdk/search
```

## Usage

1. Initialize the package using the `CloudSDK` function, available in the `core` package.
2. Request search content using the `getWidgetData` function.
3. Send events using the following functions:
   - `widgetView` - send a widget view event.
   - `widgetItemClick` - send widget item click event.
   - `widgetFacetClick` - send a facet click event.
   - `widgetNavigationClick` - send a navigation click event.
   - `widgetSuggestionClick` - send a suggestion click event.
   - `entityView` - send an entity view event.

The `search` package also requires that you install and initialize the `events` package.

## Code examples

Request search content on the browser side:

```tsx
import { Context, getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/browser';

const context = new Context({
  language: 'en',
  country: 'us'
});

// Create a widget request with the entity "product" and widget ID "rfkid_7":
const searchWidget = new SearchWidgetItem('product', 'rfkid_7', {
  query: {
    keyphrase: 'shoes'
  },
  content: {
    fields: ['name', 'price', 'brand', 'image_url']
  },
  limit: 10
});

// Call the getWidgetData function with the widget request and the context to retrieve the data:
const apiData = await getWidgetData(new WidgetRequestData([searchWidget]), context);
```

Request search content on the server side:

```ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { Context, getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/server';

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await CloudSDK(request, response, {
    /* Initialization settings. See `core` package code examples. */
  })
    .addEvents()
    .addSearch()
    .initialize();

  const context = new Context({
    language: 'en',
    country: 'us'
  });

  // Create a widget request with the entity "product" and widget ID "rfkid_7":
  const searchWidget = new SearchWidgetItem('product', 'rfkid_7', {
    query: {
      keyphrase: 'shoes'
    },
    content: {
      fields: ['name', 'price', 'brand', 'image_url']
    },
    limit: 10
  });

  // Call the getWidgetData function with the widget request and the context to retrieve the data:
  const apiData = await getWidgetData(new WidgetRequestData([searchWidget]), context);

  return response;
}
```

## Documentation

[Official Sitecore Cloud SDK documentation](https://doc.sitecore.com/xmc/en/developers/sdk/latest/cloud-sdk/index.html)
