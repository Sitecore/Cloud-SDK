Feature: Send pageView events

    Scenario: Developer sends pageView events from Browser with valid payload
        Given the '/page-view' page is loaded
        When the pageView pararamers are: '<item>'
        And the 'sendPageView' button is clicked
        Then the event request is sent with parameters: '<item_request_payload>'
        And the event response has status code: '<status_code>'

        Examples:
            | item                                                 | item_request_payload                                                       | status_code |
            | {}                                                   | {"page":"page-view","language":"EN"}                                       | 201         |
            | {"page":"test","language":"GR"}                      | {"page":"test","language":"GR"}                                            | 201         |
            | {"pageVariantId":"vid"}                              | {"ext":{"pageVariantId":"vid"}}                                            | 201         |
            | {"language":"EN", "channel":"WEB", "currency":"EUR"} | {"language":"EN", "channel": "WEB", "currency":"EUR"}                      | 201         |
            | {"referrer":"home"}                                  | {"referrer":"home"}                                                        | 201         |
            | {"searchData":{"test":"test"}}                       | {"sc_search":{"data":{"test":"test"},"metadata":{"ut_api_version":"1.0"}}} | 201         |


    Scenario: Developer sends a pageView event from Middleware with valid payload
        Given the '/page-view' page is loaded with 'testID' name and 'sendPageViewFromMiddlewareWithValidPayload' value query parameter
        Then the request with id 'sendPageViewFromMiddlewareWithValidPayload' will contain:
            """
            "type":"VIEW"
            """

    Scenario: Developer sends a pageView event from API with valid payload
        Given a request to api '/page-view?testID=sendPageViewEventFromAPIWithValidPayload' is sent
        Then the request with id 'sendPageViewEventFromAPIWithValidPayload' will contain the 'type' in the body
        And the request with id 'sendPageViewEventFromAPIWithValidPayload' will contain '\\"type\\":\\"VIEW\\"' log

    Scenario: Developer sends a pageView event from Browser with includeUTMParameters true/default and UTM parameters
        Given the '/page-view' page is loaded with query parameters:
            """
            {
                "utm_source": "google",
                "utm_medium": "social",
                "utm_campaign": "cloudskd",
                "utm_content": "new-release"
            }
            """
        When the pageView pararamers are: '<item>'
        And the 'sendPageView' button is clicked
        Then the event request is sent with parameters: '<item_request_payload>'
        And the event response has status code: '<status_code>'

        Examples:
            | item                          | item_request_payload                                                                                  | status_code |
            | {}                            | {"utm_source":"google","utm_medium":"social", "utm_campaign":"cloudskd", "utm_content":"new-release"} | 201         |
            | {"includeUTMParameters":true} | {"utm_source":"google","utm_medium":"social", "utm_campaign":"cloudskd", "utm_content":"new-release"} | 201         |

    Scenario: Developer sends a pageView event from Browser with includeUTMParameters false and UTM parameters
        Given the '/page-view' page is loaded with query parameters:
            """
            {
                "utm_source": "google",
                "utm_medium": "social",
                "utm_campaign": "cloudskd",
                "utm_content": "new-release"
            }
            """
        When the pageView pararamers are: '<item>'
        And the 'sendPageView' button is clicked
        Then a pageView event is sent with no UTM key-value pairs

        Examples:
            | item                           |
            | {"includeUTMParameters":false} |

    Scenario: Developer sends a pageView event from Browser with includeUTMParameters true and has no UTM parameters
        Given the '/page-view' page is loaded
        When the pageView pararamers are: '{"includeUTMParameters":true}'
        And the 'sendPageView' button is clicked
        Then a pageView event is sent with no UTM key-value pairs

    Scenario: Developer sends a pageView event from Middleware with includeUTMParameters true and UTM parameters
        Given the '/page-view' page is loaded with query parameters:
            """
            {
                "testID": "sendPageViewFromMiddlewareWithIncludeUTMParametersTrue",
                "utm_source": "google",
                "utm_medium": "social",
                "utm_campaign": "cloudskd",
                "utm_content": "new-release"
            }
            """
        Then the request with id 'sendPageViewFromMiddlewareWithIncludeUTMParametersTrue' will contain:
            """
            "utm_source":"google","utm_medium":"social","utm_campaign":"cloudskd","utm_content":"new-release"
            """

    Scenario: Developer sends a pageView event from API with includeUTMParameters true and UTM parameters
        Given the '/api/page-view' page is loaded with query parameters:
            """
            {
                "testID": "sendPageViewFromAPIWithIncludeUTMParametersTrue",
                "utm_source": "google",
                "utm_medium": "social",
                "utm_campaign": "cloudskd",
                "utm_content": "new-release"
            }
            """
        Then the request with id 'sendPageViewFromAPIWithIncludeUTMParametersTrue' will contain:
            """
            "utm_source":"google","utm_medium":"social","utm_campaign":"cloudskd","utm_content":"new-release"
            """

    Scenario: Developer sends a pageView event from Middleware with includeUTMParameters false and UTM parameters
        Given the '/page-view' page is loaded with query parameters:
            """
            {
                "testID": "sendPageViewFromMiddlewareWithIncludeUTMParametersFalse",
                "utm_source": "google"
            }
            """
        Then the request with id 'sendPageViewFromMiddlewareWithIncludeUTMParametersFalse' will not contain the 'utm_source' in the body


    Scenario: Developer sends a pageView event from API and sc_search is included in the body
        Given a request to api '/page-view?testID=sendPageViewEventFromAPIWithSearchData' is sent
        Then the request with id 'sendPageViewEventFromBrowserWithSearchData' will contain the 'sc_search' in the body
        And the request with id 'sendPageViewEventFromBrowserWithSearchData' will contain ut_api_version in the metadata
        And the request with id 'sendPageViewEventFromBrowserWithSearchData' will contain 'sc_search' log

    Scenario:  Developer sends a pageView event from Middleware and sc_search is included in the body
        Given the '/page-view' page is loaded with 'testID' name and 'sendPageViewEventFromMiddlewareWithSearchData' value query parameter
        Then the request with id 'sendPageViewEventFromMiddlewareWithSearchData' will contain the 'sc_search' in the body
        And the request with id 'sendPageViewEventFromMiddlewareWithSearchData' will contain ut_api_version in the metadata
        And the request with id 'sendPageViewEventFromMiddlewareWithSearchData' will contain 'sc_search' log

