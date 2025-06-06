import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/server';
import { decorateFetch, resetFetch } from '../../../src/e2e-decorators/fetch-decorator';

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;

  const testID = searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  let widget: SearchWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);

  switch (testID) {
    case 'getSearchWidgetDataFromAPIWithValidPayload':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      widget = new SearchWidgetItem(
        'content',
        'rfkid_7',
        {
          facet: {
            all: true,
            coverage: true,
            max: 50,
            sort: { name: 'count', order: 'asc' },
            types: [
              {
                exclude: ['type'],
                filter: {
                  type: 'and',
                  values: [
                    'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0=',
                    'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiRG9jdW1lbnRhdGlvbiJ9'
                  ]
                },
                filteringOptions: 'Dynamic AND',
                keyphrase: 'test',
                max: 1,
                minCount: 1,
                name: 'type',
                sort: {
                  after: 'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiUHJvZHVjdCJ9',
                  name: 'text',
                  order: 'asc'
                }
              }
            ]
          },
          responseContext: true
        },
        ['source1', 'source2']
      );
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);
      break;
    case 'getSearchWidgetDataFromAPIWithValidPayloadUsingSetter':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch()
        .initialize();

      widget = new SearchWidgetItem('content', 'rfkid_7');
      widget.responseContext = true;
      widget.facet = {
        all: true,
        coverage: true,
        max: 50,
        sort: { name: 'count', order: 'asc' },
        types: [
          {
            exclude: ['type'],
            filter: {
              type: 'and',
              values: [
                'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0=',
                'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiRG9jdW1lbnRhdGlvbiJ9'
              ]
            },
            filteringOptions: 'Dynamic AND',
            keyphrase: 'test',
            max: 1,
            minCount: 1,
            name: 'type',
            sort: {
              after: 'facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiUHJvZHVjdCJ9',
              name: 'text',
              order: 'asc'
            }
          }
        ]
      };
      widget.sources = ['source1', 'source2'];
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);
      break;
  }
  resetFetch();

  return NextResponse.json({});
}
