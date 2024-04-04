// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getCookie } from '@sitecore-cloudsdk/utils';
import { useState } from 'react';

interface PersonalizeGeoProps {
  pageTitle: string;
  buttonText: string;
}

export function PersonalizeGeo({ pageTitle, buttonText }: PersonalizeGeoProps) {
  const [requestPayload, setRequestPayload] = useState('');
  return (
    <div>
      <h1 data-testid='middlewarePersonalizeGeo'>{pageTitle}</h1>
      <button
        type='button'
        data-testid='middlewarePersonalizeGeoButton'
        onClick={async () => {
          const cookie = getCookie(document?.cookie, 'EPRequest');
          setRequestPayload(decodeURIComponent(cookie?.value || ''));
        }}>
        {buttonText}
      </button>
      <p></p>
      <label htmlFor='requestPayload'>EPRequest payload:</label>
      <textarea
        style={{ color: 'black' }}
        id='requestPayload'
        value={requestPayload}
        data-testid='requestPayload'
        name='requestPayload'
        rows={4}
        cols={50}></textarea>
    </div>
  );
}
