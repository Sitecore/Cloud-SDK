import { WidgetItem, WidgetRequestData, getWidgetData } from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../../../src/e2e-decorators/fetch-decorator';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;

  const testID = searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  let widget: WidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);

  switch (testID) {
    case 'getWidgetDataFromAPIWithValidPayload':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new WidgetItem('content', 'rfkid_7');
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);
      break;
    case 'getWidgetDataFromAPIWithSearchPayload':
      await CloudSDK(req, res, {
        enableServerCookie: true,
        siteName: 'TestSite',
        sitecoreEdgeContextId: process.env.CONTEXT_ID as string
      })
        .addEvents()
        .addSearch({ userId: 'test' })
        .initialize();

      widget = new WidgetItem('content', 'rfkid_7');
      widget.groupBy = 'type';
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);
      break;
  }
  resetFetch();

  return NextResponse.json({});
}
