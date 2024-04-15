@events
Feature: Include sc_search attribute in the body of custom events

Scenario: Developer sends custom event from <environment> and sc_search is included in the body
    Given the '/custom-event-with-search-data' page is loaded
    And the '<testID>' button is clicked
    Then the request with id '<testID>' will contain the 'sc_search' in the body
    And the request with id '<testID>' will contain ut_api_version in the metadata
    And the request with id '<testID>' will contain 'sc_search' log
    Examples:
        | testID                                   | environment |
        | sendCustomEventFromAPIWithSearchData     | API         |
        | sendCustomEventFromBrowserWithSearchData | Browser     |

Scenario:  Developer sends custom event from <environment> and sc_search is included in the body
    Given the '/custom-event-with-search-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain the 'sc_search' in the body
    And the request with id '<testID>' will contain ut_api_version in the metadata
    And the request with id '<testID>' will contain 'sc_search' log
    Examples:
        | testID                                           | environment     | event    |
        | sendCustomEventFromMiddlewareWithSearchData      | Middleware      | event    |
        | sendCustomEventFromServerSidePropsWithSearchData | ServerSideProps | event    |

Scenario: Developer sends custom event from <environment> and sc_search is not included in the body
    Given the '/custom-event-with-search-data' page is loaded
    And the '<testID>' button is clicked
    Then the request with id '<testID>' will not contain the 'sc_search' in the body
    And the request with id '<testID>' will not contain 'sc_search' log
    Examples:
        | testID                                      | environment |
        | sendCustomEventFromAPIWithoutSearchData     | API         |
        | sendCustomEventFromBrowserWithoutSearchData | Browser     |

Scenario:  Developer sends custom event from <environment> and sc_search is not included in the body
    Given the '/custom-event-with-search-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will not contain the 'sc_search' in the body
    And the request with id '<testID>' will not contain 'sc_search' log
    Examples:
        | testID                                              | environment     | event    |
        | sendCustomEventFromMiddlewareWithoutSearchData      | Middleware      | event    |
        | sendCustomEventFromServerSidePropsWithoutSearchData | ServerSideProps | event    |




