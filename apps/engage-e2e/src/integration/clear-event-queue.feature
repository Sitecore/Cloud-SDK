Feature: Clear Event Queue from Session Storage

@Smoke-Test
Scenario: Developer calls clearEventQueue when event is added in the queue
    Given the '/eventqueue' page is loaded with query parameters
        | type         | 
        | ADD_PRODUCTS | 
    And the 'addEventToQueue' button is clicked
    And the event object is saved to the queue with 'ADD_PRODUCTS' type
    When the 'clearQueue' button is clicked
    Then the queue is null

Scenario: Developer calls clearEventQueue when queue is null
    Given the '/eventqueue' page is loaded    
    When the 'clearQueue' button is clicked
    Then the queue is null

Scenario: Developer saves event after clearEventQueue is called
    Given the '/eventqueue' page is loaded with query parameters
        | type         | 
        | ADD_PRODUCTS | 
    When the 'clearQueue' button is clicked
    And the 'addEventToQueue' button is clicked
    Then the event object is saved to the queue with 'ADD_PRODUCTS' type



 
   