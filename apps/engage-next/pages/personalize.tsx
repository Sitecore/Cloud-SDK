/* eslint-disable @typescript-eslint/no-explicit-any */
import { init as initServer, personalize as personalizeServer } from '@sitecore-cloudsdk/personalize/server';
import { IPersonalizerInput, personalize } from '@sitecore-cloudsdk/personalize/browser';
import { useState } from 'react';

import { GetServerSidePropsContext } from 'next';

export function PersonalizeCall({ serverSidePropsRes }: { serverSidePropsRes: string }) {
  let timeout: number;
  const [personalizeData, setPersonalizetData] = useState<any>({
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    page: 'personalize',
  });

  function getParamsValue(paramsValue: string) {
    let params = {};
    try {
      params = JSON.parse(paramsValue);
    } catch {
      params = {};
    }
    return params;
  }

  const sendRequestToNextApi = async () => {
    const response = await fetch(`/api/personalize?friendlyId=${personalizeData['friendlyId']}&timeout=${timeout}`);
    const cdpResponse = await response.json();

    const res = document.getElementById('response') as HTMLInputElement;
    res.value = JSON.stringify(cdpResponse);
  };

  return (
    <div>
      <div>
        <h1 data-testid='personalizePageTitle'>Personalize Page</h1>
        <label htmlFor='friendlyId'>friendlyId:</label>
        <input
          type='text'
          id='friendlyId'
          data-testid='friendlyId'
          name='friendlyId'
          onChange={(e) => setPersonalizetData((prev: any) => ({ ...prev, friendlyId: e.target.value }))}
        />
        <label htmlFor='email'> email:</label>
        <input
          type='text'
          id='email'
          data-testid='email'
          name='email'
          onChange={(e) => setPersonalizetData((prev: any) => ({ ...prev, email: e.target.value }))}
        />
        <label htmlFor='identifier'> identifier:</label>
        <input
          type='text'
          id='identifier'
          data-testid='identifier'
          name='identifier'
          // eslint-disable-next-line max-len
          onChange={(e) =>
            setPersonalizetData((prev: any) => ({ ...prev, identifier: { id: e.target.value, provider: 'email' } }))
          }
        />
        <label htmlFor='params'> params:</label>
        <input
          type='text'
          id='params'
          data-testid='params'
          name='params'
          onChange={(e) => setPersonalizetData((prev: any) => ({ ...prev, params: getParamsValue(e.target.value) }))}
        />
        <label htmlFor='timeout'> timeout:</label>
        <input
          type='text'
          id='timeout'
          data-testid='timeout'
          name='timeout'
          onChange={(e) => {
            timeout = Number(e.target.value);
          }}
        />
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClient'
          onClick={async () => {
            const response = await personalize(personalizeData as unknown as IPersonalizerInput);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize from Client{' '}
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeWithEmptyStringLanguage'
          onClick={async () => {
            personalizeData.language = '';
            const response = await personalize(personalizeData as unknown as IPersonalizerInput);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize from Client With Empty String Language{' '}
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeWithUndefinedLanguage'
          onClick={async () => {
            personalizeData.language = undefined;
            const response = await personalize(personalizeData as unknown as IPersonalizerInput);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize from Client With Undefined Language{' '}
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithTimeout'
          onClick={async () => {
            const response = await personalize(personalizeData as unknown as IPersonalizerInput, timeout);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize with timeout
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromAPI'
          onClick={sendRequestToNextApi}>
          Request Personalize from API
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromServerSideProps'
          onClick={async () => {
            const response = document.getElementById('response') as HTMLInputElement;
            response.value = serverSidePropsRes ? serverSidePropsRes : '';
          }}>
          Request Personalize from ServerSideProps{' '}
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromMiddleware'
          onClick={async () => {
            const middlewareRes = document.getElementById('response') as HTMLInputElement;
            const cdpResponse =
              document?.cookie
                ?.split('; ')
                ?.find((cookie) => cookie.split('=')[0] === 'cdpResponse')
                ?.split('cdpResponse=')[1] || '';

            const cookie = decodeURIComponent(cdpResponse);
            middlewareRes.value = cookie;
          }}>
          Request Personalize from Middleware{' '}
        </button>
        <p></p>
        <label htmlFor='response'>CDP Response:</label>
        <input
          type='text'
          id='response'
          data-testid='response'
          name='response'
        />
      </div>
    </div>
  );
}

export default PersonalizeCall;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const event: IPersonalizerInput = {
    channel: 'WEB',
    currency: 'EUR',
    email: 'test_personalize_callflows@test.com',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN',
  };

  await initServer(
    {
      cookieDomain:
        typeof context.query.cookieDomain === 'string' ? context.query.cookieDomain.toLowerCase() : 'localhost',
      cookieExpiryDays: 400,
      enableServerCookie:
        typeof context.query.enableServerCookie === 'string' &&
        context.query.enableServerCookie.toLowerCase() === 'true',
      sitecoreEdgeContextId: process.env.CONTEXT_ID || '',
      siteName: process.env.SITE_ID || '',
    },
    context.req,
    context.res
  );

  const cdpResponse = await personalizeServer(event, context.req);

  return {
    props: {
      serverSidePropsRes: JSON.stringify(cdpResponse),
    },
  };
}
