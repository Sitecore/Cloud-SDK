Feature: Send custom events

    Scenario: Developer sends a custom event from Browser with valid payload
        Given the '/event' page is loaded
        When the event parameters are: '<item>'
        And the 'sendCustomEvent' button is clicked
        Then the event request is sent with parameters: '<item_request_payload>'
        And the event response has status code: '<status_code>'

        Examples:
            | item                                                                           | item_request_payload                                                                     | status_code |
            | {"type":"ADD_PRODUCTS"}                                                        | {"type":"ADD_PRODUCTS"}                                                                  | 201         |
            | {"type":"TEST","extensionData":{"test":{"a":"a","b":1,"c":true}}}              | {"type":"TEST","ext":{"test_a":"a","test_b":1,"test_c":true}}                            | 201         |
            | {"type":"TEST","uuid":123,"extensionData": {"test":{"a": "a","b":1,"c":true}}} | {"type":"TEST","uuid":123,"ext":{"test_a":"a","test_b":1,"test_c":true}}                 | 201         |
            | {"type":"TEST","searchData":{"test":"test"}}                                   | {"type":"TEST","sc_search":{"data":{"test":"test"},"metadata":{"ut_api_version":"1.0"}}} | 201         |

    Scenario: Developer sends a custom event from Middleware with valid payload
        Given the '/event' page is loaded with 'testID' name and 'sendCustomEventFromMiddlewareWithValidPayload' value query parameter
        Then the request with id 'sendCustomEventFromMiddlewareWithValidPayload' will contain:
            """
            "type":"ADD_PRODUCTS"
            """

    Scenario: Developer sends a custom event from API with valid payload
        Given a request to api '/event?testID=sendCustomEventFromAPIWithValidPayload' is sent
        Then the request with id 'sendCustomEventFromAPIWithValidPayload' will contain the 'type' in the body
        And the request with id 'sendCustomEventFromAPIWithValidPayload' will contain '\\"type\\":\\"ADD_PRODUCTS\\"' log

    Scenario Outline: Developer sends a custom event from Browser with extensionData attributes that exceed the limit
        Given the '/event' page is loaded
        And the 'sendCustomEventWithExceedExtensionData' button is clicked
        Then an error is thrown: '[IV-0005] "extensionData" supports maximum 50 attributes. Reduce the number of attributes.'

    Scenario: Developer sends a custom event from Browser without ext object
        Given the '/event' page is loaded
        When the event parameters are: '{"type": "TEST_TYPES"}'
        And the 'sendCustomEvent' button is clicked
        Then the event is sent without ext

    Scenario: Developer sends a custom event from Browser with empty ext object
        Given the '/event' page is loaded
        When the event parameters are: '{"type": "TEST_TYPES","extensionData": {}}'
        And the 'sendCustomEvent' button is clicked
        Then the event is sent without ext

    Scenario: Developer sends a custom event from API and sc_search is included in the body
        Given a request to api '/event?testID=sendCustomEventFromAPIWithSearchData' is sent
        Then the request with id 'sendCustomEventFromAPIWithSearchData' will contain the 'sc_search' in the body
        And the request with id 'sendCustomEventFromAPIWithSearchData' will contain ut_api_version in the metadata
        And the request with id 'sendCustomEventFromAPIWithSearchData' will contain 'sc_search' log

    Scenario:  Developer sends a custom event from Middleware and sc_search is included in the body
        Given the '/event' page is loaded with 'testID' name and 'sendCustomEventFromMiddlewareWithSearchData' value query parameter
        Then the request with id 'sendCustomEventFromMiddlewareWithSearchData' will contain the 'sc_search' in the body
        And the request with id 'sendCustomEventFromMiddlewareWithSearchData' will contain ut_api_version in the metadata
        And the request with id 'sendCustomEventFromMiddlewareWithSearchData' will contain 'sc_search' log