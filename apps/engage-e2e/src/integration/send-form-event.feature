Feature: Developer sends form event to CDP

@Smoke-Test-Events
Scenario: Developer sends FORMS event to CDP from client side
    Given the '/form' page is loaded with query parameters
        | pointOfSale | formId | interactionType |
        | spinair.com | xxxx   | test            |
    When the 'sendFormEvent' button is clicked
    Then the 'FORM' event is sent with the following parameters in the ext object
        | formId | interactionType |
        | xxxx   | TEST            |
    And channel, page, language & currency are undefined

Scenario: Developer sends FORM event to CDP without pointOfSale
    Given the '/form' page is loaded with query parameters
        | pointOfSale | formId  | interactionType |
        |             |  xxxx   | test            |
    When the 'sendFormEvent' button is clicked
    Then an error is thrown: '[MV-0003] "pointOfSale" is required.' 