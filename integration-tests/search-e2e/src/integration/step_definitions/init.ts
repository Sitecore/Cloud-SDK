import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the scCloudSDK.search object is injected to the window object', () => {
  let searchPackageVersion: string;
  cy.getSearchPackageVersion().then((version: string) => (searchPackageVersion = version));

  cy.window().then((window: any) => {
    const searchProperties = ['version'];
    expect(window).to.have.property('scCloudSDK');
    searchProperties.forEach((property) => {
      expect(window.scCloudSDK.search).to.have.property(property);
    });
    expect(window.scCloudSDK.search.version).to.equal(searchPackageVersion);
  });
});

defineStep('the scCloudSDK.search does not exist in the window object', () => {
  cy.window().then((window: any) => {
    expect(window).to.have.property('scCloudSDK');
    expect(window.scCloudSDK).not.to.have.property('search');
  });
});
