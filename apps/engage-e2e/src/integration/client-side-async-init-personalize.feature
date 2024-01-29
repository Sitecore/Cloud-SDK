@personalize
Feature: Async init functions for personalize

Scenario: Developer requests personalize without awaiting the init function
    Given the '/async-init-personalize' page is loaded without init function
    And the 'sendPersonalizeWithoutAwait' button is clicked
    Then we display the callflow's content to UI: 
        """
            {"Key":"value"}
        """
    And no error is thrown

Scenario: Developer requests personalize without initializing
    Given the '/async-init-personalize' page is loaded without init function
    And the 'sendPersonalizeWithoutInit' button is clicked
    Then an error is thrown: '[IE-0006] You must first initialize the "personalize/browser" module. Run the "init" function.'

Scenario: Developer requests personalize without awaiting the Events and Personalize init functions
    Given the '/async-init-personalize' page is loaded without init function
    And the 'sendPersonalizeWithoutAwaitingInitFunctions' button is clicked
        """
            {"Key":"value"}
        """
    And no error is thrown
