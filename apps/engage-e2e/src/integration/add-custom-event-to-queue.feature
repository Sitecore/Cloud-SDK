Feature: Add Custom events to queue in Session Storage

Scenario: Developer enqueues an event
    Given the '/eventqueue' page is loaded with query parameters
        | type         | 
        | ADD_PRODUCTS | 
    And the 'addEventToQueue' button is clicked
    Then the event object is saved to the queue with 'ADD_PRODUCTS' type

Scenario Outline: Developer creates custom event with ext attributes
    Given the '/eventqueue' page is loaded with query parameters
        | type         | nested   | 
        | TEST_TYPE    | <nested> |  
    And the 'addEventToQueue' button is clicked
    Then the event object is saved to the queue with 'TEST_TYPE' type
        | nested   |
        | <nested> |  

    Examples:
        | nested                   |
        | {"a":"a","b":1,"c":true} |
        | {"a":"a","b":1,"c":true} |

@Smoke-Test-Events
Scenario Outline: Developer enqueues multiple events
    Given the '/eventqueue' page is loaded with query parameters
        | type         | addMultiToQueue |
        | TEST_TYPE    | 5               |
    And the 'addEventToQueue' button is clicked
    Then the event object is saved to the queue with 'TEST_TYPE' type
    And the queue contains '5' events in total

Scenario: Developer tries to enqueue an invalid payload
    Given the '/eventqueue' page is loaded with query parameters
        | type         | extAttributesNumber | nested                   | 
        | TEST_TYPE    | 53                  | {"a":"a","b":1,"c":true} | 
    And the 'addEventToQueue' button is clicked
    Then an error is thrown: '[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.'
    And the queue is null