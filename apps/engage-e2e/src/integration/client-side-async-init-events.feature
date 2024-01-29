Feature: Async init functions for events

Scenario: Developer sends a view event without awaiting the init function
    Given the '/async-init-events' page is loaded without init function
    And the 'sendEventWithoutAwait' button is clicked
    Then the event is sent with 'VIEW' type
    And no error is thrown

Scenario: Developer sends a view event without initializing
    Given the '/async-init-events' page is loaded without init function
    And the 'sendEventWithoutInit' button is clicked
    Then an error is thrown: '[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.'

Scenario: Developer sends a view event without awaiting the Events and Personalize init functions
    Given the '/async-init-events' page is loaded without init function
    And the 'sendEventWithoutAwaitingInitFunctions' button is clicked
    Then the event is sent with 'VIEW' type
    And no error is thrown
