import { getGuestId } from '@sitecore-cloudsdk/core/browser';
import { useState } from 'react';

export default function Index() {
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
