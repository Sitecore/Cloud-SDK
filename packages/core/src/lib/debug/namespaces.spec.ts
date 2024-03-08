import { CORE_NAMESPACE, EVENTS_NAMESPACE } from './namespaces';

describe('namespaces module', () => {
  it(`should evaluate 'CORE_NAMESPACE' to 'sitecore-cloudsdk:core'`, async () => {
    expect(CORE_NAMESPACE).toBe('sitecore-cloudsdk:core');
  });

  it(`should evaluate 'EVENTS_NAMESPACE' to 'sitecore-cloudsdk:events'`, async () => {
    expect(EVENTS_NAMESPACE).toBe('sitecore-cloudsdk:events');
  });
});
