// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getGuestId } from '@sitecore-cloudsdk/events/browser';
import { useState } from 'react';

export function Index() {
  const [label, setlabel] = useState('');

  return (
    <div>
      <h1 data-testid='getGuestIdPageTitle'>Get Guest Id</h1>
      <button
        data-testid='getGuestId'
        onClick={async () => {
          setlabel((await getGuestId()) ?? '');
        }}>
        get guest id
      </button>
      <p data-testid='getGuestIdResponse'>{label}</p>
    </div>
  );
}

export default Index;
