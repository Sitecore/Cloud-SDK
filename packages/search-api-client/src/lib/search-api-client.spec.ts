import { packagesSearchApiClient } from './search-api-client';

describe('packagesSearchApiClient', () => {
  it('should work', () => {
    expect(packagesSearchApiClient()).toEqual('search-api-client');
  });
});
