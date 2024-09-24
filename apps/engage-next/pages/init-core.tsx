import { CloudSDK } from '@sitecore-cloudsdk/core/browser';

export default function InitCore() {
  const cid = process.env.CONTEXT_ID || '';
  const initializeCore = () => {
    CloudSDK({ siteName: 'spinair.com', sitecoreEdgeContextId: cid }).initialize();
  };

  return (
    <div>
      <h1 data-testid='initCorePage'>Init Core Page</h1>
      <button
        type='button'
        data-testid='initializeCore'
        onClick={initializeCore}>
        Initialize Core
      </button>
    </div>
  );
}
