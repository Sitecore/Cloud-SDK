@events
Feature: Include requested_at attribute in the body of events

Scenario: Developer sends <event> event from <environment> and requested_at is included in the body
    Given the '/requested-at' page is loaded
    And the '<testID>' button is clicked
    Then the request with id '<testID>' will contain the 'requested_at' in the body
    And the request with id '<testID>' will contain 'requested_at' log
    Examples:
        | testID                                      | environment | event    |
        | sendCustomEventFromAPIWithRequestedAt       | API         | event    |
        | sendPageViewEventFromAPIWithRequestedAt     | API         | pageView |
        | sendIdentityEventFromAPIWithRequestedAt     | API         | identity |
        | sendCustomEventFromBrowserWithRequestedAt   | Browser     | event    |
        | sendPageViewEventFromBrowserWithRequestedAt | Browser     | pageView |
        | sendIdentityEventFromBrowserWithRequestedAt | Browser     | identity |
        | sendFormEventFromBrowserWithRequestedAt     | Browser     | form     |

Scenario:  Developer sends <event> event from <environment> and requested_at is included in the body
    Given the 'requested-at' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain the 'requested_at' in the body
    And the request with id '<testID>' will contain 'requested_at' log
    Examples:
        | testID                                              | environment     | event    |
        | sendCustomEventFromMiddlewareWithRequestedAt        | Middleware      | event    |
        | sendPageViewEventFromMiddlewareWithRequestedAt      | Middleware      | pageView |
        | sendIdentityEventFromMiddlewareWithRequestedAt      | Middleware      | identity |
        | sendCustomEventFromServerSidePropsWithRequestedAt   | ServerSideProps | event    |
        | sendPageViewEventFromServerSidePropsWithRequestedAt | ServerSideProps | pageView |
        | sendIdentityEventFromServerSidePropsWithRequestedAt | ServerSideProps | identity |

Scenario: Developer sends multiple events and all requested_at values are progressive and withing 20sec timeframe
    Given the '/requested-at' page is loaded with 'testID' name and 'sendCustomEventFromMiddlewareWithRequestedAt' value query parameter
    And the 'sendCustomEventFromBrowserWithRequestedAt' button is clicked
    Then all requests from previous calls have progressive requested_at values and are in correct format



