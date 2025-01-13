import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { ComparisonFilter, getWidgetData, SearchWidgetItem, WidgetRequestData } from '@sitecore-cloudsdk/search/server';
import { decorateFetch, resetFetch } from '../../../src/e2e-decorators/fetch-decorator';

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;

  const testID = searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  let widget: SearchWidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);

  switch (testID) {
    case 'getFilteredWidgetDataFromAPIWithValidPayload':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new SearchWidgetItem('content', 'rfkid_7');

      widget.filter = new ComparisonFilter('test', 'eq', 10);

      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);
      break;
  }
  resetFetch();

  return NextResponse.json({});
}
