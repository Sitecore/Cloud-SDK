Feature: Send form events (Browser only)

    Scenario: Developer sends a form event from Browser with valid payload
        Given the '/form' page is loaded
        When the form parameters are: '<formId>','<interactionType>','<componentInstanceId>'
        And the 'sendForm' button is clicked
        Then the event request is sent with parameters: '<item_request_payload>'
        And the event response has status code: '<status_code>'

        Examples:
            | formId | interactionType | componentInstanceId | item_request_payload                                                                             | status_code |
            | 123    | VIEWED          | test2               | {"type":"FORM", "ext":{"formId":"123","interactionType":"VIEWED","componentInstanceId":"test2"}} | 201         |
