Feature: Send Custom events unique to an organization

    @Smoke-Test-Events
    Scenario: Developer sends custom event from server
        Given the '/customevent' page is loaded
        And the 'sendEventFromServer' button is clicked
        Then the event is sent successfully from the server

    Scenario Outline: Developer creates custom event
        Given the '/customevent' page is loaded
        When the event parameters are:
            """
            {
                "type": "ADD_PRODUCTS"
            }
            """
        And the 'sendEvent' button is clicked
        Then the event request is sent with parameters:
            """
            {
                "type": "ADD_PRODUCTS"
            }
            """

    Scenario Outline: Developer creates custom event with ext object containing nested attributes
        Given the '/customevent' page is loaded
        When the event parameters are:
            """
            {
                "type": "TEST_TYPE",
                "ext": {
                    "test": {
                        "a": "a",
                        "b": 1,
                        "c": true
                    }
                }
            }
            """
        And the 'sendEvent' button is clicked
        Then the event request is sent with parameters:
            """
            {
                "type": "TEST_TYPE",
                "ext": {
                    "test_a": "a",
                    "test_b": 1,
                    "test_c": true
                }
            }
            """

    @Smoke-Test-Events
    Scenario Outline: Developer creates custom event with up to 50 ext attributes
        Given the '/customevent' page is loaded
        When the event parameters are:
            """
            {
                "type": "TEST_TYPE",
                "ext": {
                    "test": {
                        "a": "a",
                        "b": 1,
                        "c": true
                    }
                }
            }
            """
        And '47' ext attributes are added
        And the 'sendEvent' button is clicked
        Then ext contains '50' attributes

    Scenario Outline: Developer creates custom event with ext attributes that exceed the limit
        Given the '/customevent' page is loaded
        When the event parameters are:
            """
            {
                "type": "TEST_TYPE",
                "ext": {
                    "test": {
                        "a": "a",
                        "b": 1,
                        "c": true
                    }
                }
            }
            """
        And '<extAttributesNumber>' ext attributes are added
        And the 'sendEvent' button is clicked
        Then an error is thrown: '[IV-0005] "extensionData" supports maximum 50 attributes. Reduce the number of attributes.'

        Examples:
            | extAttributesNumber |
            | 48                  |
            | 100                 |

    Scenario: Developer sends custom event without ext object
        Given the '/customevent' page is loaded
        Given the '/customevent' page is loaded
        When the event parameters are:
            """
            {
                "type": "TEST_TYPES"
            }
            """
        And the 'sendEvent' button is clicked
        Then the event is sent without ext

    Scenario: Developer sends custom event with emtpy ext object
        Given the '/customevent' page is loaded
        When the event parameters are:
            """
            {
                "type": "TEST_TYPES",
                "ext": {}
            }
            """
        And the 'sendEvent' button is clicked
        Then the event is sent without ext

    Scenario Outline: Developer creates custom event with both ext and top level attributes
        Given the '/customevent' page is loaded
        When the event parameters are:
            """
            {
                "type": "TEST_TYPE",
                "topLevelAttr0": "test0",
                "uid": 123,
                "booleanValue": true,
                "ext": {
                    "test": {
                        "a": "a"
                    }
                }
            }
            """
        And the 'sendEvent' button is clicked
        Then the event request is sent with parameters:
            """
            {
                "type": "TEST_TYPE",
                "topLevelAttr0": "test0",
                "uid": 123,
                "booleanValue": true,
                "ext": {
                    "test_a": "a"
                }
            }
            """