Feature: Include requested_at attribute in the body of events

    @EnableClientDebug
    Scenario: Developer sends <eventType> event from Browser and requested_at is included in the body
        Given the '/miscellaneous-requested-at' page is loaded
        And the '<testID>' button is clicked
        Then the request with id '<testID>' will contain the 'requested_at' in the body
        And the request with id '<testID>' will contain 'requested_at' log

        Examples:
            | testID                                      | eventType |
            | sendCustomEventFromBrowserWithRequestedAt   | custom    |
            | sendPageViewEventFromBrowserWithRequestedAt | pageView  |
            | sendIdentityEventFromBrowserWithRequestedAt | identity  |
            | sendFormEventFromBrowserWithRequestedAt     | form      |

    Scenario: Developer sends <eventType> event from API and requested_at is included in the body
        Given a request to api '/miscellaneous-requested-at?testID=<testID>' is sent
        Then the request with id '<testID>' will contain the 'requested_at' in the body
        And the request with id '<testID>' will contain 'requested_at' log

        Examples:
            | testID                                  | eventType |
            | sendCustomEventFromAPIWithRequestedAt   | custom    |
            | sendPageViewEventFromAPIWithRequestedAt | pageView  |
            | sendIdentityEventFromAPIWithRequestedAt | identity  |


    Scenario:  Developer sends <eventType> event from Middleware and requested_at is included in the body
        Given the '/miscellaneous-requested-at' page is loaded with 'testID' name and '<testID>' value query parameter
        Then the request with id '<testID>' will contain the 'requested_at' in the body
        And the request with id '<testID>' will contain 'requested_at' log

        Examples:
            | testID                                         | eventType |
            | sendCustomEventFromMiddlewareWithRequestedAt   | custom    |
            | sendPageViewEventFromMiddlewareWithRequestedAt | pageView  |
            | sendIdentityEventFromMiddlewareWithRequestedAt | identity  |

    Scenario: Developer sends multiple events and all requested_at values are progressive and withing 20sec timeframe
        Given the '/miscellaneous-requested-at' page is loaded with 'testID' name and 'sendCustomEventFromMiddlewareWithRequestedAt' value query parameter
        And the 'sendCustomEventFromBrowserWithRequestedAt' button is clicked
        Then all requests from previous calls have progressive requested_at values and are in correct format