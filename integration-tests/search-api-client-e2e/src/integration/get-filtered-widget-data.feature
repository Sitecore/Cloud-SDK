Feature: Request search widget data from Search REST API

    Scenario: Developer requests filtered widget data from Middleware with a valid payload
        Given the '/get-filtered-widget-data' page is loaded with 'testID' name and 'getFilteredWidgetDataFromMiddlewareWithValidPayload' value query parameter
        Then the request with id 'getFilteredWidgetDataFromMiddlewareWithValidPayload' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","search":{"filter":{"name":"test","type":"eq","value":10}}}]}
            """

    Scenario: Developer search requests filtered widget data from API with a valid payload
        Given the '/get-filtered-widget-data' page is loaded
        And the 'getFilteredWidgetDataFromAPIWithValidPayload' button is clicked
        Then the request with id 'getFilteredWidgetDataFromAPIWithValidPayload' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","search":{"filter":{"name":"test","type":"eq","value":10}}}]}
            """

    Scenario Outline: Developer requests search filtered widget data from browser with a valid payload
        Given the '/get-filtered-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items_payload>
            }
            """
        And the 'getFilteredWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items_payload                                                                                                                                                            |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"eq","name":"test","value":"test"}}}]                                                               |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"lt","name":"test","value":50}}}]                                                                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"gt","name":"test","value":50}}}]                                                                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"gte","name":"test","value":50}}}]                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"lte","name":"test","value":50}}}]                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"and","filters":[{"type":"lt","name":"test","value":50},{"type":"gt","name":"test","value":0}]}}}]  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"or","filters":[{"type":"lt","name":"test","value":50},{"type":"gt","name":"test","value":0}]}}}]   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"not","filter":{"type":"lt","name":"test","value":50}}}}]                                           |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"allOf","name":"test","values":[1,2,3]}}}]                                                          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"anyOf","name":"test","values":[1,2,3]}}}]                                                          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoDistance","name":"test"}}}]                                                                     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoDistance","name":"test","distance":"10km"}}}]                                                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoDistance","name":"test","lat":0,"lon":0}}}]                                                     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoDistance","name":"test","lat":0,"lon":0,"distance":"10km"}}}]                                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoWithin","name":"test","coordinates":[{"lat":0,"lon":0},{"lat":0,"lon":0},{"lat":0,"lon":0}]}}}] |



    Scenario Outline: Developer requests search widget data from browser with invalid filter values
        Given the '/get-filtered-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getFilteredWidgetData' button is clicked
        Then an error is thrown: '<error_code>'

        Examples:
            | items                                                                                                                                                                      | error_code                                                                                                                      |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoDistance","name":"test","lat":200,"lon":0}}}]                                                     | [IV-0012] Incorrect value for "latitude". Set the value to an integer or decimal between -90.000000 and 90.000000 inclusive.    |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoDistance","name":"test","lat":0,"lon":200}}}]                                                     | [IV-0013] Incorrect value for "longitude". Set the value to an integer or decimal between -180.000000 and 180.000000 inclusive. |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoDistance","name":"test","lat":-200,"lon":0}}}]                                                    | [IV-0012] Incorrect value for "latitude". Set the value to an integer or decimal between -90.000000 and 90.000000 inclusive.    |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoDistance","name":"test","lat":0,"lon":-200}}}]                                                    | [IV-0013] Incorrect value for "longitude". Set the value to an integer or decimal between -180.000000 and 180.000000 inclusive. |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoWithin","name":"test","coordinates":[{"lat":200,"lon":0},{"lat":0,"lon":0},{"lat":0,"lon":0}]}}}] | [IV-0012] Incorrect value for "latitude". Set the value to an integer or decimal between -90.000000 and 90.000000 inclusive.    |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoWithin","name":"test","coordinates":[{"lat":0,"lon":0},{"lat":200,"lon":0},{"lat":0,"lon":0}]}}}] | [IV-0012] Incorrect value for "latitude". Set the value to an integer or decimal between -90.000000 and 90.000000 inclusive.    |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoWithin","name":"test","coordinates":[{"lat":0,"lon":0},{"lat":0,"lon":0},{"lat":200,"lon":0}]}}}] | [IV-0012] Incorrect value for "latitude". Set the value to an integer or decimal between -90.000000 and 90.000000 inclusive.    |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoWithin","name":"test","coordinates":[{"lat":0,"lon":200},{"lat":0,"lon":0},{"lat":0,"lon":0}]}}}] | [IV-0013] Incorrect value for "longitude". Set the value to an integer or decimal between -180.000000 and 180.000000 inclusive. |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoWithin","name":"test","coordinates":[{"lat":0,"lon":0},{"lat":0,"lon":200},{"lat":0,"lon":0}]}}}] | [IV-0013] Incorrect value for "longitude". Set the value to an integer or decimal between -180.000000 and 180.000000 inclusive. |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"filter":{"type":"geoWithin","name":"test","coordinates":[{"lat":0,"lon":0},{"lat":0,"lon":0},{"lat":0,"lon":200}]}}}] | [IV-0013] Incorrect value for "longitude". Set the value to an integer or decimal between -180.000000 and 180.000000 inclusive. |
