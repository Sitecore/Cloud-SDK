'use client';

import { useEffect, useState } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { form } from '@sitecore-cloudsdk/events/browser';

export default function Page() {
  useEffect(() => {
    CloudSDK({
      enableBrowserCookie: true,
      siteName: process.env.SITE_NAME as string,
      sitecoreEdgeContextId: process.env.CONTEXT_ID as string
    })
      .addEvents()
      .initialize();
  }, []);

  const [formId, setFormId] = useState('');
  const [interactionType, setInteractionType] = useState<'VIEWED' | 'SUBMITTED'>('VIEWED');
  const [componentInstanceId, setComponentInstanceId] = useState('');

  const sendForm = async () => {
    await form(formId, interactionType, componentInstanceId);
  };

  return (
    <div>
      <h2>form event</h2>
      <input
        value={formId}
        onChange={(e) => setFormId(e.target.value)}
        data-testid='formIdInput'
      />
      <input
        value={interactionType}
        onChange={(e) => setInteractionType(e.target.value as 'VIEWED' | 'SUBMITTED')}
        data-testid='interactionTypeInput'
      />
      <input
        value={componentInstanceId}
        onChange={(e) => setComponentInstanceId(e.target.value)}
        data-testid='componentInstanceIdInput'
      />

      <button
        data-testid='sendForm'
        onClick={sendForm}>
        Send form
      </button>
    </div>
  );
}
