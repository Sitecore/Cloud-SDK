/// <reference types='cypress' />
// Above line needed as indicator for Cypress

import { Then } from '@badeball/cypress-cucumber-preprocessor';

let errorMessage: string;
beforeEach(() => {
  errorMessage = '';
});

Then('no error is thrown', () => {
  expect(errorMessage).to.eq('');
});
