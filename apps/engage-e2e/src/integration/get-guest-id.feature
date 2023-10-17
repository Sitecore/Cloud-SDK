@Smoke-Test-Events
Feature: Return guestRef to the client requesting the getGuestId

Scenario: Developer requests customer ref
    Given the '/getGuestId' page is loaded
    When the engage.getGuestId called
    Then customer.ref GUID is returned
