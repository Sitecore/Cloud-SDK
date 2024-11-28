Feature: Send events from event-queue (Browser-only)

    Scenario: Developer enqueues an event
        Given the '/event-queue' page is loaded
        When the event parameters are: '{"type": "ADD_PRODUCTS"}'
        And the 'addEventToQueue' button is clicked
        Then the event object is saved to the queue with 'ADD_PRODUCTS' type

    Scenario: Developer enqueues multiple events
        Given the '/event-queue' page is loaded
        When the event parameters are: '{"type": "TEST_TYPE1"}'
        And the 'addEventToQueue' button is clicked
        When the event parameters are: '{"type": "TEST_TYPE2"}'
        And the 'addEventToQueue' button is clicked
        Then the queue contains 2 events in total

    Scenario: Developer sends an event from queue
        Given the '/event-queue' page is loaded
        When the event parameters are: '{"type":"TEST_TYPE1"}'
        And the 'addEventToQueue' button is clicked
        And the 'processEventFromQueue' button is clicked
        Then the event request is sent with parameters: '{"type":"TEST_TYPE1"}'
        And the event response has status code: '201'

    Scenario: Developer sends multiple events from queue
        Given the '/event-queue' page is loaded
        When the event parameters are: '{"type":"TEST_TYPE1"}'
        And the 'addEventToQueue' button is clicked
        When the event parameters are: '{"type":"TEST_TYPE2"}'
        And the 'addEventToQueue' button is clicked
        And the 'processEventFromQueue' button is clicked
        Then the multiple events are sent in the respective order: 'TEST_TYPE1, TEST_TYPE2'

    Scenario: Developer clears the queue
        Given the '/event-queue' page is loaded
        When the event parameters are: '{"type":"TEST_TYPE1"}'
        And the 'addEventToQueue' button is clicked
        And the event object is saved to the queue with 'TEST_TYPE1' type
        When the 'clearEventsFromQueue' button is clicked
        Then the queue is null

    Scenario: Developer clears the queue even it's empty
        Given the '/event-queue' page is loaded
        When the 'clearEventsFromQueue' button is clicked
        Then the queue is null

