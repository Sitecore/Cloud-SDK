Feature: Developer accesses debug logs when personalize is called

    @EnableClientDebug
    Scenario: Developer loads next app and personalize lib is initialized and client debug logs are printed
        Given the '/personalize' page is loaded
        Then debug log is printed out in the console with message including 'sitecore-cloudsdk:personalize'

    @EnableClientDebug
    Scenario: Developer loads next app and personalize lib and sends personalize event with error response
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test_personalize_1@tst.com",
                "timeout": "0"
            }
            """
        And the 'requestPersonalizeFromClientWithTimeout' button is clicked
        Then debug log is printed out in the console with message including 'Error personalize response'

    Scenario: Developer sends personalize event from middleware and server debug logs are printed
        Given the '/personalize' page is loaded with 'testID' name and 'requestPersonalizeFromMiddleware' value query parameter
        Then the request with id '<testID>' will contain '<request>' log
        And the request with id '<testID>' will contain '<response>' log
        Examples:
            | testID                           | request             | response             |
            | requestPersonalizeFromMiddleware | Personalize request | Personalize response |
