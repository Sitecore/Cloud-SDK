Feature: Include software id in events calls

Scenario: Developer requests event from <environment> and a software id is added to the headers
    Given the '/software-id' page is loaded
    And the '<testID>' button is clicked
    Then the request with id '<testID>' will contain the '<headerName>' header
    And the request with id '<testID>' will contain '<headerName>' log
    Examples:
        | testID                                     | headerName           | environment     |
        | sendEventFromAPIWithSoftwareID             | X-Client-Software-ID | API             |
        | sendEventFromBrowserWithSoftwareID         | X-Client-Software-ID | Browser         |

Scenario: Developer requests event from <environment> and a software id is added to the headers
    Given the '/software-id' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain the '<headerName>' header
    And the request with id '<testID>' will contain '<headerName>' log
    Examples:
        | testID                                     | headerName           | environment     |
        | sendEventFromMiddlewareWithSoftwareID      | X-Client-Software-ID | Middleware      |
        | sendEventFromServerSidePropsWithSoftwareID | X-Client-Software-ID | ServerSideProps |





