Feature: Request widget data from Search REST API

    Scenario: Developer requests widget data from Middleware with a valid payload
        Given the '/get-widget-data' page is loaded with 'testID' name and 'getWidgetDataFromMiddlewareWithValidPayload' value query parameter
        Then the request with id 'getWidgetDataFromMiddlewareWithValidPayload' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7"}]}
            """

    Scenario: Developer requests widget data from API with a valid payload
        Given the '/get-widget-data' page is loaded
        And the 'getWidgetDataFromAPIWithValidPayload' button is clicked
        Then the request with id 'getWidgetDataFromAPIWithValidPayload' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7"}]}
            """

    Scenario: Developer requests widget data from API with valid search object payload
        Given the '/get-widget-data' page is loaded
        And the 'getWidgetDataFromAPIWithSearchPayload' button is clicked
        Then the request with id 'getWidgetDataFromAPIWithSearchPayload' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","search":{"group_by":"type"}}]}
            """

    Scenario Outline: Developer requests widget data from browser with a valid payload
        Given the '/get-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_with_search>
            }
            """
        And Search API responds with:
            """
            {
                "items": <response>
            }
            """

        Examples:
            | items                                                                                                                                                                   | items_with_search                                                                                                                                                                       | response                                                                                                                                                     |
            | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                             | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                                             | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content", "search":{"limit":11,"offset":1}}]                                                                                           | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":11,"offset":1}}]                                                                                                            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":11,"offset":1}}]                                                                                 |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"offset": 1,"limit": 5,"content": {"attributes": ["name"]}}}]                                                     | [{"widgetId":"rfkid_7","entity":"content","search": {"offset": 1,"limit": 5,"content": {"fields": ["name"]}}}]                                                                          | [{"widgetId":"rfkid_7","entity":"content","search": {"offset": 1,"limit": 5,"content": 5}}]                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"offset": 1,"limit": 5,"content": {}}}]                                                                           | [{"widgetId":"rfkid_7","entity":"content","search": {"content":{},"offset": 1,"limit": 5}}]                                                                                             | [{"widgetId":"rfkid_7","entity":"content","search": {"offset": 1,"limit": 5,"content": 5}}]                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                             | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                                             | [{"widgetId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 0,"content": 10}}]                                                                |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"limit": 10, "content": {}}}]                                                                                     | [{"widgetId":"rfkid_7","entity":"content","search": {"content":{},"limit": 10}}]                                                                                                        | [{"widgetId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 0,"content": 10}}]                                                                |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"attributes": ["name"]}}}]                                                                | [{"widgetId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}}}]                                                                                     | [{"widgetId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 5,"content": 10}}]                                                                |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"attributes": ["name"]}, "query": {"keyphrase": "symposium"}}}]                           | [{"widgetId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "symposium"}}}]                                                | [{"widgetId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 5,"content": 10, "query": {"keyphrase": "symposium"}}}]                           |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"attributes": ["name"]}, "query": {"keyphrase": "XB123!*&)-+"}}}]                         | [{"widgetId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "XB123!*&)-+"}}}]                                              | [{"widgetId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 5,"content": 10, "query": {"keyphrase": "XB123!*&)-+"}}}]                         |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"attributes": ["name"]}, "query": {"keyphrase": "Sitecore Ireland", "operator": "or"}}}]  | [{"widgetId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "Sitecore Ireland", "operator": "or"}}}]                       | [{"widgetId":"rfkid_7","entity":"content","search": {"limit":10, "offset": 5,"content": 10, "query": {"keyphrase": "Sitecore Ireland", "operator": "or"}}}]  |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"attributes": ["name"]}, "query": {"keyphrase": "Sitecore Ireland", "operator": "and"}}}] | [{"widgetId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "Sitecore Ireland", "operator": "and"}}}]                      | [{"widgetId":"rfkid_7","entity":"content","search": {"limit":10, "offset": 5,"content": 10, "query": {"keyphrase": "Sitecore Ireland", "operator": "and"}}}] |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"content": {}, "filter": "add"}}]                                                                                 | [{"widgetId":"rfkid_7","entity":"content","search": {"content":{},"filter" : {"name": "location", "type": "geoDistance", "distance": "3000km", "lat": -16.181724, "lon": -47.277881}}}] | {}                                                                                                                                                           |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"content": {}, "filter": "remove"}}]                                                                              | [{"widgetId":"rfkid_7","entity":"content","search":{"content": {}}}]                                                                                                                    | [{"widgetId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 0,"content": 10}}]                                                                |



    Scenario Outline: Developer requests widget data from browser without widget items
        Given the '/get-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getWidgetData' button is clicked
        Then an error is thrown: '<error_code>'
        Examples:
            | items                                                                                                                                                                                     | error_code                                                                                                      |
            | []                                                                                                                                                                                        | [MV-0012] The "widgetItems" array must contain a minimum of 1 item.                                             |
            | [{"widgetId":" ","entity":"content"}]                                                                                                                                                     | [MV-0011] "widgetId" is required.                                                                               |
            | [{"widgetId":"rfkid_7","entity":" "}]                                                                                                                                                     | [MV-0010] "entity" is required.                                                                                 |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":101,"offset":0}}]                                                                                                             | [IV-0007] Incorrect value for "limit". Set the value to an integer between 1 and 100 inclusive.                 |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":-1}}]                                                                                                             | [IV-0008] Incorrect value for "offset". Set the value to an integer greater than or equal to 0.                 |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"query": {"keyphrase": "aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa"}}}] | [IV-0009] Incorrect value for "​keyphrase"​​. Set the value to a string between 1 and 100 characters inclusive. |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"query": {"keyphrase": ""}}}]                                                                                                       | [IV-0009] Incorrect value for "​keyphrase"​​. Set the value to a string between 1 and 100 characters inclusive. |


    Scenario Outline: Developer requests widget data with context object from browser with a valid payload
        Given the '/get-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the context parameters are:
            """
            {
                "context": <context_params>
            }
            """
        And the 'getWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items>,
                "context": <context_payload>
            }
            """
        Examples:
            | items                                                                        | context_params                                                                                                                    | context_payload                                                                                                                     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"}}                                                                                       | {"locale":{"country":"us","language":"en"}}                                                                                         |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"browser":{"appType":"testAppType","device":"testDevice","userAgent":"testUserAgent"},"locale":{"country":"us","language":"en"}} | {"browser":{"app_type":"testAppType","device":"testDevice","user_agent":"testUserAgent"},"locale":{"country":"us","language":"en"}} |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"page":{"uri":"/test"}}                                                                | {"locale":{"country":"us","language":"en"},"page":{"uri":"/test"}}                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"page":{"uri":"/products"}}                                                            | {"locale":{"country":"us","language":"en"},"page":{"uri":"/products"}}                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"page":{"uri":"https://www.example.com/products"}}                                     | {"locale":{"country":"us","language":"en"},"page":{"uri":"https://www.example.com/products"}}                                       |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"geo":{"ip":"123.456.0.1","location":{"latitude":3,"longitude":40}},"locale":{"country":"us","language":"en"}}                   | {"geo":{"ip":"123.456.0.1","location":{"lat":3,"lon":40}},"locale":{"country":"us","language":"en"}}                                |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"user":{"userId":"tuid"}}                                                                                                        | {"user":{"user_id":"tuid"}}                                                                                                         |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"user":{"uuid":"123"}}                                                                                                           | {"user":{"uuid":"123"}}                                                                                                             |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"user":{"uuid":"123", "userId": "tuid"}}                                                                                         | {"user":{"uuid":"123", "user_id": "tuid"}}                                                                                          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"user":{"userId":"tuid","custom":{"key1":"value1","key2":"value2"}}}                                                             | {"user":{"user_id":"tuid", "custom":{"key1":"value1","key2":"value2"}}}                                                             |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"ids":{"test":["test"]},"locale":{"country":"us","language":"en"}}                                                               | {"ids":{"test":["test"]},"locale":{"country":"us","language":"en"}}                                                                 |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"ids":{},"locale":{"country":"us","language":"en"}}                                                                              | {"locale":{"country":"us","language":"en"}}                                                                                         |

    Scenario Outline: Developer requests widget data with context object from browser with an invalid context
        Given the '/get-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the context parameters are:
            """
            {
                "context": <context>
            }
            """
        And the 'getWidgetData' button is clicked
        Then an error is thrown: '<error_code>'
        Examples:
            | items                                                                        | context                                                                                                           | error_code                                                                                                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"usa","language":"en"}}                                                                      | [IV-0010] Incorrect value for "country". Format the value according to ISO 3166-1 alpha-2.                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"english"}}                                                                  | [IV-0011] Incorrect value for "language". Format the value according to ISO 639.                                                                        |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"store":{"id":"123"}}                                                  | [MV-0009] You must set values for both "groupId" and "id" if you set a value for one of them.                                                           |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"geo":{"ip":"123.456.0.1","location":{"latitude":91,"longitude":40}},"locale":{"country":"us","language":"en"}}  | [IV-0012] Incorrect value for "latitude". Set the value to an integer or decimal between -90.000000 and 90.000000 inclusive.                            |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"geo":{"ip":"123.456.0.1","location":{"latitude":40,"longitude":181}},"locale":{"country":"us","language":"en"}} | [IV-0013] Incorrect value for "longitude". Set the value to an integer or decimal between -180.000000 and 180.000000 inclusive.                         |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"user":{"custom":{"key1":"value1","key2":"value2"}}}                                                             | [MV-0013] You must set a value for "userId" or "uuid".                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"user":{}}                                                                                                       | [MV-0013] You must set a value for "userId" or "uuid".                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"page":{"uri":""}}                                                     | [IV-0025] Incorrect value for "uri" in "page". Set the value to a relative or absolute path. Examples: "/products", "https://www.example.com/products". |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"page":{"uri":"   "}}                                                  | [IV-0025] Incorrect value for "uri" in "page". Set the value to a relative or absolute path. Examples: "/products", "https://www.example.com/products". |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"page":{"uri":null}}                                                   | [IV-0025] Incorrect value for "uri" in "page". Set the value to a relative or absolute path. Examples: "/products", "https://www.example.com/products". |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"page":{}}                                                             | [IV-0025] Incorrect value for "uri" in "page". Set the value to a relative or absolute path. Examples: "/products", "https://www.example.com/products". |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}] | {"locale":{"country":"us","language":"en"},"page":{"uri":123}}                                                    | [IV-0025] Incorrect value for "uri" in "page". Set the value to a relative or absolute path. Examples: "/products", "https://www.example.com/products". |