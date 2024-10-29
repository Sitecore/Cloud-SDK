Feature: Process Event Queue in Session Storage in order to finally send them to EP

    @Smoke-Test-Events
    Scenario: Developer processes an enqueued event
        Given the '/eventqueue' page is loaded with query parameters
            | type         |
            | ADD_PRODUCTS |
        And the 'addEventToQueue' button is clicked
        When the 'sendEventsFromQueue' button is clicked
        Then the event is sent with 'ADD_PRODUCTS' type
        And the queue is null

    Scenario: Developer processes an empty queue
        Given the '/eventqueue' page is loaded
        When the 'sendEventsFromQueue' button is clicked
        Then no error is thrown

    Scenario: Developer sends enqueued event with ext attributes
        Given the '/eventqueue' page is loaded with query parameters
            | type      | extAttributesNumber | nested                   |
            | TEST_TYPE | 3                   | {"a":"a","b":1,"c":true} |
        And the 'addEventToQueue' button is clicked
        When the 'sendEventsFromQueue' button is clicked
        Then the event is sent with 'TEST_TYPE' type
            | extAttributesNumber | nested                   |
            | 3                   | {"a":"a","b":1,"c":true} |

    Scenario Outline: Developer sends multiple enqueued events while one of them is failing to be sent
        Given the '/eventqueue' page is loaded
        And an event with null type is added to queue
        And multiple events are queued with 'TEST_TYPE1, TEST_TYPE2' types
        When the 'sendEventsFromQueue' button is clicked
        Then the multiple events are sent in the respective order: "null, TEST_TYPE1, TEST_TYPE2"
        And the queue is null

    Scenario Outline: Developer sends multiple enqueued events
        Given the '/eventqueue' page is loaded
        And multiple events are queued with 'TEST_TYPE1, TEST_TYPE2' types
        When the 'sendEventsFromQueue' button is clicked
        Then the multiple events are sent in the respective order: 'TEST_TYPE1, TEST_TYPE2'
        And the queue is null

