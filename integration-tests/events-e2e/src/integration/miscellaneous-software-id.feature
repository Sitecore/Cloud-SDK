Feature: Include software id header in all event requests

    @EnableClientDebug
    Scenario: Developer requests event from Browser and a software id is added to the headers
        Given the '/miscellaneous-software-id' page is loaded
        And the 'sendEventFromBrowserWithSoftwareID' button is clicked
        Then the request with id 'sendEventFromBrowserWithSoftwareID' will contain the 'X-Client-Software-ID' header
        And the request with id 'sendEventFromBrowserWithSoftwareID' will contain 'X-Client-Software-ID' log

    Scenario: Developer requests event from API and a software id is added to the headers
        Given the '/' page is loaded
        Given a request to api '/miscellaneous-software-id?testID=sendEventFromAPIWithSoftwareID' is sent
        Then the request with id 'sendEventFromAPIWithSoftwareID' will contain the 'X-Client-Software-ID' header
        And the request with id 'sendEventFromAPIWithSoftwareID' will contain 'X-Client-Software-ID' log

    Scenario: Developer requests event from Middleware and a software id is added to the headers
        Given the '/miscellaneous-software-id' page is loaded with 'testID' name and 'sendEventFromMiddlewareWithSoftwareID' value query parameter
        Then the request with id 'sendEventFromMiddlewareWithSoftwareID' will contain the 'X-Client-Software-ID' header
        And the request with id 'sendEventFromMiddlewareWithSoftwareID' will contain 'X-Client-Software-ID' log

