import { SearchWidgetItem, WidgetRequestData, getWidgetData, init } from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../../../src/e2e-decorators/fetch-decorator';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;

  const testID = searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  let widget: SearchWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);

  switch (testID) {
    case 'getSearchWidgetDataFromAPIWithValidPayload':
      await init(req, res, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      widget = new SearchWidgetItem('content', 'rfkid_7', {
        all: true,
        coverage: true,
        max: 50,
        sort: { name: 'count', order: 'asc' }
      });
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);
      break;
    case 'getSearchWidgetDataFromAPIWithValidPayloadUsingSetter':
      await init(req, res, {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      widget = new SearchWidgetItem('content', 'rfkid_7');
      widget.facet = {
        all: true,
        coverage: true,
        max: 50,
        sort: { name: 'count', order: 'asc' }
      };
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);
      break;
  }
  resetFetch();

  return NextResponse.json({});
}
