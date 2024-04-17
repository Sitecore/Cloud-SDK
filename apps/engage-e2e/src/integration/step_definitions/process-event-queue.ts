/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types="cypress" />
// Above line needed as indicator for Cypress
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('the multiple events are sent in the respective order: {string}', (eventOrder: string) => {
  const eventList = eventOrder.split(',');
  //Reported Cypress issue with alias so we ought to add an empty string at the beginning of the list
  eventList.unshift('');
  for (let i = 1; i < eventList.length; i++)
    cy.get(`@eventRequest.${i}`)
      .its('request')
      .then((request) => {
        if (eventList[i] === 'null') eventList[i] = '';

        expect(request.body.type).to.equal(eventList[i].trim());
      });
});

When('multiple events are queued with {string} types', (eventOrder: string) => {
  const eventList = eventOrder.split(',');
  eventList.forEach((eventType) => {
    cy.get("[data-testid='typeInput']").clear().type(eventType.trim());
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(400);
    cy.get('[data-testid="addInputTypeEventQueue"]').click();
  });
});

When('an event with null type is added to queue', () => {
  cy.get("[data-testid='typeInput']").clear();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.get('[data-testid="addInputTypeEventQueue"]').click();
});
