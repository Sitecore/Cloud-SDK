// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { NextApiRequest, NextApiResponse } from 'next';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = req.query.type;

  const testID: string = req.body.testID;

  if (type === 'fetch') {
    const dataFilePath = path.resolve(path.join('..', 'engage-e2e', 'src', 'fixtures', 'local', 'fetchData.json'));
    const body = req.body.init.body;
    const headers = req.body.init.headers;
    const url = req.body.url;
    let fileData: Record<string, unknown> = {};

    if (existsSync(dataFilePath)) {
      const fileContents = readFileSync(dataFilePath, 'utf8');
      fileData = JSON.parse(fileContents);
    }

    fileData[testID] = { url, body, headers };

    writeFileSync(dataFilePath, JSON.stringify(fileData, null, 2));
  } else if (type === 'logs') {
    const dataFilePath = path.resolve(path.join('..', 'engage-e2e', 'src', 'fixtures', 'local', 'logsData.json'));
    const args = req.body.args;

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
  } else res.status(404).json('no type provided');

  res.status(200).json('file updated');
}
