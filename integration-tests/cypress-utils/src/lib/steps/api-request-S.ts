// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/* eslint-disable cypress/unsafe-to-chain-command */
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

export function apiRequest_S() {
  defineStep('a request to api {string} is sent', (path: string) => {
    cy.waitUntil(() => cy.request({ url: `${Cypress.config('baseUrl')}/api${path}` }));
  });
}
