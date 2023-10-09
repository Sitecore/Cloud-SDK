// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { useState } from 'react';
import { useEvents } from '../context/events';

export function Index() {
  const [label, setlabel] = useState('');
  const events = useEvents();

  return (
    <div>
      <h1 data-testid='getGuestIdPageTitle'>Get Guest Id</h1>
      <button
        data-testid='getGuestId'
        onClick={async () => {
          setlabel((await events?.getGuestId()) ?? '');
        }}>
        get guest id
      </button>
      <p data-testid='getGuestIdResponse'>{label}</p>
    </div>
  );
}

export default Index;
