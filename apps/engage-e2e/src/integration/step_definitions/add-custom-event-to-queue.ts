/// <reference types="cypress" />
// Above line needed as indicator for Cypress
import { Then, defineStep } from '@badeball/cypress-cucumber-preprocessor';
import { Utils } from '../../support/utils';

beforeEach(() => {
  cy.on('uncaught:exception', () => {
    return false;
  });
});

Then('the event object is saved to the queue with {string} type', (eventType: string, datatable: any) => {
  cy.window()
    .its('sessionStorage')
    .invoke('getItem', 'EventQueue')
    .should('exist')
    .then((item) => {
      if (item) {
        const queue = JSON.parse(item);
        const event = queue[0];
        const expectedQueue = Utils.createExpectedQueueEvent(eventType, datatable);

        expect(event.type).to.equal(eventType);
        expect(event.eventData).to.deep.contain(expectedQueue.baseEventData);
        expect(event.extensionData).to.deep.equal(expectedQueue.ext);
      }
    });
});

defineStep('the queue contains {string} events in total', (queueSize: string) => {
  cy.window()
    .its('sessionStorage')
    .invoke('getItem', 'EventQueue')
    .should('exist')
    .then((item) => {
      if (item) {
        const queue = JSON.parse(item);
        const expectedQueueLength = parseInt(queueSize);
        expect(queue.length).to.eq(expectedQueueLength);
      }
    });
});
