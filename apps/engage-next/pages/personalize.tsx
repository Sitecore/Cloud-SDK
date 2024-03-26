/* eslint-disable @typescript-eslint/no-explicit-any */
import { init as initServer, personalize as personalizeServer } from '@sitecore-cloudsdk/personalize/server';
import { PersonalizerInput, personalize } from '@sitecore-cloudsdk/personalize/browser';
import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { capturedDebugLogs } from '../utils/debugLogs';

export default function PersonalizeCall({
  serverSidePropsRes,
  debugLogs,
}: {
  serverSidePropsRes: string;
  debugLogs: string;
}) {
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

  const getEPPersonalizeRequestCookie = () => {
    const EPPersonalizeRequestCookie =
      document?.cookie
        ?.split('; ')
        ?.find((cookie) => cookie.split('=')[0] === 'EPPersonalizeRequestCookie')
        ?.split('EPPersonalizeRequestCookie=')[1] || '';

    const cookie = decodeURIComponent(EPPersonalizeRequestCookie);
    return cookie;
  };

  const sendRequestToNextApi = async () => {
    const response = await fetch(`/api/personalize?friendlyId=${personalizeData['friendlyId']}&timeout=${timeout}`);
    const EPResponse = await response.json();

    const res = document.getElementById('response') as HTMLInputElement;
    res.value = JSON.stringify(EPResponse.EPResponse);
  };

  const sendUTMParamsManuallyToApi = async () => {
    const response = await fetch(
      `/api/personalize?friendlyId=${personalizeData['friendlyId']}&timeout=${timeout}&includeUTMParams=true`
    );
    const EPResponse = await response.json();

    const res = document.getElementById('response') as HTMLInputElement;
    res.value = EPResponse.capturedDebugLogs;
  };

  const sendUTMParamsFromUrlToApi = async () => {
    const response = await fetch(
      `/api/personalize?friendlyId=${personalizeData['friendlyId']}&timeout=${timeout}&utm_campaign=campaign2&utm_source=test2`
    );

    const EPResponse = await response.json();

    const res = document.getElementById('response') as HTMLInputElement;
    res.value = EPResponse.capturedDebugLogs;
  };

  const sendBothUTMParamsToApi = async () => {
    const response = await fetch(
      `/api/personalize?friendlyId=${personalizeData['friendlyId']}&timeout=${timeout}&includeUTMParams=true&utm_campaign=campaign2&
      utm_source=test2`
    );

    const EPResponse = await response.json();

    const res = document.getElementById('response') as HTMLInputElement;
    res.value = EPResponse.capturedDebugLogs;
  };

  const sendUTMParamsManuallyToMiddleware = async () => {
    await fetch(`/personalize?friendlyId=${personalizeData['friendlyId']}&timeout=${timeout}&includeUTMParams=true`);

    const res = document.getElementById('response') as HTMLInputElement;
    const cookie = getEPPersonalizeRequestCookie();
    res.value = cookie;
  };

  const sendUTMParamsFromUrlToMiddleware = async () => {
    await fetch(
      `/personalize?friendlyId=${personalizeData['friendlyId']}&timeout=${timeout}&utm_campaign=campaign4&utm_source=test4`
    );

    const res = document.getElementById('response') as HTMLInputElement;
    const cookie = getEPPersonalizeRequestCookie();
    res.value = cookie;
  };

  const sendBothUTMParamsToMiddleware = async () => {
    await fetch(
      `/personalize?friendlyId=${personalizeData['friendlyId']}&timeout=${timeout}&includeUTMParams=true&utm_campaign=campaign5&utm_source=test5`
    );

    const res = document.getElementById('response') as HTMLInputElement;
    const cookie = getEPPersonalizeRequestCookie();
    res.value = cookie;
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
            const response = await personalize(personalizeData as unknown as PersonalizerInput);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize from Client{' '}
        </button>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithUA'
          onClick={async () => {
            const response = await personalize(personalizeData as unknown as PersonalizerInput);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize from Client with UA
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeWithEmptyStringLanguage'
          onClick={async () => {
            personalizeData.language = '';
            const response = await personalize(personalizeData as unknown as PersonalizerInput);

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
            const response = await personalize(personalizeData as unknown as PersonalizerInput);

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
            const response = await personalize(personalizeData as unknown as PersonalizerInput, timeout);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize with timeout
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithGeo'
          onClick={async () => {
            const personalizeDataWithGeo: PersonalizerInput = {
              ...personalizeData,
              geo: { city: 'T1', country: 'T2', region: 'T3' },
            };
            const response = await personalize(personalizeDataWithGeo);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize with geo
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithPartialGeo'
          onClick={async () => {
            const personalizeDataWithPartialGeo: PersonalizerInput = {
              ...personalizeData,
              geo: { city: 'T1' },
            };
            const response = await personalize(personalizeDataWithPartialGeo);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize with partial geo
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithEmptyGeo'
          onClick={async () => {
            const personalizeDataWithEmptyGeo: PersonalizerInput = {
              ...personalizeData,
              geo: {},
            };
            const response = await personalize(personalizeDataWithEmptyGeo);

            const res = document.getElementById('response') as HTMLInputElement;
            res.value = response ? JSON.stringify(response) : '';
          }}>
          Request Personalize with empty geo
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
            const EPResponse =
              document?.cookie
                ?.split('; ')
                ?.find((cookie) => cookie.split('=')[0] === 'EPResponse')
                ?.split('EPResponse=')[1] || '';

            const cookie = decodeURIComponent(EPResponse);
            middlewareRes.value = cookie;
          }}>
          Request Personalize from Middleware
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromMiddlewareWithUA'
          onClick={async () => {
            const middlewareRes = document.getElementById('response') as HTMLInputElement;
            const EPRequestUA =
              document?.cookie
                ?.split('; ')
                ?.find((cookie) => cookie.split('=')[0] === 'EPRequestUA')
                ?.split('EPRequestUA=')[1] || '';

            const cookie = decodeURIComponent(EPRequestUA);
            middlewareRes.value = cookie;
          }}>
          Request Personalize from Middleware With UA
        </button>
        <button
          type='button'
          data-testid='requestPersonalizeFromAPIWithUTMParams'
          onClick={sendUTMParamsManuallyToApi}>
          Request Personalize From API With UTM Params
        </button>
        <button
          type='button'
          data-testid='requestPersonalizeFromAPIWithUTMParamsFromUrl'
          onClick={sendUTMParamsFromUrlToApi}>
          Request Personalize From API With UTM Params from URL
        </button>
        <button
          type='button'
          data-testid='requestPersonalizeFromAPIWithBothUTMParams'
          onClick={sendBothUTMParamsToApi}>
          Request Personalize From API With both UTM Params
        </button>
        <button
          type='button'
          data-testid='requestPersonalizeFromMiddlewareWithUTMParams'
          onClick={sendUTMParamsManuallyToMiddleware}>
          Request Personalize From Middleware With UTM Params
        </button>
        <button
          type='button'
          data-testid='requestPersonalizeFromMiddlewareWithUTMParamsFromUrl'
          onClick={sendUTMParamsFromUrlToMiddleware}>
          Request Personalize From Middleware With UTM Params from URL
        </button>
        <button
          type='button'
          data-testid='requestPersonalizeFromMiddlewareWithBothUTMParams'
          onClick={sendBothUTMParamsToMiddleware}>
          Request Personalize From Middleware With both UTM Params
        </button>
        <p></p>
        <label htmlFor='response'>EP Response:</label>
        <input
          type='text'
          id='response'
          data-testid='response'
          name='response'
        />
        <div>
          <label htmlFor='debug'>Debug:</label>
          <textarea
            style={{ color: 'black' }}
            id='debug'
            data-testid='debug'
            name='debug'
            value={debugLogs ? JSON.stringify(debugLogs) : ''}
            rows={4}
            cols={50}></textarea>
          <input />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const event: PersonalizerInput = {
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

  const EPResponse = await personalizeServer(event, context.req);

  return {
    props: {
      debugLogs: JSON.stringify(capturedDebugLogs),
      serverSidePropsRes: JSON.stringify(EPResponse),
    },
  };
}
