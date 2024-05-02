// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { WidgetItem, WidgetRequestData, getWidgetData, init } from '@sitecore-cloudsdk/search-api-client/server';
import { decorateFetch, resetFetch } from '../../../src/e2e-decorators/fetch-decorator';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const testID = searchParams.get('testID');

  if (!testID) return NextResponse.json({});

  let widget: WidgetItem;
  let widgetRequestData: WidgetRequestData;

  decorateFetch(testID as string);
  switch (testID) {
    case 'getWidgetDataFromAPIWithValidPayload':
      init({
        siteName: 'TestSite',
        sitecoreEdgeContextId: '83d8199c-2837-4c29-a8ab-1bf234fea2d1',
        sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io',
        userId: 'test'
      });

      widget = new WidgetItem('content', 'rfkid_7');
      widgetRequestData = new WidgetRequestData([widget]);

      await getWidgetData(widgetRequestData);
      break;
  }
  resetFetch();

  return NextResponse.json({});
}
