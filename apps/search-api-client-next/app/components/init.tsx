'use client';

import { init } from '@sitecore-cloudsdk/search-api-client/browser';
import { useEffect } from 'react';

export default function Init() {
  const settings = {
    siteName: 'TestSite',
    sitecoreEdgeContextId: 'abc123',
    userId: 'user123',
  };

  useEffect(() => {
    init(settings);
  }, []);

  return (
    <div>
      <h1>
        <span> This is a client-side component that initiliazes the search-api-client </span>
      </h1>
    </div>
  );
}
