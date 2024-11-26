import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const testID = searchParams.get('testID');
  if (!testID) return NextResponse.json({});
  const response = NextResponse.next();
  switch (testID) {
    case 'initCloudSDKFromAPIWithInvalidTimeout':
      try {
        await CloudSDK(req, response, {
          cookieExpiryDays: 400,
          enableServerCookie: true,
          siteName: process.env.SITE_NAME || '',
          sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
          timeout: -10
        }).initialize();
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
      break;
    case 'initCloudSDKFromAPIWithSmallTimeout':
      try {
        await CloudSDK(req, response, {
          cookieExpiryDays: 400,
          enableServerCookie: true,
          siteName: process.env.SITE_NAME || '',
          sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
          timeout: 1
        }).initialize();
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
      break;
  }
  return NextResponse.json({});
}
