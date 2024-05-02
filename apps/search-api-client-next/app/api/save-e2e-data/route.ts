// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { existsSync, readFileSync, writeFileSync } from 'fs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  const testID: string = requestBody.testID;

  const dataFilePath = path.resolve(
    path.join('..', 'search-api-client-e2e', 'src', 'fixtures', 'local', 'fetchData.json')
  );
  const body = requestBody.init.body;
  const headers = requestBody.init.headers;
  const url = requestBody.url;
  let fileData: Record<string, unknown> = {};

  if (existsSync(dataFilePath)) {
    const fileContents = readFileSync(dataFilePath, 'utf8');
    fileData = JSON.parse(fileContents);
  }

  fileData[testID] = { url, body, headers };

  writeFileSync(dataFilePath, JSON.stringify(fileData, null, 2));

  return NextResponse.json({ message: 'file updated' });
}
