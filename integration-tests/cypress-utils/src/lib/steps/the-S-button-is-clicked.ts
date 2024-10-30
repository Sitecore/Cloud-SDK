// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/* eslint-disable cypress/unsafe-to-chain-command */
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

export function the_S_ButtonIsClicked() {
  defineStep('the {string} button is clicked', (event: string) => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1200);
    const selector = `[data-testid="${event}"]`;
    cy.on('uncaught:exception', (error) => {
      (globalThis as any).errorMessage = error.message;

      return false;
    });

    // We do not want Cypress to click on buttons before cloud sdk is present in window object
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.get(selector)
      .should('be.visible')
      .click({ force: true })
      .then(() => cy.writeLocal(`error.txt`, (globalThis as any).errorMessage));
  });
}
