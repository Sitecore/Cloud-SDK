@personalize
Feature: Include correlation id in personalize EP calls

    Scenario: Developer requests personalize from <environment> and a correlation id is added to the headers
        Given the '/correlation-id' page is loaded
        And the '<testID>' button is clicked
        Then the request with id '<testID>' will contain the '<headerName>' header
        And the request with id '<testID>' will contain '<headerName>' log
        Examples:
            | testID                                      | headerName          | environment |
            | sendPersonalizeFromAPIWithCorrelationID     | x-sc-correlation-id | API         |
            | sendPersonalizeFromBrowserWithCorrelationID | x-sc-correlation-id | Browser     |

    Scenario: Developer requests personalize from <environment> and a correlation id is added to the headers
        Given the '/correlation-id' page is loaded with 'testID' name and '<testID>' value query parameter
        Then the request with id '<testID>' will contain the '<headerName>' header
        And the request with id '<testID>' will contain '<headerName>' log
        Examples:
            | testID                                              | headerName          | environment     |
            | sendPersonalizeFromMiddlewareWithCorrelationID      | x-sc-correlation-id | Middleware      |
            | sendPersonalizeFromServerSidePropsWithCorrelationID | x-sc-correlation-id | ServerSideProps |

    Scenario: Developer requested personalize multiple times and all correlation ids were unique
        Given the '/correlation-id' page is loaded with 'testID' name and 'sendPersonalizeFromMiddlewareWithCorrelationID' value query parameter
        And the 'sendPersonalizeFromBrowserWithCorrelationID' button is clicked
        Then all requests from previous calls have unique correlation ids



