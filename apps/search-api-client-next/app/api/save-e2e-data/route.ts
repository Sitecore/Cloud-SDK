import { existsSync, readFileSync, writeFileSync } from 'fs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  const type = req.nextUrl.searchParams.get('type');

  const testID: string = requestBody.testID;

  if (type === 'fetch') {
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

    fileData[testID] = { body, headers, url };

    writeFileSync(dataFilePath, JSON.stringify(fileData, null, 2));

    return NextResponse.json({ message: 'file updated' });
  } else if (type === 'logs') {
    const dataFilePath = path.resolve(
      path.join('..', 'search-api-client-e2e', 'src', 'fixtures', 'local', 'logsData.json')
    );
    const args = requestBody.args;

    let fileData: Record<string, string> = {};

    if (existsSync(dataFilePath)) {
      const fileContents = readFileSync(dataFilePath, 'utf8');
      fileData = JSON.parse(fileContents);
    }

    let data = '';
    if (fileData[testID]) data += fileData[testID];

    data += JSON.stringify(args);

    fileData[testID] = data;

    writeFileSync(dataFilePath, JSON.stringify(fileData, null, 2));
    return NextResponse.json({ message: 'file updated' });
  } else return NextResponse.json({ error: 'no type provided' }, { status: 404 });
}
