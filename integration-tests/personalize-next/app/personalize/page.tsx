'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import type { PersonalizeData } from '@sitecore-cloudsdk/personalize/browser';
import { personalize } from '@sitecore-cloudsdk/personalize/browser';
import { getCookie } from '@sitecore-cloudsdk/utils';

export default function PersonalizeCall() {
  let timeout: number;

  useEffect(() => {
    CloudSDK({
      siteName: 'spinair.com',
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    })
      .addPersonalize()
      .initialize();
  }, []);

  const [personalizeData, setPersonalizetData] = useState<any>({
    channel: 'WEB',
    language: 'EN',
    page: 'personalize'
  });
  const [pageVariantIdsInput, setPageVariantIdsInput] = useState<any>('');

  const [response, setResponse] = useState('');

  function getParamsValue(paramsValue: string) {
    let params = {};
    try {
      params = JSON.parse(paramsValue);
    } catch {
      params = {};
    }
    return params;
  }

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
        <label htmlFor='params'> pageVariantIds:</label>
        <input
          type='text'
          id='pageVariantIds'
          data-testid='pageVariantIds'
          name='pageVariantIds'
          onChange={(e) => setPageVariantIdsInput(e.target.value)}
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
            CloudSDK({
              siteName: 'spinair.com',
              sitecoreEdgeContextId: process.env.CONTEXT_ID as string
            })
              .addPersonalize()
              .initialize();

            const data = { ...personalizeData };
            data.pageVariantIds = pageVariantIdsInput ? JSON.parse(pageVariantIdsInput).pageVariantIds : undefined;

            const response = await personalize(data as unknown as PersonalizeData);
            setResponse(response ? JSON.stringify(response) : '');
          }}>
          Request Personalize from Client{' '}
        </button>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithUA'
          onClick={async () => {
            CloudSDK({
              siteName: 'spinair.com',
              sitecoreEdgeContextId: process.env.CONTEXT_ID as string
            })
              .addPersonalize()
              .initialize();

            const response = await personalize(personalizeData as unknown as PersonalizeData);
            setResponse(response ? JSON.stringify(response) : '');
          }}>
          Request Personalize from Client with UA
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeWithEmptyStringLanguage'
          onClick={async () => {
            CloudSDK({
              siteName: 'spinair.com',
              sitecoreEdgeContextId: process.env.CONTEXT_ID as string
            })
              .addPersonalize()
              .initialize();
            personalizeData.language = '';
            const response = await personalize(personalizeData as unknown as PersonalizeData);
            setResponse(response ? JSON.stringify(response) : '');
          }}>
          Request Personalize from Client With Empty String Language{' '}
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeWithUndefinedLanguage'
          onClick={async () => {
            personalizeData.language = undefined;
            const response = await personalize(personalizeData as unknown as PersonalizeData);
            setResponse(response ? JSON.stringify(response) : '');
          }}>
          Request Personalize from Client With Undefined Language{' '}
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithTimeout'
          onClick={async () => {
            CloudSDK({
              siteName: 'spinair.com',
              sitecoreEdgeContextId: process.env.CONTEXT_ID as string
            })
              .addPersonalize()
              .initialize();
            const response = await personalize(personalizeData as unknown as PersonalizeData, { timeout });
            setResponse(response ? JSON.stringify(response) : '');
          }}>
          Request Personalize with timeout
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithGeo'
          onClick={async () => {
            CloudSDK({
              siteName: 'spinair.com',
              sitecoreEdgeContextId: process.env.CONTEXT_ID as string
            })
              .addPersonalize()
              .initialize();
            const personalizeDataWithGeo: PersonalizeData = {
              ...personalizeData,
              geo: { city: 'T1', country: 'T2', region: 'T3' }
            };
            const response = await personalize(personalizeDataWithGeo);
            setResponse(response ? JSON.stringify(response) : '');
          }}>
          Request Personalize with geo
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithPartialGeo'
          onClick={async () => {
            CloudSDK({
              siteName: 'spinair.com',
              sitecoreEdgeContextId: process.env.CONTEXT_ID as string
            })
              .addPersonalize()
              .initialize();
            const personalizeDataWithPartialGeo: PersonalizeData = {
              ...personalizeData,
              geo: { city: 'T1' }
            };
            const response = await personalize(personalizeDataWithPartialGeo);
            setResponse(response ? JSON.stringify(response) : '');
          }}>
          Request Personalize with partial geo
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromClientWithEmptyGeo'
          onClick={async () => {
            CloudSDK({
              siteName: 'spinair.com',
              sitecoreEdgeContextId: process.env.CONTEXT_ID as string
            })
              .addPersonalize()
              .initialize();
            const personalizeDataWithEmptyGeo: PersonalizeData = {
              ...personalizeData,
              geo: {}
            };
            const response = await personalize(personalizeDataWithEmptyGeo);
            setResponse(response ? JSON.stringify(response) : '');
          }}>
          Request Personalize with empty geo
        </button>
        <br></br>
        <button
          type='button'
          data-testid='requestPersonalizeFromMiddlewareWithUA'
          onClick={async () => {
            const cookie = getCookie(document?.cookie, 'EPRequestUA');
            setResponse(decodeURIComponent(cookie?.value || ''));
          }}>
          Request Personalize from Middleware With UA
        </button>
        <p></p>
        <label htmlFor='response'>EP Response:</label>
        <input
          type='text'
          id='response'
          data-testid='response'
          name='response'
          value={response}
        />
      </div>
    </div>
  );
}
