Feature: Developer sends form event to EP

@Smoke-Test-Events
Scenario: Developer sends FORMS event to EP from client side
    Given the '/form' page is loaded with query parameters
        | formId | interactionType |
        | xxxx   | test            |
    When the 'sendFormEvent' button is clicked
    Then the 'FORM' event is sent with the following parameters in the ext object
        | formId | interactionType |
        | xxxx   | TEST            |
    And channel, page, language & currency are undefined
