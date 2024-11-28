Feature: Send identity events
    Scenario: Developer sends an identity event from Middleware with valid payload
        Given the '/identity' page is loaded with 'testID' name and 'sendIdentityFromMiddlewareWithValidPayload' value query parameter
        Then the request with id 'sendIdentityFromMiddlewareWithValidPayload' will contain:
            """
            "type":"IDENTITY"
            """

    Scenario: Developer sends an identity event from Browser with full IdentityEvent payload
        Given the '/identity' page is loaded
        When the identity parameters are:
            """
            {
                "city": "Athens",
                "country": "Greece",
                "dob": "2000-11-25T00:00",
                "email": "test@gmail.com",
                "firstName": "John",
                "gender": "male",
                "identifiers": [
                    {
                        "id": "test@gmail.com",
                        "provider": "email"
                    }
                ],
                "lastName": "Doe",
                "mobile": "6941234567",
                "phone": "2101234567",
                "postalCode": "12345",
                "state": "state",
                "street": "street",
                "title": "Mr."
            }
            """
        And the 'sendIdentityEvent' button is clicked
        Then the event request is sent with parameters:
            """
            {
                "city": "Athens",
                "country": "Greece",
                "dob": "2000-11-25T00:00",
                "email": "test@gmail.com",
                "firstname": "John",
                "gender": "male",
                "identifiers": [
                    {
                        "id": "test@gmail.com",
                        "provider": "email"
                    }
                ],
                "lastname": "Doe",
                "mobile": "6941234567",
                "phone": "2101234567",
                "postal_code": "12345",
                "state": "state",
                "street": "street",
                "title": "Mr."
            }
            """
        And the event response has status code: '201'

    Scenario: Developer sends identity events from Browser with valid payloads
        Given the '/identity' page is loaded
        When the identity parameters are: '<item>'
        And the 'sendIdentityEvent' button is clicked
        Then the event request is sent with parameters: '<item_request_payload>'
        And the event response has status code: '<status_code>'

        Examples:
            | item                                                                | item_request_payload                                             | status_code |
            | { "identifiers": [{ "id": "test@gmail.com", "provider": "email" }]} | {"identifiers": [{ "id":"test@gmail.com", "provider": "email"}]} | 201         |

    Scenario: Developer sends an identity event from API with valid payload
        Given a request to api '/identity?testID=sendIdentityEventFromAPIWithValidPayload' is sent
        Then the request with id 'sendIdentityEventFromAPIWithValidPayload' will contain the 'type' in the body
        And the request with id 'sendIdentityEventFromAPIWithValidPayload' will contain '\\"type\\":\\"IDENTITY\\"' log

    Scenario Outline: Developer creates an identity event from Browser with ext attributes that exceed the limit
        Given the '/identity' page is loaded
        And the 'sendIdentityEventWithExceedExtensionData' button is clicked
        Then an error is thrown: '[IV-0005] "extensionData" supports maximum 50 attributes. Reduce the number of attributes.'

    Scenario: Developer sends identity events from Browser with invalid payloads
        Given the '/identity' page is loaded
        When the identity parameters are: '<item>'
        And the 'sendIdentityEvent' button is clicked
        Then an error is thrown: '<error_code>'

        Examples:
            | item                                       | error_code                                                                          |
            | { "identifiers":[]}                        | [MV-0003] "identifiers" is required.                                                |
            | { "dob": "test", "identifiers": [{}]}      | [IV-0002] Incorrect value for "dob". Format the value according to ISO 8601.        |
            | { "email": "test", "identifiers": [{}]}    | [IV-0003] Incorrect value for "email". Set the value to a valid email address.      |
            | { "identifiers": [{"expiryDate": "test"}]} | [IV-0004] Incorrect value for "expiryDate". Format the value according to ISO 8601. |
