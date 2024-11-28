import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

beforeEach(() => {
  cy.on('uncaught:exception', () => {
    return false;
  });
});

defineStep('the event object is saved to the queue with {string} type', (eventType: string) => {
  cy.window()
    .its('sessionStorage')
    .invoke('getItem', 'EventQueue')
    .should('exist')
    .then((item) => {
      if (item) {
        const queue = JSON.parse(item);
        const event = queue[0];
        console.log('event', event);
        expect(event.eventData.type).to.equal(eventType);
      }
    });
});

defineStep('the queue contains {int} events in total', (expectedQueueLength: number) => {
  cy.window()
    .its('sessionStorage')
    .invoke('getItem', 'EventQueue')
    .should('exist')
    .then((item) => {
      if (item) {
        const queue = JSON.parse(item);
        expect(queue.length).to.eq(expectedQueueLength);
      }
    });
});

defineStep('the multiple events are sent in the respective order: {string}', (eventOrder: string) => {
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

defineStep('the queue is null', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.window()
    .its('sessionStorage')
    .then((storage) => {
      expect(storage.getItem('EventQueue')).to.be.null;
    });
});
